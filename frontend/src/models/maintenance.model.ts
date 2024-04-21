export interface AffectedEntity {
  entityType: string;
  entityName: string;
  entityID: number;
  closureStatus: boolean;
}

export interface Maintenance {
  [x: string]: any;
  maintenanceID: number;
  maintenanceStartDate: string;
  maintenanceEndDate?: string;
  reason: string;
  description: string;
  affectedEntities?: AffectedEntity[];
}

export interface MaintenanceEntity {
  entityID: number;
  entityName: string;
}
