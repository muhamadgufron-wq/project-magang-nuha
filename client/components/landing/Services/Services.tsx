import React from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, Video, FileText } from 'lucide-react';

/**
 * Services component untuk menampilkan daftar layanan pada Landing Page.
 */
const Services = () => {
  return (
    <section className="py-24 px-6 lg:px-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-14 gap-6">
        <div className="max-w-2xl">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">Perawatan Komprehensif di Ujung Jari Anda</h2>
          <p className="text-base text-gray-600 leading-relaxed">
            Kami menawarkan beragam layanan medis digital yang dirancang untuk mengutamakan kesehatan Anda tanpa waktu tunggu yang lama.
          </p>
        </div>
        <Link href="#" className="flex items-center gap-2 text-emerald-700 font-semibold hover:text-emerald-800 group whitespace-nowrap">
          Lihat semua service <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Main Service Card */}
        <div className="bg-white border border-gray-100 rounded-[2.5rem] p-12 shadow-sm flex flex-col h-full hover:shadow-xl hover:border-emerald-100 transition-all duration-300">
          <div className="w-16 h-16 bg-emerald-700 rounded-2xl flex items-center justify-center mb-8 shadow-md">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Instant Online Booking</h3>
          <p className="text-gray-600 leading-relaxed mb-12 flex-1 text-base">
            Skip the phone queue. Book your preferred doctor instantly with real-time availability sync. Receive immediate confirmations and reminders.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="px-5 py-2.5 bg-gray-50 text-gray-600 text-sm font-semibold rounded-full border border-gray-100">24/7 Booking</span>
            <span className="px-5 py-2.5 bg-gray-50 text-gray-600 text-sm font-semibold rounded-full border border-gray-100">Smart Reminders</span>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          {/* Secondary Service Card 1 */}
          <div className="bg-[#ECFDF5] rounded-[2.5rem] p-10 flex-1 border border-emerald-100/50 hover:shadow-lg transition-all duration-300 group">
            <div className="w-14 h-14 bg-emerald-700 rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:scale-105 transition-transform">
              <Video className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Teleconsultation</h3>
            <p className="text-gray-600 leading-relaxed text-base">
              Face-to-face consultations from the comfort of your home. Secure, private, and HD quality video.
            </p>
          </div>
          
          {/* Secondary Service Card 2 */}
          <div className="bg-[#F8FAFC] rounded-[2.5rem] p-10 flex-1 border border-slate-100 hover:shadow-lg transition-all duration-300 group">
            <div className="w-14 h-14 bg-[#1E293B] rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:scale-105 transition-transform">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Digital Health Records</h3>
            <p className="text-gray-600 leading-relaxed text-base">
              Access your medical history, prescriptions, and lab reports anywhere, anytime with encrypted security.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
