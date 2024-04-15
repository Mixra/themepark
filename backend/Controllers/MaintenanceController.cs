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

    }
}
