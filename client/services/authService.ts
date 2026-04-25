import { AuthResponse } from "../types/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Melakukan pemanggilan API untuk login pengguna.
 * 
 * @param email - Email pengguna yang dimasukkan
 * @param password - Kata sandi pengguna yang dimasukkan
 * @returns Promise yang berisi data autentikasi (user dan token)
 * @throws Error jika respon API tidak berhasil atau terjadi masalah jaringan
 */
export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Gagal melakukan login");
  }

  return data;
};

/**
 * Melakukan pemanggilan API untuk pendaftaran pengguna baru.
 * 
 * @param {string} username - Nama unik yang akan digunakan oleh pengguna.
 * @param {string} email - Alamat email aktif untuk akun baru.
 * @param {string} password - Kata sandi yang memenuhi kriteria keamanan.
 * @returns {Promise<AuthResponse>} Promise yang berisi objek data user baru dan token JWT.
 * @throws {Error} Jika email sudah terdaftar atau terjadi kesalahan pada validasi server.
 */
export const registerUser = async (username: string, email: string, password: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Gagal melakukan pendaftaran");
  }

  return data;
};
