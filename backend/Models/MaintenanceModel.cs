namespace backend.Models
{
  public class MaintenanceModel
  {
    public int MaintenanceID { get; set; }
    public DateTime MaintenanceStartDate { get; set; }
    public DateTime? MaintenanceEndDate { get; set; }
    public string? Reason { get; set; }
    public string Description { get; set; }
    public List<AffectedEntityModel>? AffectedEntities { get; set; }
  }

  public class AffectedEntityModel
  {
    public string EntityType { get; set; }
    public int EntityID { get; set; }
    public string EntityName { get; set; }
    public bool ClosureStatus { get; set; }
  }

}
