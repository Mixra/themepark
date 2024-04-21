namespace backend.Models
{
    public class ParkAreas
    {
        public int? AreaID { get; set; }
        public required string AreaName { get; set; }
        public required string Theme { get; set; }
        public required string Description { get; set; }
        public required string ImageUrl { get; set; }
        public required TimeSpan OpeningTime { get; set; }
        public required TimeSpan ClosingTime { get; set; }
    }

    public class RideViewModel
    {
        public int RideID { get; set; }
        public required string RideName { get; set; }
    }

    public class GiftShopViewModel
    {
        public int ShopID { get; set; }
        public required string ShopName { get; set; }
    }

    public class RestaurantViewModel
    {
        public int RestaurantID { get; set; }
        public required string RestaurantName { get; set; }
    }

    public class ParkViewModel
    {
        public int AreaID { get; set; }
        public required string AreaName { get; set; }
    }
}