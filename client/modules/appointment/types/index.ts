import { DoctorSchedule, User } from "../../doctor/types";

export type BookingStatus = "BOOKED" | "REGISTERED" | "CANCELLED";

export interface Registered {
  id: number;
  uuid: string;
  patient_id: number;
  slot_id: number;
  schedule: string;
  status: BookingStatus;
  booking_code: string;
  patient_type: "VIP" | "GENERAL";
  doctor_schedule: DoctorSchedule & {
    doctor: {
      user: Pick<User, "name">;
      specialization?: string;
    }
  };
  created_at: string;
  updated_at: string;
}

export interface CreateRegistrationRequest {
  slotId: number;
  patientType: "VIP" | "GENERAL";
  schedule?: string;
  
  // Note: These fields are needed for the UI form based on the design,
  // but currently the backend infers patient details from the logged in user's `patient` profile.
  // The design asks for these. If we wanted to update the profile, we'd need another endpoint.
  // For now, we just pass the required fields for booking.
}
