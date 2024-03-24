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
        private readonly IConfiguration _configuration;

        public AuthController(DatabaseService databaseService, IConfiguration configuration)
        {
            _databaseService = databaseService;
            _configuration = configuration;
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var existingUser = await _databaseService.QuerySingleOrDefaultAsync<string>("SELECT Username FROM UserAccounts WHERE Username = @Username", new { user.Username });
            if (existingUser != null)
            {
                return Conflict(new { error = "User already exists" });
            }

            var hashed_pass = BCrypt.Net.BCrypt.HashPassword(user.Password);

            var newUserData = new
            {
                Username = user.Username,
                PasswordHash = hashed_pass,
                First_Name = user.First_name,
                Last_Name = user.Last_name,
                Email = user.Email,
                Phone = user.Phone,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var insertQuery = @"
            INSERT INTO UserAccounts (Username, PasswordHash, First_Name, Last_Name, Email, Phone, CreatedAt, UpdatedAt)
            VALUES (@Username, @PasswordHash, @First_Name, @Last_Name, @Email, @Phone, @CreatedAt, @UpdatedAt)";

            try
            {
                await _databaseService.ExecuteAsync(insertQuery, newUserData);
                var token = JWT.GenerateToken(user.Username, 0, _configuration);

                Response.Cookies.Append("token", token, new CookieOptions
                {
                    HttpOnly = true,
                    SameSite = SameSiteMode.None,
                    Secure = true
                });

                return Ok(new { message = "User registered successfully", token = token, level = 0 });
            }
            catch (Exception e)
            {
                return StatusCode(500, new { error = e.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }
            
            user.Username = user.Username.ToLower();

            var userData = await _databaseService.QuerySingleOrDefaultAsync<dynamic>("SELECT Username, PasswordHash, Level FROM UserAccounts WHERE Username = @Username", new { Username = user.Username });

            if (userData == null || !BCrypt.Net.BCrypt.Verify(user.Password, userData?.PasswordHash))
            {
                return Unauthorized(new { error = "Invalid username or password" });
            }

            try
            {
                var token = JWT.GenerateToken(user.Username, userData?.Level, _configuration);

                Response.Cookies.Append("token", token, new CookieOptions
                {
                    HttpOnly = true,
                    SameSite = SameSiteMode.None,
                    Secure = true
                });

                return Ok(new { message = "Login successful", token = token, level = userData?.Level });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erorr: {ex.Message}");
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }


    }
}
