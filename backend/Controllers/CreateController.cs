using backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using backend.Models;
using Microsoft.DotNet.Scaffolding.Shared.Messaging;

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


        [Authorize(Roles = "1")]
        [HttpGet("test")]
        public IActionResult AdminEndpoint()
        {
            // This endpoint can only be accessed by users with level 1 (admins)
            return Ok("This is an admin-only endpoint.");
        }

        [Authorize(Roles = "999")]
        [HttpPost("positions")]
        public async Task<IActionResult> CreatePositions([FromBody] PositionModel data)
        {
            await _databaseService.ExecuteAsync("INSERT INTO UserRoles (RoleName, Level) VALUES (@Name, @Level)", new { Name = data.Name, Level = data.Level });

            return Ok(new { message = "Position created successfully" });
        }

    }
}