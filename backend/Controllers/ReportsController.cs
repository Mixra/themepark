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
    public class ReportsController : ControllerBase
    {
        private readonly DatabaseService _databaseService;
        private readonly IConfiguration _configuration;

        public ReportsController(DatabaseService databaseService, IConfiguration configuration)
        {
            _databaseService = databaseService;
            _configuration = configuration;
        }
        
        [HttpGet("employee")]
        [Authorize(Roles = "999")]
        public async Task<IActionResult> GenerateEmployeeReports()
        {
            var sql = "EXEC GetEmployeeReports;";

            var employeeReports = await _databaseService.QueryAsync<dynamic>(sql);

            var parsed = employeeReports.Select(x => new
            {
                Username = x.Username,
                fullName = x.FullName,
                assignedPark = x.AssignedPark,
                employeeRole = x.Role,
                employeeStatus = x.Status
            });

            return Ok(parsed);
        }

        //sales
        [HttpPost("sales")]
        [Authorize(Roles = "999")]
        public async Task<IActionResult> AllSales([FromBody] SalesModel data)
        {
            var sql = "EXEC allSales @StartDate, @EndDate";

            var salesReport = await _databaseService.QueryAsync<dynamic>(
            sql, new { StartDate = data.StartDate, EndDate = data.EndDate }
            );

            var parsed = salesReport.Select(s => new
            {
                totalSales = s.TotalSales,
                rideSales = s.RideSales,
                giftShopSales = s.GiftShopSales,
                bestRide = s.BestRide,
                leastPerformingRide = s.LeastPerformingRide,
                bestGiftshop = s.BestGiftshop,
                worstGiftshop = s.WorstGiftshop
            });

            return Ok(parsed);
        }

    }

}

        // [HttpGet("maintenance")]
        // [Authorize(Roles = "999")]
        // public async Task<IActionResult> GetMaintenanceReports()
        // {
        //     var sql = "EXEC GetMaintenanceReports @StartDate = '2024-01-01', @EndDate = '2024-12-31'";

        //     var maintenanceReport = await _databaseService.QueryAsync<dynamic>(sql);

        //     var parsed = maintenanceReport.Select(m => new{
        //         entityType = m.EntityType,
        //         entityID = m.EntityID,
        //         maintenanceStartDate = m.MaintenanceStartDate,
        //         maintenanceEndDate = m.MaintenanceEndDate,
        //         reason = m.Reason,
        //         description = m.Description
        //     });
            
        //     return Ok(parsed);
        // }

