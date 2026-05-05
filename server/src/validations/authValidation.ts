import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string({ message: "Email wajib diisi" })
    .email({ message: "Format email tidak valid" }),
  password: z
    .string({ message: "Password wajib diisi" })
    .min(8, { message: "Password minimal 8 karakter" }),
});

export const registerSchema = z.object({
  name: z
    .string({ message: "Nama lengkap wajib diisi" })
    .min(3, { message: "Nama minimal 3 karakter" }),
  email: z
    .string({ message: "Email wajib diisi" })
    .email({ message: "Format email tidak valid" }),
  password: z
    .string({ message: "Password wajib diisi" })
    .min(8, { message: "Password minimal 8 karakter" }),
  phone: z
    .string({ message: "Nomor telepon wajib diisi" })
    .optional(),
  role: z.enum(['PATIENT', 'DOCTOR', 'ADMIN']).default('PATIENT'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
