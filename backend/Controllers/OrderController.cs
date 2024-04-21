using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class OrderController : ControllerBase
    {
        private readonly DatabaseService _databaseService;
        private readonly IConfiguration _configuration;

        public OrderController(DatabaseService databaseService, IConfiguration configuration)
        {
            _databaseService = databaseService;
            _configuration = configuration;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] OrderModel order)
        {
            decimal totalCost = 0;

            foreach (var item in order.Items)
            {
                totalCost += item.UnitPrice * item.Quantity;
            }
            var newOrderData = new
            {
                Username = HttpContext.Items["Username"],
                TotalAmount = totalCost,
                OrderDate = DateTime.UtcNow,
            };

            // This will return order ID
            var orderID = await _databaseService.ExecuteInsertAsync(@"
            INSERT INTO Orders (Username, TotalAmount, OrderDate) 
            VALUES (@Username, @TotalAmount, @OrderDate)", newOrderData);

            foreach (var item in order.Items)
            {
                DateTime? TicketExpiryDate = item.ItemType == "Ride" ? DateTime.UtcNow.AddDays(7) : (DateTime?)null;
                var newOrderItemData = new
                {
                    OrderID = orderID,
                    ItemType = item.ItemType,
                    RideID = item.RideID,
                    EventID = item.EventID,
                    ItemID = item.ItemID,
                    Quantity = item.Quantity,
                    UnitPrice = item.UnitPrice,
                    TicketExpiryDate = TicketExpiryDate
                };

                await _databaseService.ExecuteAsync(@"
                INSERT INTO OrderItems (OrderID, ItemType, RideID, EventID, ItemID, Quantity, UnitPrice, TicketExpiryDate)
                VALUES (@OrderID, @ItemType, @RideID, @EventID, @ItemID, @Quantity, @UnitPrice, @TicketExpiryDate)", newOrderItemData);
            }

            return Ok(new { OrderID = orderID });
        }

        [Authorize]
        [HttpGet("history")]
        public async Task<IActionResult> GetPurchaseHistory()
        {
            var username = HttpContext.Items["Username"]?.ToString();

            var query = @"
            SELECT oi.OrderItemID AS Id, 
                CASE 
                    WHEN oi.ItemType = 'Ride' THEN r.Name
                    WHEN oi.ItemType = 'Event' THEN e.Name
                    WHEN oi.ItemType = 'GiftShop' THEN i.ItemName
                END AS Name,
                oi.UnitPrice AS Price,
                oi.ItemType,
                oi.Quantity,
                oi.TicketExpiryDate,
                oi.RefundStatus,
                o.OrderDate AS PurchaseDate
            FROM OrderItems oi
            JOIN Orders o ON oi.OrderID = o.OrderID
            LEFT JOIN Rides r ON oi.RideID = r.RideID
            LEFT JOIN Events e ON oi.EventID = e.EventID
            LEFT JOIN Inventory i ON oi.ItemID = i.ItemID
            WHERE o.Username = @Username
            ORDER BY o.OrderDate DESC";

            var purchaseHistory = await _databaseService.QueryAsync<PurchaseHistoryModel>(query, new { Username = username });

            return Ok(purchaseHistory);
        }

    }
}