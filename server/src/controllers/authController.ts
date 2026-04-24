import { Request, Response } from 'express';
import { LoginRequest, AuthResponse } from '../types/user';
import authService from '../services/authService';
import { loginSchema, registerSchema } from '../validations/authValidation';
import { ZodError } from 'zod';


export const register = async (req: Request, res: Response) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const authData = await authService.register(validatedData);

    return res.status(201).json(authData);
  } catch (error: any) {
    if (error instanceof ZodError) {
      return res.status(400).json({ message: error.issues[0].message });
    }
    if (error.message === "Email sudah terdaftar") {
      return res.status(409).json({ message: error.message });
    }

    console.error("Register Error:", error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};


export const login = async (req: Request<{}, {}, LoginRequest>, res: Response<AuthResponse | { message: any }>) => {
  try {
    // Validasi input menggunakan Zod
    const validatedData = loginSchema.parse(req.body);

    const authData = await authService.authenticate(validatedData);

    return res.status(200).json(authData);
  } catch (error: any) {
    if (error instanceof ZodError) {
      const errorMessage = error.issues[0].message;
      return res.status(400).json({ message: errorMessage });
    }

    // Menangani error spesifik dari service (Email tidak terdaftar / Password salah)
    if (error.message === "Email tidak terdaftar" || error.message === "Kata sandi salah") {
      return res.status(401).json({ message: error.message });
    }

    console.error("Login Error:", error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};
