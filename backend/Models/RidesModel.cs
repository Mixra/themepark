namespace backend.Models
{
    public class RidesModel
    {
        public int RideID { get; set; }
        public required string ImageUrl { get; set; }
        public required string RideName { get; set; }
        public required string Type { get; set; }
        public required AreaModel Area { get; set; }
        public int? MaximumCapacity { get; set; }
        public int? MinimumHeight { get; set; }
        public required int Duration { get; set; }
        public required int UnitPrice { get; set; }
        public string? Description { get; set; }
        public required string OpeningTime { get; set; }
        public required string ClosingTime { get; set; }
    }

    public class AreaModel
    {
        public int AreaID { get; set; }
        public required string AreaName { get; set; }
    }
}
