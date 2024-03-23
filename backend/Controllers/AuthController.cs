using backend.Services;
using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Utils;


namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly DatabaseService _databaseService;

        public AuthController(DatabaseService databaseService)
        {
            _databaseService = databaseService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var existingUser = await _databaseService.QuerySingleOrDefaultAsync<string>("SELECT Username FROM UserAccounts WHERE Username = @Username", new {user.Username});
            if (existingUser != null)
            {
                return Conflict("error: User already exists");
            }

            var hashed_pass = PasswordUtility.HashPassword(user.Password);

            var newUser = new
            {
                Username = user.Username,
                PasswordHash = hashed_pass,
                Name = user.Name,
                Email = "test@gmail.com",
                RoleID = 1, // Set the default role ID
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var insertQuery = @"
                INSERT INTO UserAccounts (Username, PasswordHash, Name, Email, RoleID, CreatedAt, UpdatedAt)
                VALUES (@Username, @PasswordHash, @Name, @Email, @RoleID, @CreatedAt, @UpdatedAt);
            ";
            try
            {
                await _databaseService.ExecuteAsync(insertQuery, newUser);
                return Ok("User registered successfully");
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }




        }
    }
}
