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
  username: z
    .string({ message: "Username wajib diisi" })
    .min(3, { message: "Username minimal 3 karakter" }),
  email: z
    .string({ message: "Email wajib diisi" })
    .email({ message: "Format email tidak valid" }),
  password: z
    .string({ message: "Password wajib diisi" })
    .min(8, { message: "Password minimal 8 karakter" }),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
