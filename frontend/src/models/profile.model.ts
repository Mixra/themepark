export interface UserData {
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  staffInfo: StaffInfoData;
}

export interface StaffInfoData {
  areas: string[];
  ssn: string;
  address: string;
  hourlyRate: number;
  startDate: string;
  endDate: string | null;
  emergencyContactName: string;
  emergencyContactPhone: string;
  fullTime: boolean;
}

export interface StaffInfoProps {
  staffInfo: StaffInfoData;
  isEditing: boolean;
}
