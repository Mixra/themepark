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

            return Ok(parsed);
        }

        [HttpGet("shops")]
        [Authorize(Roles = "999")]
        public async Task<IActionResult> GetShops()
        {
            var sql = "SELECT ShopID as EntityID, Name as EntityName FROM GiftShops";

            var shops = await _databaseService.QueryAsync<dynamic>(sql);

            var parsed = shops.Select(x => new
            {
                EntityID = x.EntityID,
                EntityName = x.EntityName
            });

            return Ok(parsed);
        }

        [HttpGet("restaurants")]
        [Authorize(Roles = "999")]
        public async Task<IActionResult> GetRestaurants()
        {
            var sql = "SELECT RestaurantID as EntityID, Name as EntityName FROM Restaurants";

            var restaurants = await _databaseService.QueryAsync<dynamic>(sql);

            var parsed = restaurants.Select(x => new
            {
                EntityID = x.EntityID,
                EntityName = x.EntityName
            });

            return Ok(parsed);
        }

        [HttpGet("areas")]
        [Authorize(Roles = "999")]
        public async Task<IActionResult> GetAreas()
        {
            var sql = "SELECT AreaID as EntityID, Name as EntityName FROM ParkAreas";

            var areas = await _databaseService.QueryAsync<dynamic>(sql);

            var parsed = areas.Select(x => new
            {
                EntityID = x.EntityID,
                EntityName = x.EntityName
            });

            return Ok(parsed);
        }

        [HttpGet]
        [Authorize(Roles = "999")]
        public async Task<IActionResult> GetMaintenanceRecords()
        {
            var query = @"
            SELECT
                m.*,
                (
                    SELECT
                        EntityType,
                        EntityID,
                        EntityName,
                        ClosureStatus
                    FROM
                        MaintenanceAffectedEntities
                    WHERE
                        MaintenanceID = m.MaintenanceID
                    FOR JSON PATH
                ) AS AffectedEntities
            FROM
                Maintenance m
                
            ORDER BY
                m.MaintenanceStartDate DESC;
            ";

            var maintenanceRecords = await _databaseService.QueryAsync<dynamic>(query);

            var parsed = maintenanceRecords.Select(m => new
            {
                MaintenanceID = m.MaintenanceID,
                MaintenanceStartDate = m.MaintenanceStartDate,
                MaintenanceEndDate = m.MaintenanceEndDate,
                Reason = m.Reason,
                Description = m.Description,
                AffectedEntities = m?.AffectedEntities != null ? JsonConvert.DeserializeObject<List<AffectedEntityModel>>(m.AffectedEntities) : null
            });

            return Ok(parsed);
        }

        [HttpPost]
        [Authorize(Roles = "999")]
        public async Task<IActionResult> CreateMaintenance([FromBody] MaintenanceModel maintenance)
        {
            var maintenanceID = await _databaseService.ExecuteInsertAsync(@"
                INSERT INTO Maintenance (MaintenanceStartDate, MaintenanceEndDate, Reason, Description)
                VALUES (@MaintenanceStartDate, @MaintenanceEndDate, @Reason, @Description)", maintenance);

            if (maintenance.AffectedEntities == null || maintenance.AffectedEntities.Count == 0)
            {
                return Ok(new { message = "Maintenance record created successfully", MaintenanceID = maintenanceID });
            }

            foreach (var affectedEntity in maintenance.AffectedEntities)
            {
                Console.WriteLine($"Affected Entity: {affectedEntity.EntityType}, {affectedEntity.EntityID}, {affectedEntity.EntityName}");
                await _databaseService.ExecuteAsync(@"
                    INSERT INTO MaintenanceAffectedEntities (MaintenanceID, EntityType, EntityID, EntityName, ClosureStatus)
                    VALUES (@MaintenanceID, @EntityType, @EntityID, @EntityName, @ClosureStatus);", new
                {
                    MaintenanceID = maintenanceID,
                    EntityType = affectedEntity.EntityType,
                    EntityID = affectedEntity.EntityID,
                    EntityName = affectedEntity.EntityName,
                    ClosureStatus = affectedEntity.ClosureStatus
                });
            }

            return Ok(new { message = "Maintenance record created successfully", MaintenanceID = maintenanceID });
        }


        [HttpPut("{MaintenanceID}")]
        [Authorize(Roles = "999")]
        public async Task<IActionResult> UpdateMaintenance(int MaintenanceID, [FromBody] MaintenanceModel maintenance)
        {
            await _databaseService.ExecuteAsync(@"
            UPDATE Maintenance
            SET MaintenanceStartDate = @MaintenanceStartDate,
                MaintenanceEndDate = @MaintenanceEndDate,
                Reason = @Reason,
                Description = @Description
            WHERE MaintenanceID = @MaintenanceID", new
            {
                MaintenanceID = MaintenanceID,
                MaintenanceStartDate = maintenance.MaintenanceStartDate,
                MaintenanceEndDate = maintenance.MaintenanceEndDate,
                Reason = maintenance.Reason,
                Description = maintenance.Description
            });

            var existingAffectedEntities = await _databaseService.QueryAsync<AffectedEntityModel>(@"
            SELECT EntityType, EntityID, EntityName, ClosureStatus
            FROM MaintenanceAffectedEntities
            WHERE MaintenanceID = @MaintenanceID", new { MaintenanceID });

            var entitiesToAdd = maintenance.AffectedEntities.Where(e => !existingAffectedEntities.Any(ex => ex.EntityType == e.EntityType && ex.EntityID == e.EntityID));
            var entitiesToUpdate = maintenance.AffectedEntities.Where(e => existingAffectedEntities.Any(ex => ex.EntityType == e.EntityType && ex.EntityID == e.EntityID && ex.ClosureStatus != e.ClosureStatus));
            var entitiesToDelete = existingAffectedEntities.Where(e => !maintenance.AffectedEntities.Any(ex => ex.EntityType == e.EntityType && ex.EntityID == e.EntityID));

            foreach (var entity in entitiesToAdd)
            {
                await _databaseService.ExecuteAsync(@"
                INSERT INTO MaintenanceAffectedEntities (MaintenanceID, EntityType, EntityID, EntityName, ClosureStatus)
                VALUES (@MaintenanceID, @EntityType, @EntityID, @EntityName, @ClosureStatus);", new
                {
                    MaintenanceID = MaintenanceID,
                    EntityType = entity.EntityType,
                    EntityID = entity.EntityID,
                    EntityName = entity.EntityName,
                    ClosureStatus = entity.ClosureStatus
                });
            }

            foreach (var entity in entitiesToUpdate)
            {
                await _databaseService.ExecuteAsync(@"
                UPDATE MaintenanceAffectedEntities
                SET ClosureStatus = @ClosureStatus
                WHERE MaintenanceID = @MaintenanceID AND EntityType = @EntityType AND EntityID = @EntityID;", new
                {
                    MaintenanceID = MaintenanceID,
                    EntityType = entity.EntityType,
                    EntityID = entity.EntityID,
                    ClosureStatus = entity.ClosureStatus
                });
            }

            foreach (var entity in entitiesToDelete)
            {
                await _databaseService.ExecuteAsync(@"
                DELETE FROM MaintenanceAffectedEntities
                WHERE MaintenanceID = @MaintenanceID AND EntityType = @EntityType AND EntityID = @EntityID;", new
                {
                    MaintenanceID = MaintenanceID,
                    EntityType = entity.EntityType,
                    EntityID = entity.EntityID
                });
            }

            return Ok(new { message = "Maintenance record updated successfully" });
        }



        [Authorize(Roles = "999")]
        [HttpDelete("{MaintenanceID}")]
        public async Task<IActionResult> DeleteMaintenance(int MaintenanceID)
        {
            await _databaseService.ExecuteAsync("DELETE FROM Maintenance WHERE MaintenanceID = @MaintenanceID", new { MaintenanceID });

            return Ok(new { message = "Maintenance deleted successfully" });
        }


    }


}