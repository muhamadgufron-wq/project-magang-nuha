"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from "@/modules/auth";
import Image from 'next/image';
import Swal from 'sweetalert2';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/utils/routes';

const Navbar = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const handleLogout = () => {
    Swal.fire({
      title: 'Apakah anda yakin?',
      text: "Anda akan keluar dari sesi ini!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Keluar!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        Swal.fire({
          title: 'Berhasil!',
          text: 'Anda telah keluar.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  // Menu untuk Guest (Belum Login)
  const guestLinks = [
    { label: "Beranda", href: ROUTES.LANDING },
    { label: "Temukan Dokter", href: ROUTES.DOCTORS },
  ];

  // Menu untuk User (Sudah Login) - Sesuai Desain Beranda.png
  const userLinks = [
    { label: "Temukan Dokter", href: ROUTES.HOME },
    { label: "Booking", href: ROUTES.APPOINTMENTS },
  ];

  const currentLinks = user ? userLinks : guestLinks;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href={ROUTES.LANDING} className="flex items-center gap-2">
            <Image 
              src="/Logo care hijau.png" 
              alt="Healthcare Logo" 
              width={32} 
              height={32} 
              className="object-contain"
            />
            <span className="text-xl font-bold text-emerald-800 tracking-tight">Healthcare</span>
          </Link>
        </div>
        
        {/* Dynamic Navigation Links */}
        <nav className="hidden lg:flex items-center gap-10 text-sm font-semibold">
          {currentLinks.map((link) => {
            let isActive = pathname === link.href;
            
            // Special cases for active states
            if (link.label === "Booking") {
              if (pathname === ROUTES.APPOINTMENTS) {
                isActive = true;
              }
            }
            
            if (link.label === "Temukan Dokter") {
              if (pathname === ROUTES.HOME || pathname.startsWith(ROUTES.DOCTORS)) {
                isActive = true;
              }
            }

            return (
              <Link 
                key={link.label}
                href={link.href} 
                className={`transition-colors ${isActive ? 'text-emerald-700' : 'text-gray-500 hover:text-emerald-700'}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <button 
              onClick={handleLogout}
              className="px-8 py-2.5 bg-red-600 text-white text-sm font-bold rounded-full hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          ) : (
            <>
              <Link href={ROUTES.REGISTER} className="text-sm font-bold text-emerald-700 hover:text-emerald-800 hidden sm:block px-4">
                Daftar
              </Link>
              <Link href={ROUTES.LOGIN} className="px-10 py-2.5 bg-emerald-700 text-white text-sm font-bold rounded-full hover:bg-emerald-800 transition-colors shadow-sm">
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
