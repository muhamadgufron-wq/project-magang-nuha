/**
 * Utilitas untuk mengelola cookies di sisi client.
 */

/**
 * Mengatur nilai cookie.
 * 
 * @param {string} name - Nama cookie.
 * @param {string} value - Nilai yang akan disimpan.
 * @param {number} days - Masa berlaku dalam hari.
 */
export const setCookie = (name: string, value: string, days: number = 1) => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "; expires=" + date.toUTCString();
  document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Strict";
};

/**
 * Mengambil nilai cookie berdasarkan nama.
 * 
 * @param {string} name - Nama cookie yang ingin diambil.
 * @returns {string | null} Nilai cookie atau null jika tidak ditemukan.
 */
export const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

/**
 * Menghapus cookie berdasarkan nama.
 * 
 * @param {string} name - Nama cookie yang akan dihapus.
 */
export const eraseCookie = (name: string) => {
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict';
};
