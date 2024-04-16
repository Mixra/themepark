using backend.Models;

namespace backend.Models
{
    public class RestaurantModel
    {
        public required string ImageURL { get; set; }
        public int RestaurantID { get; set; }
        public required string RestaurantName { get; set; }
        public required string CuisineType { get; set; }
        public required string OpeningTime { get; set; }
        public required string ClosingTime { get; set; }
        public required string MenuDescription { get; set; }
        public int SeatingCapacity { get; set; }
        public required AreaModel Area { get; set; }
    }



    public class MenuList
    {
        public int ItemID { get; set; }
        public required string ItemName { get; set; }
        public required decimal Price { get; set; }
    }
}