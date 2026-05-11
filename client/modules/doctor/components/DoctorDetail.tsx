"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useDoctor } from "../hooks/useDoctors";
import { Calendar, ChevronLeft, Clock, Info } from "lucide-react";
import { format, parseISO, isValid } from "date-fns";
import { id as localeID } from "date-fns/locale";

import BookingCalendar from "@/components/shared/BookingCalendar";

export const DoctorDetail: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const { data: doctor, isLoading, isError } = useDoctor(id as string);

  if (isLoading) {
    return <div className="flex justify-center items-center h-96 text-emerald-600 font-medium">Memuat detail dokter...</div>;
  }

  if (isError || !doctor) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Dokter tidak ditemukan</h2>
        <button 
          onClick={() => router.push("/doctors")}
          className="text-emerald-600 font-semibold hover:underline"
        >
          Kembali ke daftar dokter
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 mb-8 transition-colors group"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span>Kembali</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
            <div className="h-32 bg-emerald-600"></div>
            <div className="px-6 pb-8 -mt-16 text-center">
              <div className="w-32 h-32 bg-white rounded-full p-1 mx-auto mb-4 shadow-md overflow-hidden">
                <div className="w-full h-full bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-4xl font-black">
                  {doctor.name.charAt(0)}
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{doctor.name}</h1>
              <p className="text-emerald-600 font-semibold mb-6">{doctor.specialization || "Umum"}</p>

              <button 
                onClick={() => router.push(`/doctors/${doctor.uuid}/booking`)}
                className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-colors"
              >
                Buat Janji Temu
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Calendar */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Jadwal Praktek</h2>
              <p className="text-gray-500 text-sm italic">Pilih tanggal dan jam di bawah ini untuk melihat ketersediaan slot riil.</p>
            </div>
            
            <BookingCalendar 
              schedules={doctor.schedules || []} 
              onSlotSelect={(slotId) => {
                router.push(`/doctors/${doctor.uuid}/booking?slotId=${slotId}`);
              }}
            />

            <div className="mt-8 flex items-start gap-3 p-4 bg-emerald-50 rounded-2xl">
              <Info className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-emerald-900 mb-1">Informasi Jadwal</p>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  Kalender di atas menampilkan slot riil yang tersedia di database. 
                  Anda dapat langsung memilih jam praktek untuk melanjutkan ke proses pendaftaran.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
