"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from "@/modules/auth";
import { NAV_LINKS } from './utils/constants';

import Image from 'next/image';

/**
 * Komponen Navbar untuk navigasi utama aplikasi.
 * Mendeteksi status login user untuk menampilkan tombol yang sesuai.
 */
const Navbar = () => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto flex items-center justify-between py-5">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/Logo care hijau.png" 
              alt="Healthcare Logo" 
              width={32} 
              height={32} 
              className="object-contain"
            />
            <span className="text-xl font-bold text-emerald-700 tracking-tight">Healthcare</span>
          </Link>
        </div>
        
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-600">
          {NAV_LINKS.map((link) => (
            <Link 
              key={link.label}
              href={link.href} 
              className={`${link.isActive ? 'text-emerald-700 border-b-2 border-emerald-700 pb-1' : 'hover:text-emerald-700 transition-colors'}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <Link href="/home" className="px-6 py-2.5 bg-emerald-700 text-white text-sm font-bold rounded-full hover:bg-emerald-800 transition-colors shadow-sm">
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/register" className="text-sm font-bold text-emerald-700 hover:text-emerald-800 hidden sm:block px-4">
                Daftar
              </Link>
              <Link href="/login" className="px-6 py-2.5 bg-emerald-700 text-white text-sm font-bold rounded-full hover:bg-emerald-800 transition-colors shadow-sm">
                Masuk
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
