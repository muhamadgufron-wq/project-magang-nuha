"use client";

import { useAuth } from "@/hooks/useAuth";
import Swal from "sweetalert2";

export default function Home() {
  const { user, logout } = useAuth();

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

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar Sederhana */}
      <nav className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-emerald-600 tracking-tight">LoginPage</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-900">{user?.username}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 shadow-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Konten Utama */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-emerald-50 border-opacity-50 text-center">          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Selamat Datang!</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Halo <span className="font-semibold text-emerald-600">{user?.username}</span>, kamu berhasil masuk ke sistem autentikasi kami.
          </p>

          <div className="grid grid-cols-1 gap-4">
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-left">
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">Email</p>
              <p className="text-sm text-gray-700 font-medium">{user?.email}</p>
            </div>
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-left">
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">ID Pengguna</p>
              <p className="text-sm text-gray-700 font-medium font-mono">{user?.id}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
