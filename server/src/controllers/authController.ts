import { Request, Response } from 'express';
import { LoginRequest } from '../types/user';
import authService from '../services/authService';
import { loginSchema, registerSchema } from '../validations/authValidation';
import { ZodError } from 'zod';
import { sendSuccess, sendError } from '../utils/response';


export const register = async (req: Request, res: Response) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const authData = await authService.register(validatedData);

    return sendSuccess(res, 'Registrasi berhasil', authData, 201);
  } catch (error: any) {
    if (error instanceof ZodError) {
      return sendError(res, error.issues[0].message, 400);
    }
    if (error.message === "Email sudah terdaftar") {
      return sendError(res, error.message, 409);
    }

    console.error("Register Error:", error);
    return sendError(res, "Terjadi kesalahan pada server", 500);
  }
};


export const login = async (req: Request<{}, {}, LoginRequest>, res: Response) => {
  try {
    // Validasi input menggunakan Zod
    const validatedData = loginSchema.parse(req.body);

    const authData = await authService.authenticate(validatedData);

    return sendSuccess(res, 'Login berhasil', authData, 200);
  } catch (error: any) {
    if (error instanceof ZodError) {
      const errorMessage = error.issues[0].message;
      return sendError(res, errorMessage, 400);
    }

    // Menangani error spesifik dari service jika Email tidak terdaftar / Password salah
    if (error.message === "Email tidak terdaftar" || error.message === "Kata sandi salah") {
      return sendError(res, error.message, 401);
    }

    console.error("Login Error:", error);
    return sendError(res, "Terjadi kesalahan pada server", 500);
  }
};
