import { LoginRequest, AuthResponse, RegisterRequest } from '../types/user';
import prisma from '../config/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class AuthService {
  
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const { username, email, password } = data;

    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error("Email sudah terdaftar");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan ke database
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    // Buat token JWT
    const secret = process.env.JWT_SECRET || 'fallback_secret';
    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      secret,
      { expiresIn: (process.env.JWT_EXPIRES_IN || '4h') as any } 
    );

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  /**
   * Melakukan autentikasi pengguna berdasarkan email dan password.
   */
  async authenticate(credentials: LoginRequest): Promise<AuthResponse> {
    const { email, password } = credentials;
    
    // Cari user di database berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Jika user tidak ditemukan
    if (!user) {
      throw new Error("Email tidak terdaftar");
    }

    //  Cek apakah password cocok
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Kata sandi salah");
    }

    // Buat token JWT
    const secret = process.env.JWT_SECRET || 'fallback_secret';
    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      secret,
      { expiresIn: (process.env.JWT_EXPIRES_IN || '4h') as any }
    );

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
      token,
    };
  }
}

export default new AuthService();
