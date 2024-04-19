using backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using backend.Models;
using backend.Utils;
using Isopoh.Cryptography.Argon2;
using Newtonsoft.Json;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MaintenanceController : ControllerBase
    {
        private readonly DatabaseService _databaseService;
        private readonly IConfiguration _configuration;

        public MaintenanceController(DatabaseService databaseService, IConfiguration configuration)
        {
            _databaseService = databaseService;
            _configuration = configuration;
        }


        [HttpGet("rides")]
        [Authorize(Roles = "999")]
        public async Task<IActionResult> GetRides()
        {
            var sql = "SELECT RideID as EntityID, Name as EntityName FROM Rides";

            var rides = await _databaseService.QueryAsync<dynamic>(sql);

            var parsed = rides.Select(x => new
            {
                EntityID = x.EntityID,
                EntityName = x.EntityName
            });

            return Ok(rides);
        }
[HttpGet("maintenance")]
[Authorize (Roles = "999")]
public async Task<IActionResult> GetMaintenanceRecords()
{
    var query = @"
        SELECT
            m.*,
            (
                SELECT
                    EntityType,
                    EntityID,
                    ClosureStatus
                FROM
                    MaintenanceAffectedEntities
                WHERE
                    MaintenanceID = m.MaintenanceID
                FOR JSON PATH
            ) AS AffectedEntities
        FROM
            Maintenance m";

    var maintenanceRecords = await _databaseService.QueryAsync<dynamic>(query);

    var parsed = maintenanceRecords.Select(m => new
    {
        MaintenanceID = m.MaintenanceID,
        MaintenanceStartDate = m.MaintenanceStartDate,
        MaintenanceEndDate = m.MaintenanceEndDate,
        Reason = m.Reason,
        Description = m.Description,
        RequireClosure = m.RequireClosure,
        AffectedEntities = m.AffectedEntities != null ? JsonConvert.DeserializeObject<List<AffectedEntityModel>>(m.AffectedEntities) : null
    });

    return Ok(parsed);
}

[Authorize(Roles = "999")]
[HttpDelete("maintenance/{MaintenanceID}")]
public async Task<IActionResult> DeleteMaintenance(int MaintenanceID)
{
    try
    {
        // First delete the dependent records in MaintenanceAffectedEntities
        int affectedEntitiesDeleted = await _databaseService.ExecuteAsync("DELETE FROM MaintenanceAffectedEntities WHERE MaintenanceID = @MaintenanceID", new { MaintenanceID });

        // Then delete the record in Maintenance if the first deletion was successful
        if (affectedEntitiesDeleted >= 0) // If the first delete command did not throw an exception
        {
            int maintenanceDeleted = await _databaseService.ExecuteAsync("DELETE FROM Maintenance WHERE MaintenanceID = @MaintenanceID", new { MaintenanceID });
            if (maintenanceDeleted > 0)
            {
                return Ok(new { message = "Maintenance deleted successfully" });
            }
            else
            {
                return NotFound(new { message = "Maintenance not found" });
            }
        }
        else
        {
            return StatusCode(500, new { message = "Failed to delete maintenance affected entities" });
        }
    }
    catch (Exception ex)
    {
        // Log the exception (consider using a logging framework)
        // Log.Error(ex, "Error deleting maintenance");

        // Return an appropriate error response
        return StatusCode(500, new { message = "Error deleting maintenance" });
    }
}



[Authorize(Roles = "999")]
[HttpPut("maintenance/{MaintenanceID}")]
public async Task<IActionResult> EditMaintenance(int MaintenanceID, [FromBody] MaintenanceModel data)
{
    try
    {
        await _databaseService.ExecuteAsync(@"
            UPDATE Maintenance 
            SET 
                MaintenanceStartDate = @MaintenanceStartDate, 
                MaintenanceEndDate = @MaintenanceEndDate, 
                Reason = @Reason, 
                Description = @Description, 
                RequireClosure = @RequireClosure 
            WHERE MaintenanceID = @MaintenanceID", 
            new { data.MaintenanceStartDate, data.MaintenanceEndDate, data.Reason, data.Description, data.RequireClosure, MaintenanceID });

        // Assuming you will also update the affected entities, you would handle it here.

        return Ok(new { message = "Maintenance updated successfully" });
    }
    catch (Exception ex)
    {
        Console.WriteLine($"An error has occurred: {ex.Message}");
        return StatusCode(500, new { error = "An error occurred while updating the maintenance record." });
    }
}


[Authorize(Roles = "999")]
[HttpPost("maintenance")]
public async Task<IActionResult> CreateMaintenance([FromBody] MaintenanceModel data)
{
    await _databaseService.ExecuteAsync(@"
        INSERT INTO Maintenance 
            (MaintenanceStartDate, MaintenanceEndDate, Reason, Description, RequireClosure) 
        VALUES 
            (@MaintenanceStartDate, @MaintenanceEndDate, @Reason, @Description, @RequireClosure)", 
        data);

    // Retrieve the newly created MaintenanceID
    var maintenanceId = await _databaseService.QuerySingleAsync<int>(
        "SELECT IDENT_CURRENT('Maintenance')", null);

    // Insert related affected entities
    if(data.AffectedEntities != null)
    {
        foreach (var entity in data.AffectedEntities)
        {
            await _databaseService.ExecuteAsync(@"
                INSERT INTO MaintenanceAffectedEntities 
                    (MaintenanceID, EntityType, EntityID, ClosureStatus) 
                VALUES 
                    (@MaintenanceID, @EntityType, @EntityID, @ClosureStatus)", 
                new { MaintenanceID = maintenanceId, entity.EntityType, entity.EntityID, entity.ClosureStatus });
        }
    }

    return Ok(new { message = "Maintenance created successfully", MaintenanceID = maintenanceId });
}



    
}


}

/*Table Maintenance {
  MaintenanceID int [pk, increment]
  MaintenanceStartDate datetime
  MaintenanceEndDate datetime [null]
  Reason varchar
  Description varchar
  RequireClosure bit
}
Table MaintenanceAffectedEntities {
  MaintenanceID int [ref: > Maintenance.MaintenanceID]
  EntityType varchar 
  EntityID int
  ClosureStatus bit 
  Indexes {
    (MaintenanceID, EntityType, EntityID) [unique]
  }
}*/