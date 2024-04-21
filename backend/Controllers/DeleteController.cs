using backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using backend.Models;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DeleteController : ControllerBase
    {
        private readonly DatabaseService _databaseService;
        private readonly IConfiguration _configuration;

        public DeleteController(DatabaseService databaseService, IConfiguration configuration)
        {
            _databaseService = databaseService;
            _configuration = configuration;
        }


        [Authorize(Roles = "999")]
        [HttpDelete("areas/{AreaID}")]
        public async Task<IActionResult> DeleteArea(int AreaID)
        {
            await _databaseService.ExecuteAsync("DELETE FROM ParkAreas WHERE AreaID = @AreaID", new { AreaID });

            return Ok(new { message = "Area deleted successfully" });
        }


        [Authorize(Roles = "1,999")]
        [HttpDelete("rides/{RideID}")]
        public async Task<IActionResult> DeleteRide(int RideID)
        {
            // var user_role = (int)HttpContext.Items["Level"];
            // Check if user actually has permission to delete rides ill do it later



            await _databaseService.ExecuteAsync("DELETE FROM Rides WHERE RideID = @RideID", new { RideID });

            return Ok(new { message = "Ride deleted successfully" });
        }


        [Authorize(Roles="999")]
        [HttpDelete("events/{EventID}")]
        public async Task<IActionResult> DeleteEvent(int EventID)
        {
            await _databaseService.ExecuteAsync("DELETE FROM Events WHERE EventID = @EventID", new { EventID });

            return Ok(new { message = "Event deleted successfully" });
        }

    }
}