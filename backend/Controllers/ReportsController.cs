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

        [HttpPost("completeInventory")]
        [Authorize(Roles = "999")]
        public async Task<IActionResult> GetCompleteInventoryReport([FromBody] SalesModel data)
        {
            var sql = "EXEC GetCompleteInventoryReport @StartDate, @EndDate";

            var completeInventory = await _databaseService.QueryAsync<dynamic>(sql, new { StartDate = data.StartDate, EndDate = data.EndDate }
            );

            var parsed = completeInventory.Select(m => new{
                ShopName =  m.ShopName,
                ShopID = m.ShopID,
                ItemID = m.ItemID,
                ItemName = m.ItemName,
                QuantityInStock = m.QuantityInStock,
                QuantitySold = m.QuantitySold,
                UnitPrice = m.UnitPrice
            });
            
            return Ok(parsed);
        }

        [HttpPost("getBestAndWorst")]
        [Authorize(Roles = "999")]
        public async Task<IActionResult> GetBestAndWorst([FromBody] SalesModel data)
        {
            var sql = "EXEC GetBestAndWorstItems @StartDate, @EndDate";

            var bestworstInventory = await _databaseService.QueryAsync<dynamic>(sql, new { StartDate = data.StartDate, EndDate = data.EndDate }
            );

            var parsed = bestworstInventory.Select(m => new{
                ShopID = m.ShopID,
                BestItemID = m.BestItemID,
                BestItemName = m.BestItemName,
                BestItemQuantity = m.BestItemQuantity,
                BestItemSales = m.BestItemSales,
                WorstItemID = m.WorstItemID,
                WorstItemName = m.WorstItemName,
                WorstItemQuantity = m.WorstItemQuantity,
                WorstItemSales = m.WorstItemSales
            });
            
            return Ok(parsed);
        }

        [HttpGet("maintenance")]
        [Authorize(Roles = "999")]
        public async Task<IActionResult> GetMaintenanceReports([FromBody] MaintenanceReportModel data)
        {
            var sql = "EXEC GetMaintenanceReports @StartDate, @EndDate";

            var maintenanceReport = await _databaseService.QueryAsync<dynamic>(sql);

            var parsed = maintenanceReport.Select(m => new
            {
                entityType = m.EntityType,
                entityID = m.EntityID,
                maintenanceStartDate = m.MaintenanceStartDate,
                maintenanceEndDate = m.MaintenanceEndDate,
                reason = m.Reason,
                description = m.Description
            });

            return Ok(parsed);
        }

        [HttpPost("rideReport")]
        [Authorize(Roles = "999")]
        public async Task<IActionResult> GetRideStatistics([FromBody] RideReportModel data)
        {
            var sql = "EXEC sp_GetRideStatistics @RideID";

            var rideReport = await _databaseService.QueryAsync<dynamic>(sql, new { RideID = data.RideID});

            var parsed = rideReport.Select(m => new
            {
                RideName = m.RideName,
                TotalClosures = m.TotalClosures,
                LastClosure = m.LastClosure,
                AvgClosureLength = m.AvgClosureLength,
                MaxTotalClosures = m.MaxTotalClosures,
                MinTotalClosures = m.MinTotalClosures,
                MaxAvgClosureLength = m.MaxAvgClosureLength,
                MinAvgClosureLength = m.MinAvgClosureLength
            });

            return Ok(parsed);
        }


        [HttpPost("inventory")]
        [Authorize(Roles = "999")]
        public async Task<IActionResult> GetInventoryReports([FromBody] SalesModel data)
        {
            var sql = "EXEC GetInventoryReport @StartDate, @EndDate";

            var inventoryReport = await _databaseService.QuerySingleOrDefaultAsync<string>(sql, new { StartDate = data.StartDate, EndDate = data.EndDate });
            if (inventoryReport == null)
            {
                return NotFound();
            }
            var parsed = JsonConvert.DeserializeObject<InventoryReportModel>(inventoryReport);

            if (parsed?.Stores == null)
            {
                return NotFound();
            }

            return Ok(parsed);
        }
    }
}