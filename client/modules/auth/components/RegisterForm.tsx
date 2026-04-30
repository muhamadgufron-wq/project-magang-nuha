"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import Link from 'next/link';
import { registerUser, useAuth } from '../'; // Mengambil dari index module
import { registerSchema } from '@/utils/validation';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

type RegisterFormValues = z.infer<typeof registerSchema>;

/**
 * Komponen Form Register yang berisi seluruh logika dan UI pendaftaran akun.
 * Dipisahkan dari layer routing (app) agar lebih modular.
 */
export const RegisterForm = () => {
  const router = useRouter();
  const { login: authLogin } = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: ""
    }
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormValues) => {
      return await registerUser(data.username, data.email, data.password);
    },
    onSuccess: (data) => {
      authLogin(data.token, data.user);

      Swal.fire({
        icon: 'success',
        title: 'Berhasil Mendaftar',
        text: `Selamat datang, ${data.user.username}!`,
        showConfirmButton: false,
        timerProgressBar: false,
        timer: 1500
      });

      router.push("/home");
      router.refresh();
    },
    onError: (err: any) => {
      const msg = err.message || "";
      
      if (msg === "Email sudah terdaftar") {
        setError("email", { type: "manual", message: msg });
      } else if (msg.includes("Username")) {
        setError("username", { type: "manual", message: msg });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Pendaftaran Gagal',
          text: msg || 'Terjadi kesalahan saat mendaftar.',
          confirmButtonColor: '#10b981',
        });
      }
    }
  });

  const onSubmit = (data: RegisterFormValues) => {
    registerMutation.mutate(data);
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

          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  {...register("username")}
                  className={`block w-full px-4 py-3 rounded-xl border ${errors.username ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-emerald-500'} text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 sm:text-sm`}
                  placeholder="Masukan username"
                />
                {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username.message}</p>}
              </div>
              <div>
                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email-address"
                  type="email"
                  {...register("email")}
                  className={`block w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-emerald-500'} text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 sm:text-sm`}
                  placeholder="Masukan email"
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  {...register("password")}
                  className={`block w-full px-4 py-3 rounded-xl border ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-emerald-500'} text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 sm:text-sm`}
                  placeholder="••••••••"
                />
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className={`group relative flex w-full justify-center rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-white shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${registerMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {registerMutation.isPending ? (
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
