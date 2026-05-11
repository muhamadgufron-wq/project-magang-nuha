export interface User {
  id: number;
  uuid: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  is_vip: boolean;
}

export interface DoctorSchedule {
  id: number;
  uuid: string;
  doctor_id: number;
  date: string;
  start_time: string;
  end_time: string;
  vip_quota: number;
  general_quota: number;
  booked_vip: number;
  booked_general: number;
  status: string;
  notes?: string;
}

export interface DoctorMasterSchedule {
  id: number;
  uuid: string;
  doctor_id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  vip_quota: number;
  general_quota: number;
  status: string;
}

export interface Doctor {
  id: number;
  uuid: string;
  user_id: number;
  name: string;
  specialization?: string;
  practice_number?: string;
  description?: string;
  user: User;
  schedules: DoctorSchedule[];
  master_schedules?: DoctorMasterSchedule[];
  created_at: string;
  updated_at: string;
}
