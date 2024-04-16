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

        //this is the total sales
        // [HttpGet("sales")]
        // [Authorize(Roles = "999")]
        // public async Task<IActionResult> GenerateSaleReports()
        // {
        //     var sql = "EXEC GenerateSalesReports @StartDate = '2024-01-01', @EndDate = '2024-12-31';";

        //     var salesReports = await _databaseService.QueryAsync<dynamic>(sql);

        //     var parsed = salesReports.Select(x => new
        //     {
        //         totalSales = x.TotalSales,
        //         rideSales = x.RideSales,
        //         giftShopSales = x.GiftShopSales
        //     });

        //     return Ok(parsed);
        // }

        //this is the totalRideSales
        // [HttpGet("rideSales")]
        // [Authorize(Roles = "999")]
        // public async Task<IActionResult> GetRideSales()
        // {
        //     var sql = "EXEC GetTotalRideSales";

        //     var rideSale = await _databaseService.QueryAsync<dynamic>(sql);

        //     var parsed = rideSale.Select(x => new
        //     {
        //         totalRideSale = x.TotalRideSales
        //     });

        //     return Ok(parsed);
        // }

        // [HttpGet("giftShopSales")]
        // [Authorize(Roles = "999")]
        // public async Task<IActionResult> GetGiftShopSales()
        // {
        //     var sql = "EXEC GetTotalRideSales";

        //     var rideSale = await _databaseService.QueryAsync<dynamic>(sql);

        //     var parsed = rideSale.Select(x => new
        //     {
        //         totalRideSale = x.TotalRideSales
        //     });

        //     return Ok(parsed);
        // }

        [HttpGet("maintenanceReports")]
        [Authorize(Roles = "999")]
        public async Task<IActionResult> GetMaintenanceReports()
        {
            var sql = "EXEC GetMaintenanceReports @StartDate = '2024-01-01', @EndDate = '2024-12-31'";

            var maintenanceReport = await _databaseService.QueryAsync<dynamic>(sql);

            var parsed = maintenanceReport.Select(m => new{
                entityType = m.EntityType,
                entityID = m.EntityID,
                maintenanceStartDate = m.MaintenanceStartDate,
                //maintenanceEndDate = m.MaintenanceEndDate,
                //reason = m.Reason,
                description = m.Description
            });
            
            return Ok(parsed);
        }

    }

}