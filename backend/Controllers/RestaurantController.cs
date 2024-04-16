using backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using backend.Models;
using Newtonsoft.Json;
using Mono.TextTemplating;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RestaurantController : ControllerBase
    {
        private readonly DatabaseService _databaseService;
        private readonly IConfiguration _configuration;

        public RestaurantController(DatabaseService databaseService, IConfiguration configuration)
        {
            _databaseService = databaseService;
            _configuration = configuration;
        }

        [Authorize(Roles = "999, 1")]
        [HttpGet]
        public async Task<IActionResult> GetResaurant()
        {
            var username = HttpContext.Items["Username"];
            var query =
            @"
            SELECT
                r.ImageURL,
                r.RestaurantID,
                r.Name,
                r.CuisineType,
                r.OpeningTime,
                r.ClosingTime,
                r.MenuDescription,
                r.SeatingCapacity,
                r.ClosureStatus,
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
                        WHERE Staff.Username = @Username AND AreaManager.AreaID = r.AreaID
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
                        AreaID = r.AreaID
                    FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
                ) AS Area,
                (
                    SELECT
                        MenuItemID as ItemID,
                        ItemName,
                        Price
                    FROM
                        MenuItems
                    WHERE
                        RestaurantID = r.RestaurantID
                    FOR JSON PATH
                ) AS MenuList
            FROM
                Restaurants AS r

            ";
            var restaurants = await _databaseService.QueryAsync<dynamic>(query, new { Username = username });

            var parsed = restaurants.Select(r => new
            {
                ImageURL = r.ImageURL,
                RestaurantID = r.RestaurantID,
                RestaurantName = r.Name,
                CuisineType = r.CuisineType,
                OpeningTime = r.OpeningTime,
                ClosingTime = r.ClosingTime,
                MenuDescription = r.MenuDescription,
                SeatingCapacity = r.SeatingCapacity,
                ClosureStatus = r.ClosureStatus,
                Area = JsonConvert.DeserializeObject<AreaModel>(r.Area),
                MenuList = r.MenuList != null ? JsonConvert.DeserializeObject<List<MenuList>>(r.MenuList) : null,
                hasCrud = r.hasCrud
            });

            return Ok(parsed);

        }

        [Authorize(Roles = "999, 1")]
        [HttpPost]
        public async Task<IActionResult> AddRestaurant([FromBody] RestaurantModel restaurant)
        {
            var query =
            @"
            INSERT INTO Restaurants
            (
                ImageURL,
                Name,
                CuisineType,
                OpeningTime,
                ClosingTime,
                MenuDescription,
                SeatingCapacity,
                AreaID
            )
            VALUES
            (
                @ImageURL,
                @Name,
                @CuisineType,
                @OpeningTime,
                @ClosingTime,
                @MenuDescription,
                @SeatingCapacity,
                @AreaID
            )
            ";

            await _databaseService.ExecuteAsync(query,
            new
            {
                ImageURL = restaurant.ImageURL,
                Name = restaurant.RestaurantName,
                CuisineType = restaurant.CuisineType,
                OpeningTime = restaurant.OpeningTime,
                ClosingTime = restaurant.ClosingTime,
                MenuDescription = restaurant.MenuDescription,
                SeatingCapacity = restaurant.SeatingCapacity,
                AreaID = restaurant.Area.AreaID
            });

            return Ok(new { Message = "Restaurant added successfully" });
        }



        [Authorize(Roles = "999, 1")]
        [HttpPut]
        public async Task<IActionResult> UpdateRestaurant([FromBody] RestaurantModel restaurant)
        {
            var query =
            @"
            UPDATE Restaurants
            SET
                ImageURL = @ImageURL,
                Name = @Name,
                CuisineType = @CuisineType,
                OpeningTime = @OpeningTime,
                ClosingTime = @ClosingTime,
                MenuDescription = @MenuDescription,
                SeatingCapacity = @SeatingCapacity,
                AreaID = @AreaID
            WHERE
                RestaurantID = @RestaurantID
            ";
            await _databaseService.ExecuteAsync(query,
            new
            {
                ImageURL = restaurant.ImageURL,
                Name = restaurant.RestaurantName,
                CuisineType = restaurant.CuisineType,
                OpeningTime = restaurant.OpeningTime,
                ClosingTime = restaurant.ClosingTime,
                MenuDescription = restaurant.MenuDescription,
                SeatingCapacity = restaurant.SeatingCapacity,
                AreaID = restaurant.Area.AreaID,
                RestaurantID = restaurant.RestaurantID
            });

            return Ok(new { Message = "Restaurant updated successfully" });
        }

        [Authorize(Roles = "999, 1")]
        [HttpDelete("{RestaurantID}")]
        public async Task<IActionResult> DeleteRestaurant(int RestaurantID)
        {
            var query =
            @"
            DELETE FROM Restaurants
            WHERE
                RestaurantID = @RestaurantID
            ";
            await _databaseService.ExecuteAsync(query,
            new
            {
                RestaurantID = RestaurantID
            });

            return Ok(new { Message = "Restaurant deleted successfully" });
        }

        [Authorize(Roles = "999, 1")]
        [HttpGet("{restaurantID}/menu")]
        public async Task<IActionResult> GetMenuItems(int restaurantID)
        {
            var query =
            @"
            SELECT
                MenuItemID as ItemID,
                ItemName,
                Price
            FROM
                MenuItems
            WHERE
                RestaurantID = @RestaurantID
            ";

            var menuItems = await _databaseService.QueryAsync<dynamic>(query, new { RestaurantID = restaurantID });
            var parsed = menuItems.Select(m => new MenuList
            {
                ItemID = m.ItemID,
                ItemName = m.ItemName,
                Price = m.Price
            });

            return Ok(parsed);
        }


        [Authorize(Roles = "999, 1")]
        [HttpPost("{restaurantID}/menu")]
        public async Task<IActionResult> CreateMenuItem(int restaurantID, [FromBody] MenuList menuItem)
        {
            var query =
            @"
            INSERT INTO MenuItems
            (
                RestaurantID,
                ItemName,
                Price
            )
            VALUES
            (
                @RestaurantID,
                @ItemName,
                @Price
            )
            ";

            await _databaseService.ExecuteAsync(query, new
            {
                RestaurantID = restaurantID,
                ItemName = menuItem.ItemName,
                Price = menuItem.Price,
            });

            return Ok(new { Message = "Menu item created successfully" });
        }

        [Authorize(Roles = "999, 1")]
        [HttpPut("{RestaurantID}/menu/{menuItemID}")]
        public async Task<IActionResult> UpdateMenuItem(int RestaurantID, int menuItemID, [FromBody] MenuList menuItem)
        {
            var query =
            @"
            UPDATE MenuItems
            SET
                ItemName = @ItemName,
                Price = @Price
            WHERE
                MenuItemID = @MenuItemID
                AND RestaurantID = @RestaurantID
            ";

            var menu = await _databaseService.ExecuteAsync(query, new
            {
                ItemName = menuItem.ItemName,
                Price = menuItem.Price,
                MenuItemID = menuItemID,
                RestaurantID = RestaurantID
            });

            return Ok(new { Message = "Menu item updated successfully" });
        }

        [Authorize(Roles = "999, 1")]
        [HttpDelete("{restaurantID}/menu/{menuItemID}")]
        public async Task<IActionResult> DeleteMenuItem(int restaurantID, int menuItemID)
        {
            var query =
            @"
            DELETE FROM MenuItems
            WHERE
                MenuItemID = @MenuItemID
                AND RestaurantID = @RestaurantID
            ";

            await _databaseService.ExecuteAsync(query, new
            {
                MenuItemID = menuItemID,
                RestaurantID = restaurantID
            });

            return Ok(new { Message = "Menu item deleted successfully" });
        }


    }
}