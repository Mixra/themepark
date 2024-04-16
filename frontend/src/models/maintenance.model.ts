export interface AffectedEntity {
    entityType: string;
    entityName: string;
    entityId: number;
    closureStatus: boolean;
  }
  
  export interface Maintenance {
    MaintenanceID: number;
    MaintenanceStartDate: Date;
    MaintenanceEndDate?: Date;
    Reason: string;
    Description: string;
    RequireClosure: boolean;
    AffectedEntities: AffectedEntity[];
    DeletedAt?: Date;
    hasCRUD: boolean;
  }
  