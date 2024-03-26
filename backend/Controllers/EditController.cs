using backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using backend.Models;
using Isopoh.Cryptography.Argon2;
using Microsoft.DotNet.Scaffolding.Shared.Messaging;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EditController : ControllerBase
    {
        private readonly DatabaseService _databaseService;
        private readonly IConfiguration _configuration;

        public EditController(DatabaseService databaseService, IConfiguration configuration)
        {
            _databaseService = databaseService;
            _configuration = configuration;
        }


        [Authorize]
        [HttpPut("user")]
        async public Task<IActionResult> EditUser([FromBody] UserModel user)
        {
            var username = HttpContext.Items["Username"];
            var level = HttpContext.Items["Level"];

            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            try
            {

                if (user.Password != null && user.Password != "")
                {
                    user.Password = Argon2.Hash(password: user.Password, timeCost: 1, memoryCost: 4096, parallelism: 1, hashLength: 16);
                    await _databaseService.ExecuteAsync("UPDATE UserAccounts SET First_Name = @First_Name, Last_Name = @Last_Name, Email = @Email, PasswordHash = @Password, Phone = @Phone, UpdatedAt = @UpdatedAt WHERE Username = @Username",
                    new { First_Name = user.First_name, Last_Name = user.Last_name, Email = user.Email, Password = user.Password, Phone = user.Phone, UpdatedAt = DateTime.UtcNow, Username = username });
                }
                else
                {
                    await _databaseService.ExecuteAsync("UPDATE UserAccounts SET First_Name = @First_Name, Last_Name = @Last_Name, Email = @Email, Phone = @Phone, UpdatedAt = @UpdatedAt WHERE Username = @Username",
                    new { First_Name = user.First_name, Last_Name = user.Last_name, Email = user.Email, Phone = user.Phone, UpdatedAt = DateTime.UtcNow, Username = username });
                }

                return Ok(new { message = "User updated successfully" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error has occured: {ex.Message}");
                return StatusCode(500, new { error = "An error occurred while updating the user." });
            }
        }



    }
}