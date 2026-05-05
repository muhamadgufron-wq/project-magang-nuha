"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar/Navbar";
import Footer from "@/components/layout/Footer/Footer";
import { Calendar, Clock, ArrowRight, User } from "lucide-react";
import Link from "next/link";
import { useRegistrations } from "@/modules/appointment/hooks/useAppointments";
import { format, parseISO, isValid, parse } from "date-fns";
import { id as localeID } from "date-fns/locale";

export default function AppointmentsPage() {
  const { data: registrations, isLoading } = useRegistrations();

  const parseTime = (timeStr: string | undefined) => {
    if (!timeStr) return null;
    try {
      if (timeStr.includes('T')) return parseISO(timeStr);
      return parse(timeStr, "HH:mm:ss", new Date());
    } catch (e) {
      return null;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "BOOKED":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "REGISTERED":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "CANCELLED":
        return "bg-red-50 text-red-700 border-red-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "BOOKED": return "Menunggu";
      case "REGISTERED": return "Selesai";
      case "CANCELLED": return "Dibatalkan";
      default: return status;
    }
  };

  return (
    <main className="min-h-screen bg-gray-50/50">
      <Navbar />
      
      <div className="pt-28 pb-20 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Janji Temu Saya</h1>
              <p className="text-gray-500">Kelola pendaftaran dan lihat riwayat kunjungan medis Anda.</p>
            </div>
            {registrations && registrations.length > 0 && (
              <Link 
                href="/home"
                className="inline-flex items-center gap-2 text-emerald-600 font-bold hover:underline"
              >
                Buat Janji Baru
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64 text-emerald-600 font-medium">
              Memuat daftar janji temu...
            </div>
          ) : registrations && registrations.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {registrations.map((reg) => {
                const dateObj = reg.doctor_schedule.date ? parseISO(reg.doctor_schedule.date) : null;
                const startTimeObj = parseTime(reg.doctor_schedule.start_time);
                
                const formattedDate = dateObj && isValid(dateObj) 
                  ? format(dateObj, "EEEE, d MMMM yyyy", { locale: localeID }) 
                  : "-";
                const formattedTime = startTimeObj && isValid(startTimeObj) 
                  ? format(startTimeObj, "HH:mm") 
                  : "-";

                return (
                  <div key={reg.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
                          <User className="w-8 h-8" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-bold text-gray-900 text-lg">
                              {reg.doctor_schedule.doctor.user.name}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(reg.status)}`}>
                              {getStatusLabel(reg.status)}
                            </span>
                          </div>
                          <p className="text-emerald-600 text-sm font-semibold mb-3">
                            {reg.doctor_schedule.doctor.specialization || "Spesialis Umum"}
                          </p>
                          
                          <div className="flex flex-wrap gap-y-2 gap-x-6">
                            <div className="flex items-center gap-2 text-gray-500">
                              <Calendar className="w-4 h-4 text-emerald-600" />
                              <span className="text-sm font-medium">{formattedDate}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500">
                              <Clock className="w-4 h-4 text-emerald-600" />
                              <span className="text-sm font-medium">{formattedTime} WIB</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 border-t md:border-t-0 pt-4 md:pt-0">
                        <div className="text-left md:text-right">
                          <p className="text-[10px] text-gray-400 font-bold mb-1">Nomor Antrian</p>
                          <p className="text-xl font-black text-gray-900 tracking-tight">{reg.booking_code}</p>
                        </div>
                        {reg.status === "BOOKED" && (
                          <button className="text-xs font-bold text-red-600 hover:text-white hover:bg-red-600 px-3 py-1.5 rounded-lg border border-red-100 transition-all">
                            Batalkan
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-16 shadow-sm border border-gray-100 text-center">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-6">
                <Calendar className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Belum Ada Janji Temu</h2>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                Anda belum memiliki pendaftaran aktif maupun riwayat janji temu. Mulai konsultasi dengan mencari dokter yang tepat.
              </p>
              <Link 
                href="/home"
                className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all group"
              >
                Cari Dokter Sekarang
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
