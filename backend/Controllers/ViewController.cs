using backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using backend.Models;
using Newtonsoft.Json;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ViewController : ControllerBase
    {
        private readonly DatabaseService _databaseService;
        private readonly IConfiguration _configuration;

        public ViewController(DatabaseService databaseService, IConfiguration configuration)
        {
            _databaseService = databaseService;
            _configuration = configuration;
        }

        [Authorize]
        [HttpGet("user")]
        public async Task<IActionResult> GetUser()
        {
            var username = HttpContext.Items["Username"];
            var level = HttpContext.Items["Level"];

            var userDetails = await _databaseService.QuerySingleOrDefaultAsync<dynamic>("SELECT First_Name, Last_Name, Email, Phone FROM UserAccounts WHERE Username = @Username", new { Username = username });

            if (userDetails == null)
            {
                return BadRequest(new { error = "User not found" });
            }

            var staffId = await _databaseService.QuerySingleOrDefaultAsync<int?>("SELECT StaffID FROM Staff WHERE Username = @Username", new { Username = username });

            var areaNames = staffId.HasValue
                ? await _databaseService.QueryAsync<string>("SELECT pa.Name FROM AreaManager am JOIN ParkAreas pa ON am.AreaID = pa.AreaID WHERE am.StaffID = @StaffID", new { StaffID = staffId })
                : null;

            var staffDetails = await _databaseService.QuerySingleOrDefaultAsync<dynamic>("SELECT SSN, Address, HourlyRate, StartDate, EndDate, EmergencyContactName, EmergencyContactPhone, FullTime FROM Staff WHERE Username = @Username", new { Username = username });

            var userData = new
            {
                Username = username,
                Password = "",
                first_name = userDetails.First_Name,
                last_name = userDetails.Last_Name,
                Email = userDetails.Email,
                Phone = userDetails.Phone,
                StaffInfo = staffDetails != null ? new
                {
                    Areas = areaNames,
                    SSN = staffDetails.SSN,
                    Address = staffDetails.Address,
                    HourlyRate = staffDetails.HourlyRate,
                    StartDate = staffDetails.StartDate,
                    EndDate = staffDetails.EndDate,
                    EmergencyContactName = staffDetails.EmergencyContactName,
                    EmergencyContactPhone = staffDetails.EmergencyContactPhone,
                    FullTime = staffDetails.FullTime
                } : null
            };

            return Ok(userData);
        }


        [Authorize(Roles = "999")]
        [HttpGet("positions")]
        public async Task<IActionResult> GetPositions()
        {
            var positions = await _databaseService.QueryAsync<dynamic>("SELECT RoleName, Level FROM UserRoles");

            var parsed = positions.Select(p => new
            {
                name = p.RoleName,
                level = p.Level
            });

            return Ok(parsed);
        }

        [HttpGet("areas")]
        public async Task<IActionResult> GetAreas()
        {
            var query =
                @"
                SELECT
                pa.AreaID,
                pa.Name AS AreaName,
                pa.Theme,
                pa.ImageUrl,
                pa.Description,
                pa.OpeningTime,
                pa.ClosingTime,
                pa.ClosureStatus,
                (
                    SELECT
                        r.RideID,
                        r.Name AS RideName
                    FROM
                        Rides r
                    WHERE
                        r.AreaID = pa.AreaID
                    FOR JSON PATH
                ) AS Rides,
                (
                    SELECT
                        gs.ShopID,
                        gs.Name AS ShopName
                    FROM
                        GiftShops gs
                    WHERE
                        gs.AreaID = pa.AreaID
                    FOR JSON PATH
                ) AS GiftShops,
                (
                    SELECT
                        r.RestaurantID,
                        r.Name AS RestaurantName
                    FROM
                        Restaurants r
                    WHERE
                        r.AreaID = pa.AreaID
                    FOR JSON PATH
                ) AS Restaurants

                FROM
                ParkAreas pa

                WHERE
                pa.ClosureStatus IS NULL OR pa.ClosureStatus != 1
                
                ";

            var areas = await _databaseService.QueryAsync<dynamic>(query);

            var parsed = areas.Select(a => new
            {
                AreaID = a.AreaID,
                AreaName = a.AreaName,
                Theme = a.Theme,
                ImageUrl = a.ImageUrl,
                Description = a.Description,
                OpeningTime = a.OpeningTime,
                ClosingTime = a.ClosingTime,

                Rides = a.Rides != null ? JsonConvert.DeserializeObject<List<RideViewModel>>(a.Rides) : null,
                GiftShops = a.GiftShops != null ? JsonConvert.DeserializeObject<List<GiftShopViewModel>>(a.GiftShops) : null,
                Restaurants = a.Restaurants != null ? JsonConvert.DeserializeObject<List<RestaurantViewModel>>(a.Restaurants) : null
            });

            return Ok(parsed);
        }

        [Authorize(Roles = "999, 1")]
        [HttpGet("allowed_areas")]
        public async Task<IActionResult> GetAllowedAreas()
        {
            var username = HttpContext.Items["Username"];
            var adminLevel = HttpContext.Items["Level"];

            var staffId = await _databaseService.QuerySingleOrDefaultAsync<int?>("SELECT StaffID FROM Staff WHERE Username = @Username", new { Username = username });

            if (!staffId.HasValue)
            {
                return BadRequest(new { error = "User is not a staff member" });
            }

            var areas = await _databaseService.QueryAsync<dynamic>("SELECT pa.AreaID, pa.Name FROM ParkAreas pa WHERE EXISTS (SELECT 1 FROM AreaManager am WHERE am.AreaID = pa.AreaID AND am.StaffID = @StaffID) OR @Role = 999", new { StaffID = staffId, Role = adminLevel });

            var parsed = areas.Select(a => new
            {
                AreaID = a.AreaID,
                AreaName = a.Name
            });

            return Ok(parsed);
        }

        [Authorize]
        [HttpGet("rides")]
        public async Task<IActionResult> GetRides()
        {
            var query = @"
            SELECT
                Rides.ImageUrl,
                Rides.RideID,
                Rides.Name,
                Rides.Description,
                Rides.Type,
                Rides.MinimumHeight,
                Rides.MaximumCapacity,
                Rides.OpeningTime,
                Rides.ClosingTime,
                Rides.Duration,
                Rides.AccessibilityOptions,
                Rides.MaintenanceSchedule,
                Rides.ClosureStatus,
                Rides.UnitPrice,
                CASE
                    WHEN EXISTS (
                        SELECT 1
                        FROM AreaManager
                        INNER JOIN Staff ON AreaManager.StaffID = Staff.StaffID
                        WHERE Staff.Username = @Username AND AreaManager.AreaID = Rides.AreaID
                    )
                    THEN 1
                    ELSE 0
                END AS hasCrud,
                (
                    SELECT
                        AreaID,
                        Name AS AreaName
                    FROM
                        ParkAreas
                    WHERE
                        AreaID = Rides.AreaID
                    FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
                ) AS Area
            FROM
                Rides
            ";

            var username = HttpContext.Items["Username"];

            var rides = await _databaseService.QueryAsync<dynamic>(query, new { Username = username });

            var parsed = rides.Select(r => new
            {
                ImageUrl = r.ImageUrl,
                RideID = r.RideID,
                RideName = r.Name,
                Description = r.Description,
                Type = r.Type,
                MinimumHeight = r.MinimumHeight,
                MaximumCapacity = r.MaximumCapacity,
                OpeningTime = r.OpeningTime,
                ClosingTime = r.ClosingTime,
                Duration = r.Duration,
                UnitPrice = r.UnitPrice,
                Area = JsonConvert.DeserializeObject<ParkViewModel>(r.Area),
                hasCrud = r.hasCrud == 1 || (HttpContext.Items["Level"] != null && ((int)HttpContext.Items["Level"] == 999))
            });

            return Ok(parsed);
        }

        [Authorize]
        [HttpGet("events")]
        public async Task<IActionResult> GetEvents()
        {
            var query = @"SELECT e.EventID, e.Name, e.Description, e.EventType, e.AgeRestriction, e.ImageUrl, e.StartDate, e.EndDate, e.RequireTicket, e.UnitPrice FROM Events as e WHERE e.ClosureStatus IS NULL OR e.ClosureStatus != 1";
            var events = await _databaseService.QueryAsync<dynamic>(query);

            var parsed = events.Select(e => new
            {
                EventID = e.EventID,
                EventName = e.Name,
                Description = e.Description,
                EventType = e.EventType,
                AgeRestriction = e.AgeRestriction,
                ImageUrl = e.ImageUrl,
                StartDate = e.StartDate,
                EndDate = e.EndDate,
                RequireTicket = e.RequireTicket,
                UnitPrice = e.UnitPrice
            });

            return Ok(parsed);
        }
    }
}