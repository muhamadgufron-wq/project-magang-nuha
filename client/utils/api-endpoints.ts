/**
 * Peta Endpoint API Backend
 * Kumpulkan semua URL API di sini supaya kalau backend ganti path, 
 * kita cuma butuh ganti di satu tempat saja.
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  DOCTOR: {
    LIST: '/doctor',
    DETAIL: (uuid: string) => `/doctor/${uuid}`,
    SPECIALIZATIONS: '/doctor/specializations',
  },
  APPOINTMENT: {
    CREATE: '/appointment',
    MY_APPOINTMENTS: '/appointment/my-appointments',
  }
};
