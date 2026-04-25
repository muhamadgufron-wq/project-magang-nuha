"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/auth';
import { useRouter } from 'next/navigation';
import { getCookie, setCookie, eraseCookie } from '@/utils/cookies';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provider komponen yang mengelola state autentikasi global menggunakan Cookies.
 * Menyediakan data user, status loading, serta fungsi login dan logout.
 * 
 * @param {Object} props - Properti komponen.
 * @param {React.ReactNode} props.children - Elemen anak yang akan diberikan akses ke context.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Memulihkan sesi dari cookies saat aplikasi pertama kali dimuat
    const token = getCookie("token");
    const storedUser = getCookie("user");

    if (token && storedUser) {
      try {
        setUser(JSON.parse(decodeURIComponent(storedUser)));
      } catch (error) {
        console.error("Gagal mem-parse data user dari cookie", error);
        eraseCookie("token");
        eraseCookie("user");
      }
    }
    setLoading(false);
  }, []);

  /**
   * Menyimpan data autentikasi ke dalam Cookies.
   * 
   * @param {string} token - Token JWT dari server.
   * @param {User} userData - Data profil user.
   */
  const login = (token: string, userData: User) => {
    // Simpan token selama 1 hari
    setCookie("token", token, 1);
    // Simpan data user (di-encode agar aman disimpan di cookie)
    setCookie("user", encodeURIComponent(JSON.stringify(userData)), 1);
    setUser(userData);
  };

  /**
   * Menghapus seluruh data autentikasi dari Cookies dan mengarahkan kembali ke halaman login.
   */
  const logout = () => {
    eraseCookie("token");
    eraseCookie("user");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook kustom untuk mengakses context autentikasi.
 * Harus digunakan di dalam komponen yang dibungkus oleh AuthProvider.
 * 
 * @returns {AuthContextType} Objek context yang berisi user, loading, login, dan logout.
 * @throws {Error} Jika hook digunakan di luar AuthProvider.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
