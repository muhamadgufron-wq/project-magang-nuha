import { LoginRequest, AuthResponse, RegisterRequest } from '../types/user';
import prisma from '../config/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class AuthService {
  
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const { name, email, password, phone, role } = data;

    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error("Email sudah terdaftar");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan ke database menggunakan Transaction untuk memastikan User dan Profile (Patient/Doctor) dibuat bersamaan
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          phone,
          role,
        },
      });

      // Buat profil berdasarkan role
      if (role === 'PATIENT') {
        await tx.patient.create({
          data: {
            user_id: user.id,
            name: user.name,
            phone: user.phone,
          },
        });
      } else if (role === 'DOCTOR') {
        await tx.doctor.create({
          data: {
            user_id: user.id,
          },
        });
      }

      return user;
    });

    // Buat token JWT
    const secret = process.env.JWT_SECRET || 'fallback_secret';
    const token = jwt.sign(
      { id: result.id, uuid: result.uuid, email: result.email, role: result.role },
      secret,
      { expiresIn: (process.env.JWT_EXPIRES_IN || '4h') as any } 
    );

    return {
      user: {
        id: result.id,
        uuid: result.uuid,
        name: result.name,
        email: result.email,
        role: result.role,
        is_vip: result.is_vip,
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
      { id: user.id, uuid: user.uuid, email: user.email, role: user.role },
      secret,
      { expiresIn: (process.env.JWT_EXPIRES_IN || '4h') as any }
    );

    return {
      user: {
        id: user.id,
        uuid: user.uuid,
        name: user.name,
        email: user.email,
        role: user.role,
        is_vip: user.is_vip,
      },
      token,
    };
  }
}

export default new AuthService();
