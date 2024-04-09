export interface User {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: Position | null;
  hourlyRate: number | null;
  ssn: string | null;
  startDate: string | null;
  endDate: string | null;
  address: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  isFullTime: boolean | null;
  parkAreas: ParkArea[];
}

export interface Position {
  name: string;
  level: PrivilegeLevel;
}

export enum PrivilegeLevel {
  NoPrivilege = 0,
  EmployeePrivilege = 1,
  AdminPrivilege = 999,
}

export interface ParkArea {
  id: number;
  name: string;
}
