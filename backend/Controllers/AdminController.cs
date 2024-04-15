using backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using backend.Models;
using backend.Utils;
using Isopoh.Cryptography.Argon2;
using Newtonsoft.Json;

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
        public async Task<IActionResult> CreateUser([FromBody] User user)
        {
            var existingUser = await _databaseService.QuerySingleOrDefaultAsync<string>("SELECT Username FROM UserAccounts WHERE Username = @Username", new { user.Username });
            if (existingUser != null)
            {
                return Conflict(new { error = "User already exists" });
            }

            if (user.Position == null)
            {
                user.Position = new Position { Name = "Customer", Level = 0 };
            }

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
        public async Task<IActionResult> UpdateUser([FromBody] User user)
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

            if (user.Position == null)
            {
                user.Position = new Position { Name = "Customer", Level = 0 };
            }

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
                var existingStaff = await _databaseService.QuerySingleOrDefaultAsync<dynamic>("SELECT * FROM Staff WHERE Username = @Username", new { user.Username });

                if (existingStaff == null)
                {
                    // Staff doesn't exist, insert new staff record
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
                else
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
            }

            return Ok(new { message = "User updated successfully" });
        }



        [Authorize(Roles = "999")]
        [HttpGet("get_users")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _databaseService.QueryAsync<dynamic>(@"
            SELECT
                ua.Username,
                ua.First_Name AS FirstName,
                ua.Last_Name AS LastName,
                ua.Email,
                ua.Phone,
                ua.Role,
                ur.Level AS RoleLevel,
                s.SSN AS Ssn,
                s.Address,
                s.HourlyRate,
                s.StartDate,
                s.EndDate,
                s.EmergencyContactName,
                s.EmergencyContactPhone,
                s.FullTime AS IsFullTime,
                (
                    SELECT
                        pa.AreaID,
                        pa.Name as AreaName
                    FROM
                        AreaManager am
                        INNER JOIN ParkAreas pa ON am.AreaID = pa.AreaID
                    WHERE
                        am.StaffID = s.StaffID
                    FOR JSON PATH
                ) AS ParkAreas
            FROM
                UserAccounts ua
                LEFT JOIN Staff s ON ua.Username = s.Username
                LEFT JOIN UserRoles ur ON ua.Role = ur.RoleName
            ORDER BY
                ua.Username
            ");

            var result = users.Select(u => new
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
                    Level = u.RoleLevel
                },
                HourlyRate = u.HourlyRate,
                Ssn = u.Ssn,
                StartDate = u.StartDate,
                EndDate = u.EndDate,
                Address = u.Address,
                EmergencyContactName = u.EmergencyContactName,
                EmergencyContactPhone = u.EmergencyContactPhone,
                IsFullTime = u.IsFullTime,
                ParkAreas = u.ParkAreas != null ? JsonConvert.DeserializeObject<List<ParkArea>>(u.ParkAreas.ToString()) : new List<ParkArea>()
            });

            return Ok(result);
        }

        // NEEDS ATTENTION Speak w/ team members
        [Authorize(Roles = "999")]
        [HttpDelete("delete_user/{username}")]
        public async Task<IActionResult> DeleteUser(string username)
        {
            var existingUser = await _databaseService.QuerySingleOrDefaultAsync<string>("SELECT Username FROM UserAccounts WHERE Username = @Username", new { Username = username });
            if (existingUser == null)
            {
                return NotFound(new { error = "User not found" });
            }

            var deleteQuery = "DELETE FROM UserAccounts WHERE Username = @Username";
            await _databaseService.ExecuteAsync(deleteQuery, new { Username = username });

            return Ok(new { message = "User deleted successfully" });
        }

        [Authorize(Roles = "999")]
        [HttpGet("get_park_areas")]
        public async Task<IActionResult> GetParkAreas()
        {
            var areas = await _databaseService.QueryAsync<dynamic>(@"
            SELECT
                AreaID AS Id,
                Name
            FROM
                ParkAreas pa
            ORDER BY
                AreaID
            ");

            var result = areas.Select(a => new
            {
                AreaID = a.Id,
                AreaName = a.Name,
            });

            return Ok(result);
        }

        [Authorize(Roles = "999")]
        [HttpGet("get_assigned_areas/{username}")]
        public async Task<IActionResult> GetAssignedAreas(string username)
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
                ORDER BY
                    pa.AreaID
                ",

                new { Username = username }
            );

            var parsed = areas.Select(a => new
            {
                AreaID = a.AreaID,
                AreaName = a.AreaName
            });

            return Ok(parsed);

        }

        [Authorize(Roles = "999")]
        [HttpPost("assign_area")]
        public async Task<IActionResult> AssignArea([FromBody] ParkArea data)
        {
            var username = data.Username;
            var areaID = data.AreaID;

            var staff = await _databaseService.QuerySingleOrDefaultAsync<dynamic>("SELECT StaffID FROM Staff WHERE Username = @Username", new { Username = username });
            if (staff == null)
            {
                return NotFound(new { error = "Staff not found" });
            }

            var area = await _databaseService.QuerySingleOrDefaultAsync<dynamic>("SELECT AreaID FROM ParkAreas WHERE AreaID = @AreaID", new { AreaID = areaID });
            if (area == null)
            {
                return NotFound(new { error = "Area not found" });
            }

            var existingAssignment = await _databaseService.QuerySingleOrDefaultAsync<dynamic>("SELECT * FROM AreaManager WHERE StaffID = @StaffID AND AreaID = @AreaID", new { StaffID = staff.StaffID, AreaID = areaID });
            if (existingAssignment != null)
            {
                return Conflict(new { error = "Area already assigned" });
            }

            var insertQuery = "INSERT INTO AreaManager (StaffID, AreaID) VALUES (@StaffID, @AreaID)";
            await _databaseService.ExecuteAsync(insertQuery, new { StaffID = staff.StaffID, AreaID = areaID });

            return Ok(new { message = "Area assigned successfully" });
        }

        [Authorize(Roles = "999")]
        [HttpDelete("unassign_area")]
        public async Task<IActionResult> UnassignArea([FromBody] ParkArea data)
        {
            var username = data.Username;
            var areaID = data.AreaID;

            var staff = await _databaseService.QuerySingleOrDefaultAsync<dynamic>("SELECT StaffID FROM Staff WHERE Username = @Username", new { Username = username });
            if (staff == null)
            {
                return NotFound(new { error = "Staff not found" });
            }

            var area = await _databaseService.QuerySingleOrDefaultAsync<dynamic>("SELECT AreaID FROM ParkAreas WHERE AreaID = @AreaID", new { AreaID = areaID });
            if (area == null)
            {
                return NotFound(new { error = "Area not found" });
            }

            var existingAssignment = await _databaseService.QuerySingleOrDefaultAsync<dynamic>("SELECT * FROM AreaManager WHERE StaffID = @StaffID AND AreaID = @AreaID", new { StaffID = staff.StaffID, AreaID = areaID });
            if (existingAssignment == null)
            {
                return Conflict(new { error = "Area not assigned" });
            }

            var deleteQuery = "DELETE FROM AreaManager WHERE StaffID = @StaffID AND AreaID = @AreaID";
            await _databaseService.ExecuteAsync(deleteQuery, new { StaffID = staff.StaffID, AreaID = areaID });

            return Ok(new { message = "Area unassigned successfully" });


        }
    }
}