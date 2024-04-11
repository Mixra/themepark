using backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;


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
    }
}