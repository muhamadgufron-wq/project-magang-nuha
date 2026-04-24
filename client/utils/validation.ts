import { z } from 'zod';

/**
 * Skema validasi untuk form Login
 */
export const loginSchema = z.object({
  email: z
    .string({ message: "Email wajib diisi" })
    .min(1, { message: "Email tidak boleh kosong" })
    .email({ message: "Format email tidak valid" }),
  password: z
    .string({ message: "Password wajib diisi" })
    .min(8, { message: "Password minimal 8 karakter" }),
});

/**
 * Skema validasi untuk form Register
 */
export const registerSchema = z.object({
  username: z
    .string({ message: "Username wajib diisi" })
    .min(3, { message: "Username minimal 3 karakter" }),
  email: z
    .string({ message: "Email wajib diisi" })
    .min(1, { message: "Email tidak boleh kosong" })
    .email({ message: "Format email tidak valid" }),
  password: z
    .string({ message: "Password wajib diisi" })
    .min(8, { message: "Password minimal 8 karakter" }),
});

// Mengonversi skema menjadi tipe TypeScript agar bisa digunakan sebagai tipe variabel
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
