import React from 'react';
import Link from 'next/link';
import { PlayCircle, CheckCircle, Activity } from 'lucide-react';

/**
 * Hero component untuk Landing Page.
 * Menampilkan pesan utama, CTA, dan ilustrasi futuristik.
 */
export const Hero = () => {
  return (
    <section className="px-6 py-12 lg:px-12 lg:py-24 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
      <div className="flex-1 space-y-6">
        <div className="inline-block px-4 py-1.5 bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
          SOLUSI PERAWATAN KESEHATAN TERPERCAYA
        </div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900 tracking-tight">
          Mitra tepercaya Anda dalam perawatan kesehatan digital
        </h1>
        <p className="text-base text-gray-600 leading-relaxed max-w-xl">
          Rasakan perawatan medis yang dirancang ulang dengan dokter ahli, rekam medis digital, dan dukungan telekonsultasi 24 jam sehari.
        </p>
        <div className="flex flex-wrap items-center gap-4 pt-4">
          <Link href="/doctors" className="px-7 py-3.5 bg-emerald-700 text-white font-semibold rounded-full hover:bg-emerald-800">
            Booking Jadwal
          </Link>
          <button className="flex items-center gap-2 px-7 py-3.5 border-2 border-gray-200 text-gray-700 font-semibold rounded-full hover:border-emerald-700 hover:text-emerald-700 transition-colors bg-white">
            <PlayCircle className="w-5 h-5 text-emerald-700" />
            Bagaimana cara kerjanya?
          </button>
        </div>
        
        <div className="flex items-center gap-4 pt-8">
          <div className="flex -space-x-3">
            <img src="https://ui-avatars.com/api/?name=Dr+Jane&background=10b981&color=fff&bold=true" alt="Doctor" className="w-12 h-12 rounded-full border-[3px] border-white shadow-sm" />
            <img src="https://ui-avatars.com/api/?name=Dr+John&background=3b82f6&color=fff&bold=true" alt="Doctor" className="w-12 h-12 rounded-full border-[3px] border-white shadow-sm" />
            <img src="https://ui-avatars.com/api/?name=Dr+Sarah&background=0ea5e9&color=fff&bold=true" alt="Doctor" className="w-12 h-12 rounded-full border-[3px] border-white shadow-sm" />
          </div>
          <p className="text-sm font-medium text-gray-600">
            <span className="text-emerald-700 font-bold text-base">500+</span> Dokter Spesialis
          </p>
        </div>
      </div>

      <div className="flex-1 w-full max-w-lg relative mt-10 lg:mt-0">
        <div className="w-full aspect-square bg-[#07131C] rounded-[3rem] relative overflow-hidden  flex flex-col items-center justify-center border-8 border-emerald-900/20">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-emerald-400"></div>
            <div className="absolute top-0 bottom-0 left-1/2 w-[2px] bg-emerald-400"></div>
            <svg className="absolute inset-0 w-full h-full text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" viewBox="0 0 100 100" preserveAspectRatio="none">
               <polyline fill="none" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" points="0,50 20,50 25,20 35,80 45,10 55,90 65,50 100,50" />
            </svg>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-emerald-500/30 rounded-full border-dashed"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-emerald-500/20 rounded-full"></div>
          </div>
          
          <div className="z-10 bg-emerald-500/20 p-5 rounded-full mb-4 ring-4 ring-emerald-400/40 backdrop-blur-md shadow-[0_0_30px_rgba(52,211,153,0.3)]">
            <Activity className="w-14 h-14 text-emerald-300" />
          </div>
          <h3 className="z-10 text-2xl font-black text-emerald-300 tracking-[0.2em]">HEALTHCARE</h3>
          
          <div className="absolute bottom-6 left-6 right-6 bg-white p-5 rounded-2xl flex items-center gap-4 z-20">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
              <CheckCircle className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <h4 className="text-base font-semibold text-gray-900">Spesialis Bersertifikat 100%</h4>
              <p className="text-sm text-gray-500 mt-0.5">Semua dokter telah diverifikasi oleh badan medis.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
