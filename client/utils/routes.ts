/**
 * Centralized Route Map
 * Gunakan konstanta ini daripada menulis string manual (hardcoded)
 * agar navigasi lebih konsisten dan mudah diubah.
 */
export const ROUTES = {
  // Rute Utama
  LANDING: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  HOME: '/home',
  
  // Rute Dokter
  DOCTORS: '/doctors',
  DOCTOR_DETAIL: (id: string | number) => `/doctors/${id}`,
  BOOKING: (id: string | number) => `/doctors/${id}/booking`,
  
  // Rute Janji Temu
  APPOINTMENTS: '/appointments',
};
