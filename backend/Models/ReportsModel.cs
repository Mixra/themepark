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
}