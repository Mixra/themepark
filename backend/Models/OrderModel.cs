namespace backend.Models
{
    public class OrderModel
    {
        public required List<OrderItem> Items { get; set; }
    }


    public class OrderItem
    {
        public required string ItemType { get; set; }
        public int? RideID { get; set; }
        public int? EventID { get; set; }
        public int? ItemID { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }
    public class PurchaseHistoryModel
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public decimal Price { get; set; }
        public required string ItemType { get; set; }
        public int Quantity { get; set; }
        public bool RefundStatus { get; set; }
        public DateTime TicketExpiryDate { get; set; }
        public DateTime PurchaseDate { get; set; }
    }


}


