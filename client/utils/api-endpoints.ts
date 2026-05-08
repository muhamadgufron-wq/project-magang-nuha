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
    LIST: '/doctors',
    DETAIL: (uuid: string) => `/doctors/${uuid}`,
    SPECIALIZATIONS: '/doctors/specializations',
  },
  APPOINTMENT: {
    CREATE: '/appointments',
    MY_APPOINTMENTS: '/appointments/me',
  }
};
