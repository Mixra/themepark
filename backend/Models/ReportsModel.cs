namespace backend.Models
{
    public class SalesModel
    {
        public required DateTime StartDate { get; set; }
        public required DateTime EndDate { get; set; }
    }

    public class MaintenanceReportModel
    {
        public required DateTime StartDate { get; set; }
        public required DateTime EndTime { get; set; }
    }

    public class RideReportModel
    {
        public required int RideID { get; set;}
    }
}

public class InventoryReportModel
{
    public List<StoreModel>? Stores { get; set; }
    public List<ItemModel>? OverallBestItem { get; set; }
    public List<ItemModel>? OverallWorstItem { get; set; }
}

public class StoreModel
{
    public int ShopID { get; set; }
    public string? ShopName { get; set; }
    public List<ItemModel>? Items { get; set; }
    public string? BestItemName { get; set; }
    public string? WorstItemName { get; set; }
}

public class ItemModel
{
    public int ItemID { get; set; }
    public string? ItemName { get; set; }
    public int QuantityInStock { get; set; }
    public int QuantitySold { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal SoldSales { get; set; }
}