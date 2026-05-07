import React from 'react';
import Image from 'next/image';

/**
 * Layout khusus untuk halaman autentikasi (Login & Register).
 * Membagi layar menjadi dua: Sisi kiri (Brand) dan Sisi kanan (Form).
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white overflow-hidden font-sans">
      
      {/* SISI KIRI: Brand Section (Tetap/Statis) */}
      <div className="hidden lg:flex lg:w-1/2 bg-emerald-700   items-center justify-center p-12 relative overflow-hidden">
        {/* Dekorasi halus di background */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-600 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-30" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-800 rounded-full translate-x-1/3 translate-y-1/3 opacity-20" />
        
        <div className="relative z-10 text-center space-y-6">
          <h1 className="text-5xl font-black text-white tracking-tight">Healthcare.</h1>
          <p className="text-emerald-50 text-lg font-light max-w-md mx-auto leading-relaxed">
            Solusi kesehatan digital terpercaya untuk masa depan Anda yang lebih baik.
          </p>
        </div>
      </div>

      {/* SISI KANAN: Form Section (Dinamis berubah sesuai page) */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-20 bg-white">
        <div className="w-full max-w-md">
           {/* Logo khusus tampilan Mobile (karena sisi kiri di-hide) */}
           <div className="lg:hidden flex flex-col items-center mb-12">
              <Image src="/Logo care hijau.png" alt="Logo" width={60} height={60} />
              <h2 className="text-2xl font-black text-emerald-800 mt-2">Healthcare</h2>
           </div>
           
           {children}
        </div>
      </div>

    </div>
  );
}
