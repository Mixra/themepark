using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class NotificationController : ControllerBase
    {
        private readonly DatabaseService _databaseService;
        private readonly IConfiguration _configuration;

        public NotificationController(DatabaseService databaseService, IConfiguration configuration)
        {
            _databaseService = databaseService;
            _configuration = configuration;
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetNotifications()
        {
            var username = HttpContext.Items["Username"];
            var sql = @"
            SELECT
                n.NotificationID,
                n.Message,
                n.CreatedAt,
                nu.ReadStatus
            FROM
                Notifications n
                INNER JOIN NotificationUsername nu ON n.NotificationID = nu.NotificationID
            WHERE
                nu.Username = @username
            ORDER BY
                n.CreatedAt DESC;
            ";

            var notifications = await _databaseService.QueryAsync<dynamic>(sql, new { username });

            var parsed = notifications.Select(n => new
            {
                NotificationID = n.NotificationID,
                Message = n.Message,
                CreatedAt = n.CreatedAt,
                ReadStatus = n.ReadStatus
            });

            return Ok(parsed);

        }

        [Authorize]
        [HttpPost("mark-read/{notificationID}")]
        public async Task<IActionResult> MarkRead(int notificationID)
        {
            var username = HttpContext.Items["Username"];
            var sql = @"
            UPDATE
                NotificationUsername
            SET
                ReadStatus = 1
            WHERE
                NotificationID = @NotificationID
                AND Username = @Username;
            ";

            await _databaseService.ExecuteAsync(sql, new { NotificationID = notificationID, Username = username });

            return Ok(new { Message = "Notification marked as read." });
        }

    }
}
