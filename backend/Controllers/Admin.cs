using backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using backend.Models;
using backend.Utils;
using Isopoh.Cryptography.Argon2;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly DatabaseService _databaseService;
        private readonly IConfiguration _configuration;

        public AdminController(DatabaseService databaseService, IConfiguration configuration)
        {
            _databaseService = databaseService;
            _configuration = configuration;
        }


        [Authorize(Roles = "999")]
        [HttpPost("create_user")]
        public async Task<IActionResult> CreateUser(User user)
        {
            var existingUser = await _databaseService.QuerySingleOrDefaultAsync<string>("SELECT Username FROM UserAccounts WHERE Username = @Username", new { user.Username });
            if (existingUser != null)
            {
                return Conflict(new { error = "User already exists" });
            }
            user.Position.Name = string.IsNullOrEmpty(user.Position.Name) ? "Customer" : user.Position.Name;

            var hashed_pass = Argon2.Hash(password: user.Password, timeCost: 1, memoryCost: 4096, parallelism: 1, hashLength: 16);

            var newUserData = new
            {
                Username = user.Username,
                PasswordHash = hashed_pass,
                First_Name = user.FirstName,
                Last_Name = user.LastName,
                Email = user.Email,
                Phone = user.Phone,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Role = user.Position.Name
            };

            var insertQuery =
            @"
            INSERT INTO UserAccounts (Username, PasswordHash, First_Name, Last_Name, Email, Phone, CreatedAt, UpdatedAt, Role)
            VALUES (@Username, @PasswordHash, @First_Name, @Last_Name, @Email, @Phone, @CreatedAt, @UpdatedAt, @Role)
            ";


            await _databaseService.ExecuteAsync(insertQuery, newUserData);


            if (user.IsStaff)
            {
                var insertStaffQuery =
                @"
                INSERT INTO Staff (Username, SSN, Address, HourlyRate, StartDate, EndDate, EmergencyContactName, EmergencyContactPhone, FullTime)
                VALUES (@Username, @SSN, @Address, @HourlyRate, @StartDate, @EndDate, @EmergencyContactName, @EmergencyContactPhone, @FullTime)
                ";

                var staffParam = new
                {
                    Username = user.Username,
                    SSN = user.Ssn,
                    Address = user.Address,
                    HourlyRate = user.HourlyRate,
                    StartDate = user.StartDate,
                    EndDate = user.EndDate,
                    EmergencyContactName = user.EmergencyContactName,
                    EmergencyContactPhone = user.EmergencyContactPhone,
                    FullTime = user.IsFullTime,
                };

                await _databaseService.ExecuteAsync(insertStaffQuery, staffParam);
            }

            return Ok(new { message = "User registered successfully" });
        }

        [Authorize(Roles = "999")]
        [HttpPut("update_user")]
        public async Task<IActionResult> UpdateUser(User user)
        {
            var existingUser = await _databaseService.QuerySingleOrDefaultAsync<dynamic>("SELECT Username, PasswordHash FROM UserAccounts WHERE Username = @Username", new { user.Username });
            if (existingUser == null)
            {
                return NotFound(new { error = "User not found" });
            }

            if (!string.IsNullOrEmpty(user.Password))
            {
                var hashed_pass = Argon2.Hash(password: user.Password, timeCost: 1, memoryCost: 4096, parallelism: 1, hashLength: 16);
                user.Password = hashed_pass;
            }
            else
            {
                user.Password = existingUser.PasswordHash;
            }

            user.Position.Name = string.IsNullOrEmpty(user.Position.Name) ? "Customer" : user.Position.Name;

            var newUserData = new
            {
                Username = user.Username,
                PasswordHash = user.Password,
                First_Name = user.FirstName,
                Last_Name = user.LastName,
                Email = user.Email,
                Phone = user.Phone,
                UpdatedAt = DateTime.UtcNow,
                Role = user.Position.Name
            };

            var updateQuery =
            @"
            UPDATE UserAccounts
            SET PasswordHash = @PasswordHash, First_Name = @First_Name, Last_Name = @Last_Name, Email = @Email, Phone = @Phone, UpdatedAt = @UpdatedAt, Role = @Role
            WHERE Username = @Username
            ";

            await _databaseService.ExecuteAsync(updateQuery, newUserData);

            if (user.IsStaff)
            {
                var updateStaffQuery =
                @"
                UPDATE Staff
                SET SSN = @SSN, Address = @Address, HourlyRate = @HourlyRate, StartDate = @StartDate, EndDate = @EndDate, EmergencyContactName = @EmergencyContactName, EmergencyContactPhone = @EmergencyContactPhone, FullTime = @FullTime
                WHERE Username = @Username
                ";

                var staffParam = new
                {
                    Username = user.Username,
                    SSN = user.Ssn,
                    Address = user.Address,
                    HourlyRate = user.HourlyRate,
                    StartDate = user.StartDate,
                    EndDate = user.EndDate,
                    EmergencyContactName = user.EmergencyContactName,
                    EmergencyContactPhone = user.EmergencyContactPhone,
                    FullTime = user.IsFullTime,
                };

                await _databaseService.ExecuteAsync(updateStaffQuery, staffParam);
            }

            return Ok(new { message = "User updated successfully" });
        }


        [Authorize(Roles = "999")]
        [HttpGet("get_users")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _databaseService.QueryAsync<dynamic>(
                @"
                SELECT
                    ua.Username,
                    ua.First_Name AS FirstName,
                    ua.Last_Name AS LastName,
                    ua.Email,
                    ua.Phone,
                    ua.Role,
                    s.SSN AS Ssn,
                    s.Address,
                    s.HourlyRate,
                    s.StartDate,
                    s.EndDate,
                    s.EmergencyContactName,
                    s.EmergencyContactPhone,
                    s.FullTime AS IsFullTime
                FROM
                    UserAccounts ua
                LEFT JOIN
                    Staff s ON ua.Username = s.Username
                ORDER BY
                    ua.Username
                ");

            var result = await Task.WhenAll(users.Select(async u => new
            {
                Username = u.Username,
                Password = "", // Do not return password for security reasons
                FirstName = u.FirstName,
                LastName = u.LastName,
                Email = u.Email,
                Phone = u.Phone,
                IsStaff = u.Role != "Customer",
                Position = new
                {
                    Name = u.Role,
                    Level = await GetRoleLevel(u.Role)
                },
                HourlyRate = u.HourlyRate,
                Ssn = u.Ssn,
                StartDate = u.StartDate,
                EndDate = u.EndDate,
                Address = u.Address,
                EmergencyContactName = u.EmergencyContactName,
                EmergencyContactPhone = u.EmergencyContactPhone,
                IsFullTime = u.IsFullTime,
                ParkAreas = await GetUserParkAreas(u.Username)
            }));

            return Ok(result);
        }

        private async Task<int> GetRoleLevel(string roleName)
        {
            return await _databaseService.QuerySingleOrDefaultAsync<int>(
                "SELECT Level FROM UserRoles WHERE RoleName = @Role",
                new { Role = roleName }
            );
        }

        private async Task<IEnumerable<dynamic>> GetUserParkAreas(string username)
        {
            var areas = await _databaseService.QueryAsync<dynamic>(
                @"
                SELECT
                    pa.AreaID,
                    pa.Name AS AreaName
                FROM
                    ParkAreas pa
                INNER JOIN
                    AreaManager am ON pa.AreaID = am.AreaID
                INNER JOIN
                    Staff s ON am.StaffID = s.StaffID
                WHERE
                    s.Username = @Username
                ",
                new { Username = username }
            );

            return areas;
        }

    }
}