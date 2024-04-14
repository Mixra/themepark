using backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using backend.Models;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CreateController : ControllerBase
    {
        private readonly DatabaseService _databaseService;
        private readonly IConfiguration _configuration;

        public CreateController(DatabaseService databaseService, IConfiguration configuration)
        {
            _databaseService = databaseService;
            _configuration = configuration;
        }

        [Authorize(Roles = "999")]
        [HttpPost("positions")]
        public async Task<IActionResult> CreatePositions([FromBody] PositionModel data)
        {
            await _databaseService.ExecuteAsync("INSERT INTO UserRoles (RoleName, Level) VALUES (@Name, @Level)", new { Name = data.Name, Level = data.Level });

            return Ok(new { message = "Position created successfully" });
        }

        [Authorize(Roles = "999")]
        [HttpPost("areas")]
        public async Task<IActionResult> CreateArea([FromBody] ParkAreas data)
        {
            await _databaseService.ExecuteAsync("INSERT INTO ParkAreas (Name, Theme, Description, ImageUrl, OpeningTime, ClosingTime) VALUES (@Name, @Theme, @Description, @ImageUrl, @OpeningTime, @ClosingTime)",
            new { Name = data.AreaName, Theme = data.Theme, Description = data.Description, ImageUrl = data.ImageUrl, OpeningTime = data.OpeningTime, ClosingTime = data.ClosingTime });

            return Ok(new { message = "Area created successfully" });
        }


        [Authorize(Roles ="999, 1")]
        [HttpPost("rides")]
        public async Task<IActionResult> CreateRide([FromBody] RidesModel data)
        {
            await _databaseService.ExecuteAsync("INSERT INTO Rides (ImageUrl, Name, Type, AreaID, MaximumCapacity, MinimumHeight, Duration, UnitPrice, Description, OpeningTime, ClosingTime) VALUES (@ImageUrl, @Name, @Type, @AreaID, @MaximumCapacity, @MinimumHeight, @Duration, @UnitPrice, @Description, @OpeningTime, @ClosingTime)",
            new { ImageUrl = data.ImageUrl, Name = data.RideName, Type = data.Type, AreaID = data.Area.AreaID, MaximumCapacity = data.MaximumCapacity, MinimumHeight = data.MinimumHeight, Duration = data.Duration, UnitPrice = data.UnitPrice, Description = data.Description, OpeningTime = data.OpeningTime, ClosingTime = data.ClosingTime });

            return Ok(new { message = "Ride created successfully" });
        }

        [Authorize(Roles = "999")]
        [HttpPost("events")]
        public async Task<IActionResult> CreateEvent([FromBody] EventsModel data)
        {
            await _databaseService.ExecuteAsync("INSERT INTO Events (Name, Description, EventType, AgeRestriction, ImageUrl, StartDate, EndDate, RequireTicket, UnitPrice) VALUES (@Name, @Description, @EventType, @AgeRestriction, @ImageUrl, @StartDate, @EndDate, @RequireTicket, @UnitPrice)",
            new { Name = data.EventName, Description = data.Description, EventType = data.EventType, AgeRestriction = data.AgeRestriction, ImageUrl = data.ImageUrl, StartDate = data.StartDate, EndDate = data.EndDate, RequireTicket = data.RequireTicket, UnitPrice = data.UnitPrice});

            return Ok(new { message = "Event created successfully" });
        }

    }
}