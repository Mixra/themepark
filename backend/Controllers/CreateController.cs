using backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;


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
    }
}