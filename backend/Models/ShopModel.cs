namespace backend.Models
{
    public class ShopModel
    {
        public required string ImageURL { get; set; }
        public int ShopID { get; set; }
        public required string ShopName { get; set; }
        public required string Description { get; set; }
        public required string OpeningTime { get; set; }
        public required string ClosingTime { get; set; }
        public required string MerchandiseType { get; set; }
        public required AreaModel Area { get; set; }
    }


    public class InventoryModel
    {
        public int ItemID { get; set; }
        public int ShopID { get; set; }
        public required string ItemName { get; set; }
        public string? Description { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }

    }
}