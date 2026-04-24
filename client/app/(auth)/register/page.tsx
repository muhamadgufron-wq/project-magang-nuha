"use client";

import React, { useState } from 'react';
import { registerUser } from '@/services/authService';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { registerSchema } from '@/utils/validation';

const RegisterPage = () => {
  const router = useRouter();
  const { login: authLogin } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; email?: string; password?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validasi Client-side menggunakan Zod
    const validation = registerSchema.safeParse({ username, email, password });

    if (!validation.success) {
      const fieldErrors: any = {};
      validation.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);


    try {
      const data = await registerUser(username, email, password);
      // ... (rest of success logic)
      document.cookie = `token=${data.token}; path=/; max-age=86400; SameSite=Strict`;
      authLogin(data.token, data.user);

      await Swal.fire({
        icon: 'success',
        title: 'Berhasil Mendaftar',
        text: `Selamat datang, ${data.user.username}!`,
        showConfirmButton: false,
        timerProgressBar: false,
      });

      router.push("/");
      router.refresh();

    } catch (err: any) {
      const msg = err.message || "";
      
      if (msg === "Email sudah terdaftar") {
        setErrors({ email: msg });
      } else if (msg.includes("Username")) {
        setErrors({ username: msg });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Pendaftaran Gagal',
          text: msg || 'Terjadi kesalahan saat mendaftar.',
          confirmButtonColor: '#10b981',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white p-10 rounded-2xl shadow-xl space-y-8 border border-emerald-100">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
              Daftar Akun
            </h2>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  className={`block w-full px-4 py-3 rounded-xl border ${errors.username ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-emerald-500'} text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 sm:text-sm`}
                  placeholder="Masukan username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username}</p>}
              </div>
              <div>
                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  className={`block w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-emerald-500'} text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 sm:text-sm`}
                  placeholder="Masukan email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className={`block w-full px-4 py-3 rounded-xl border ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-emerald-500'} text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 sm:text-sm`}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`group relative flex w-full justify-center rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-white shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Mendaftar...
                </span>
              ) : "Daftar Sekarang"}
            </button>
            <p className="text-sm text-gray-600 text-center">
              Sudah punya akun?{' '}
              <Link href="/login" className="font-medium text-emerald-600 hover:text-emerald-500">
                Masuk di sini
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
