using backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using backend.Models;
using Newtonsoft.Json;



namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ShopController : ControllerBase
    {
        private readonly DatabaseService _databaseService;
        private readonly IConfiguration _configuration;

        public ShopController(DatabaseService databaseService, IConfiguration configuration)
        {
            _databaseService = databaseService;
            _configuration = configuration;
        }


        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetShop()
        {
            var username = HttpContext.Items["Username"];
            var query =
            @"
            SELECT
                gs.ImageURL,
                gs.ShopID,
                gs.Name,
                gs.Description,
                gs.OpeningTime,
                gs.ClosingTime,
                gs.MerchandiseType,
                gs.ClosureStatus,
                CASE
                    WHEN (
                        SELECT Level
                        FROM UserRoles
                        WHERE RoleName = (
                            SELECT Role
                            FROM UserAccounts
                            WHERE Username = @Username
                        )
                    ) = 999
                    THEN 1
                    WHEN EXISTS (
                        SELECT 1
                        FROM AreaManager
                        INNER JOIN Staff ON AreaManager.StaffID = Staff.StaffID
                        WHERE Staff.Username = @Username AND AreaManager.AreaID = gs.AreaID
                    )
                    THEN 1
                    ELSE 0
                END AS hasCrud,
                (
                    SELECT
                        AreaID,
                        Name AS AreaName
                    FROM
                        ParkAreas
                    WHERE
                        AreaID = gs.AreaID
                    FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
                ) AS Area,
                (
                    SELECT
                        ItemID,
                        ItemName,
                        Description,
                        Quantity,
                        UnitPrice
                    FROM
                        Inventory
                    WHERE
                        ShopID = gs.ShopID
                    FOR JSON PATH
                ) AS Inventory
            FROM
                GiftShops AS gs
            ";
            var shop = await _databaseService.QueryAsync<dynamic>(query, new { Username = username });
            var parsed = shop.Select(x => new
            {
                x.ImageURL,
                x.ShopID,
                ShopName = x.Name,
                x.Description,
                x.OpeningTime,
                x.ClosingTime,
                x.MerchandiseType,
                x.ClosureStatus,
                Area = JsonConvert.DeserializeObject<AreaModel>(x.Area),
                Inventory = x.Inventory != null ? JsonConvert.DeserializeObject<List<InventoryModel>>(x.Inventory) : null,
                x.hasCrud
            });

            return Ok(parsed);
        }

        [Authorize(Roles = "1, 999")]
        [HttpPost]
        public async Task<IActionResult> CreateShop([FromBody] ShopModel shop)
        {
            var query =
            @"
            INSERT INTO GiftShops
            (
                ImageURL,
                Name,
                Description,
                OpeningTime,
                ClosingTime,
                MerchandiseType,
                AreaID
            )
            VALUES
            (
                @ImageURL,
                @Name,
                @Description,
                @OpeningTime,
                @ClosingTime,
                @MerchandiseType,
                @AreaID
            )
            ";
            var shopID = await _databaseService.ExecuteInsertAsync(query, new
            {
                ImageURL = shop.ImageURL,
                Name = shop.ShopName,
                Description = shop.Description,
                OpeningTime = shop.OpeningTime,
                ClosingTime = shop.ClosingTime,
                MerchandiseType = shop.MerchandiseType,
                AreaID = shop.Area.AreaID
            });

            return Ok(new { Message = "Shop created successfully", ShopID = shopID });
        }


        [Authorize(Roles = "1, 999")]
        [HttpPut]
        public async Task<IActionResult> UpdateShop([FromBody] ShopModel shop)
        {
            var query =
            @"
            UPDATE GiftShops
            SET
                ImageURL = @ImageURL,
                Name = @Name,
                Description = @Description,
                OpeningTime = @OpeningTime,
                ClosingTime = @ClosingTime,
                MerchandiseType = @MerchandiseType,
                AreaID = @AreaID
            WHERE
                ShopID = @ShopID
            ";

            await _databaseService.ExecuteAsync(query, new
            {
                ImageURL = shop.ImageURL,
                Name = shop.ShopName,
                Description = shop.Description,
                OpeningTime = shop.OpeningTime,
                ClosingTime = shop.ClosingTime,
                MerchandiseType = shop.MerchandiseType,
                AreaID = shop.Area.AreaID,
                ShopID = shop.ShopID
            });

            return Ok(new { Message = "Shop updated successfully" });
        }

        [Authorize(Roles = "1, 999")]
        [HttpDelete("{shopID}")]
        public async Task<IActionResult> DeleteShop(int shopID)
        {
            var query =
            @"
            DELETE FROM GiftShops
            WHERE ShopID = @ShopID
            ";
            await _databaseService.ExecuteAsync(query, new { ShopID = shopID });

            return Ok(new { Message = "Shop deleted successfully" });
        }

        [Authorize]
        [HttpGet("{shopID}/inventory")]
        public async Task<IActionResult> GetInventory(int shopID)
        {
            var query =
            @"
            SELECT
                ItemID,
                ItemName,
                Description,
                Quantity,
                UnitPrice
            FROM
                Inventory
            WHERE
                ShopID = @ShopID
            ";
            var inventory = await _databaseService.QueryAsync<InventoryModel>(query, new { ShopID = shopID });

            return Ok(inventory);
        }

        [Authorize(Roles = "1, 999")]
        [HttpPost("{shopID}/inventory")]
        public async Task<IActionResult> CreateInventory(int shopID, [FromBody] InventoryModel inventory)
        {
            var query =
            @"
            INSERT INTO Inventory
            (
                ShopID,
                ItemName,
                Description,
                Quantity,
                UnitPrice
            )
            VALUES
            (
                @ShopID,
                @ItemName,
                @Description,
                @Quantity,
                @UnitPrice
            )
            ";
            var itemID = await _databaseService.ExecuteInsertAsync(query, new
            {
                ShopID = shopID,
                ItemName = inventory.ItemName,
                Description = inventory.Description,
                Quantity = inventory.Quantity,
                UnitPrice = inventory.UnitPrice
            });

            return Ok(new { Message = "Inventory created successfully", ItemID = itemID });
        }

        [Authorize(Roles = "1, 999")]
        [HttpPut("{shopID}/inventory/{itemID}")]
        public async Task<IActionResult> UpdateInventory(int shopID, int itemID, [FromBody] InventoryModel inventory)
        {
            var query =
            @"
            UPDATE Inventory
            SET
                ItemName = @ItemName,
                Description = @Description,
                Quantity = @Quantity,
                UnitPrice = @UnitPrice
            WHERE
                ShopID = @ShopID AND ItemID = @ItemID
            ";
            await _databaseService.ExecuteAsync(query, new
            {
                ItemName = inventory.ItemName,
                Description = inventory.Description,
                Quantity = inventory.Quantity,
                UnitPrice = inventory.UnitPrice,
                ShopID = shopID,
                ItemID = itemID
            });

            return Ok(new { Message = "Inventory updated successfully" });
        }

        [Authorize(Roles = "1, 999")]
        [HttpDelete("{shopID}/inventory/{itemID}")]
        public async Task<IActionResult> DeleteInventory(int shopID, int itemID)
        {
            var query =
            @"
            DELETE FROM Inventory
            WHERE ShopID = @ShopID AND ItemID = @ItemID
            ";
            await _databaseService.ExecuteAsync(query, new { ShopID = shopID, ItemID = itemID });

            return Ok(new { Message = "Inventory deleted successfully" });
        }

    }
}
