using System;

namespace backend.Models
{
    public class EventsModel
    {
        public int EventID { get; set; }
        public required string EventName { get; set; }
        public required string Description { get; set; }
        public required string EventType { get; set; }
        public required string AgeRestriction { get; set; }
        public required string ImageUrl { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool RequireTicket { get; set; }
        public decimal? UnitPrice { get; set; }
    }
}