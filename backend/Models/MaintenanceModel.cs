using System;

namespace backend.Models
{
    public class MaintenanceModel
    {
        public int MaintenanceID { get; set; }
        public DateTime MaintenanceStartDate { get; set; }
        public DateTime? MaintenanceEndDate { get; set; }
        public string? Reason { get; set; }
        public string Description { get; set; }
        public bool RequireClosure { get; set; }

        public string? EntityType { get; set;}
        public int EntityID { get; set; }
        public bool ClosureStatus { get; set; }
        public List<AffectedEntityModel> AffectedEntities { get; set; }
    }

    public class AffectedEntityModel
{
    public string EntityType { get; set; }
    public int EntityID { get; set; }
    public bool ClosureStatus { get; set; }
}
   
}


/*Table Maintenance {
  MaintenanceID int [pk, increment]
  MaintenanceStartDate datetime
  MaintenanceEndDate datetime [null]
  Reason varchar
  Description varchar
  RequireClosure bit
}
Table MaintenanceAffectedEntities {
  MaintenanceID int [ref: > Maintenance.MaintenanceID]
  EntityType varchar 
  EntityID int
  ClosureStatus bit 
  Indexes {
    (MaintenanceID, EntityType, EntityID) [unique]
  }
}*/