"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import Link from 'next/link';
import { registerUser, useAuth } from '../';
import { registerSchema } from '@/utils/validation';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

type RegisterFormValues = z.infer<typeof registerSchema>;

/**
 * Komponen Form Register (Versi Bersih).
 * Dirender di dalam AuthLayout (Sisi Kanan).
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
      name: "",
      email: "",
      password: ""
    }
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormValues) => {
      return await registerUser(data.name, data.email, data.password);
    },
    onSuccess: (data) => {
      authLogin(data.token, data.user);

      Swal.fire({
        icon: 'success',
        title: 'Berhasil Mendaftar',
        text: `Selamat datang, ${data.user.username}!`,
        showConfirmButton: false,
        timer: 1500
      });

      router.push("/home");
      router.refresh();
    },
    onError: (err: any) => {
      const msg = err.message || "";
      if (msg === "Email sudah terdaftar") {
        setError("email", { type: "manual", message: msg });
      } else if (msg.toLowerCase().includes("nama")) {
        setError("name", { type: "manual", message: msg });
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
    <div className="space-y-8 w-full">
      <div className="text-left">
        <h2 className="text-4xl font-black text-gray-900 tracking-tight">
          Daftar Akun
        </h2>
        <p className="mt-3 text-gray-500 font-medium">
          Daftarkan diri Anda untuk mulai menikmati layanan kesehatan kami.
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap</label>
            <input
              type="text"
              {...register("name")}
              className={`block w-full px-5 py-4 rounded-2xl border-2 ${errors.name ? 'border-red-500' : 'border-gray-100 focus:border-emerald-500'} bg-white text-gray-900 focus:outline-none transition-all`}
              placeholder="Masukan Nama Lengkap"
            />
            {errors.name && <p className="mt-2 text-xs font-bold text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
            <input
              type="email"
              {...register("email")}
              className={`block w-full px-5 py-4 rounded-2xl border-2 ${errors.email ? 'border-red-500' : 'border-gray-100 focus:border-emerald-500'} bg-white text-gray-900 focus:outline-none transition-all`}
              placeholder="Masukan Email Anda"
            />
            {errors.email && <p className="mt-2 text-xs font-bold text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Kata Sandi</label>
            <input
              type="password"
              {...register("password")}
              className={`block w-full px-5 py-4 rounded-2xl border-2 ${errors.password ? 'border-red-500' : 'border-gray-100 focus:border-emerald-500'} bg-white text-gray-900 focus:outline-none transition-all`}
              placeholder="••••••••"
            />
            {errors.password && <p className="mt-2 text-xs font-bold text-red-500">{errors.password.message}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={registerMutation.isPending}
          className={`w-full py-4 rounded-2xl bg-emerald-600 text-white font-bold text-lg hover:bg-emerald-700 active:scale-[0.98] transition-all ${registerMutation.isPending ? 'opacity-70' : ''}`}
        >
          {registerMutation.isPending ? "Memproses..." : "Daftar Sekarang"}
        </button>
        
        <p className="text-center text-gray-600 font-medium">
          Sudah punya akun?{' '}
          <Link href="/login" className="font-bold text-emerald-600 hover:underline underline-offset-4 decoration-2">
            Masuk Sekarang
          </Link>
        </p>
      </form>
    </div>
  );
};
