"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import Link from 'next/link';
import { loginUser, useAuth } from '../'; 
import { loginSchema } from '@/utils/validation';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

type LoginFormValues = z.infer<typeof loginSchema>;

/**
 * Komponen Form Login (Versi Bersih).
 * Dirender di dalam AuthLayout (Sisi Kanan).
 */
export const LoginForm = () => {
  const router = useRouter();
  const { login: authLogin } = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormValues) => {
      return await loginUser(data.email, data.password);
    },
    onSuccess: (data) => {
      authLogin(data.token, data.user);

      Swal.fire({
        icon: 'success',
        title: 'Berhasil masuk',
        text: `Selamat datang, ${data.user.username}!`,
        showConfirmButton: false,
        timer: 1500
      });

      router.push("/home");
      router.refresh();
    },
    onError: (err: any) => {
      const msg = err.message || "";
      if (msg === "Email tidak terdaftar") {
        setError("email", { type: "manual", message: msg });
      } else if (msg === "Kata sandi salah") {
        setError("password", { type: "manual", message: msg });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Gagal Masuk',
          text: msg || 'Terjadi kesalahan sistem.',
          confirmButtonColor: '#10b981',
        });
      }
    }
  });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="space-y-8 w-full">
      <div className="text-center">
        <h2 className="text-4xl font-black text-emerald-700 tracking-tight">
          Login
        </h2>
        <p className="mt-3 text-gray-500 font-light">
          Masuk ke akun Anda untuk mulai menggunakan layanan kami.
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">Email</label>
            <input
              type="email"
              {...register("email")}
              className={`block w-full px-5 py-4 rounded-xl border-2 ${errors.email ? 'border-red-500' : 'border-gray-200 focus:border-emerald-500'} bg-white text-gray-900 focus:outline-none transition-all`}
              placeholder="Masukan Email Anda"
            />
            {errors.email && <p className="mt-2 text-xs font-light text-red-500">{errors.email.message}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">Kata Sandi</label>
            <input
              type="password"
              {...register("password")}
              className={`block w-full px-5 py-4 rounded-xl border-2 ${errors.password ? 'border-red-500' : 'border-gray-200 focus:border-emerald-500'} bg-white text-gray-900 focus:outline-none transition-all`}
              placeholder="••••••••"
            />
            {errors.password && <p className="mt-2 text-xs font-light text-red-500">{errors.password.message}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className={`w-full py-4 rounded-xl tracking-wider bg-emerald-700 text-white font-bold text-lg hover:bg-emerald-700 active:scale-[0.98] transition-all ${loginMutation.isPending ? 'opacity-70' : ''}`}
        >
          {loginMutation.isPending ? "Memproses..." : "Login"}
        </button>
        
        <p className="text-center text-gray-600 font-light">
          Belum punya akun?{' '}
          <Link href="/register" className="font-bold text-emerald-600 hover:text-emerald-700 decoration-2">
            Daftar Sekarang
          </Link>
        </p>
      </form>
    </div>
  );
};
