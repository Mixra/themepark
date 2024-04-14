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

        [Authorize(Roles = "999")]
        [HttpPut("areas")]
        async public Task<IActionResult> EditArea([FromBody] ParkAreas area)
        {
            try
            {
                await _databaseService.ExecuteAsync("UPDATE ParkAreas SET Name = @Name, Theme = @Theme, Description = @Description, ImageUrl = @ImageUrl, OpeningTime = @OpeningTime, ClosingTime = @ClosingTime WHERE AreaID = @AreaID",
                new { Name = area.AreaName, Theme = area.Theme, Description = area.Description, ImageUrl = area.ImageUrl, OpeningTime = area.OpeningTime, ClosingTime = area.ClosingTime, AreaID = area.AreaID });

                return Ok(new { message = "Area updated successfully" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error has occured: {ex.Message}");
                return StatusCode(500, new { error = "An error occurred while updating the area." });
            }
        }

        [Authorize(Roles = "999, 1")]
        [HttpPut("rides")]
        async public Task<IActionResult> EditRide([FromBody] RidesModel ride)
        {
            // HAVE NOT DONE AUTH CHECKING
            try
            {
                await _databaseService.ExecuteAsync("UPDATE Rides SET ImageUrl = @ImageUrl, Name = @Name, Type = @Type, AreaID = @AreaID, MaximumCapacity = @MaximumCapacity, MinimumHeight = @MinimumHeight, Duration = @Duration, UnitPrice = @UnitPrice, Description = @Description, OpeningTime = @OpeningTime, ClosingTime = @ClosingTime WHERE RideID = @RideID",
                new { ImageUrl = ride.ImageUrl, Name = ride.RideName, Type = ride.Type, AreaID = ride.Area.AreaID, MaximumCapacity = ride.MaximumCapacity, MinimumHeight = ride.MinimumHeight, Duration = ride.Duration, UnitPrice = ride.UnitPrice, Description = ride.Description, OpeningTime = ride.OpeningTime, ClosingTime = ride.ClosingTime, RideID = ride.RideID });

                return Ok(new { message = "Ride updated successfully" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error has occured: {ex.Message}");
                return StatusCode(500, new { error = "An error occurred while updating the ride." });
            }
        }


    }
}