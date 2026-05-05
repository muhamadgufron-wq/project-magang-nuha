"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useDoctor } from "../hooks/useDoctors";
import { Calendar, ChevronLeft } from "lucide-react";
import { format, parseISO, isValid, parse } from "date-fns";

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
                  {doctor.user.name.charAt(0)}
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{doctor.user.name}</h1>
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

        {/* Right Column: Schedule */}
        <div className="lg:col-span-2 space-y-6">
          {/* Schedule Section */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">
                <Calendar className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Jadwal Praktik</h2>
            </div>
            
            <div className="flex flex-col border border-gray-100 rounded-2xl overflow-hidden">
              {(() => {
                const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
                const dayLabels: { [key: string]: string } = {
                  "Monday": "Senin",
                  "Tuesday": "Selasa",
                  "Wednesday": "Rabu",
                  "Thursday": "Kamis",
                  "Friday": "Jumat",
                  "Saturday": "Sabtu",
                  "Sunday": "Minggu"
                };

                // Ambil jadwal unik berdasarkan hari
                const weeklySchedule: { [key: string]: any } = {};
                
                doctor.schedules?.forEach((s: any) => {
                  const dayName = format(parseISO(s.date), "EEEE");
                  if (!weeklySchedule[dayName]) {
                    weeklySchedule[dayName] = s;
                  }
                });

                return daysOrder.map((day, index) => {
                  const schedule = weeklySchedule[day];
                  const isPracticing = !!schedule;

                  // Parsing Waktu
                  const parseTime = (timeStr: string) => {
                    if (!timeStr) return null;
                    try {
                      if (timeStr.includes('T')) return parseISO(timeStr);
                      return parse(timeStr, "HH:mm:ss", new Date());
                    } catch (e) {
                      return null;
                    }
                  };

                  const startTimeObj = schedule ? parseTime(schedule.start_time) : null;
                  const endTimeObj = schedule ? parseTime(schedule.end_time) : null;
                  const timeRange = startTimeObj && endTimeObj && isValid(startTimeObj) && isValid(endTimeObj)
                    ? `${format(startTimeObj, 'HH:mm')} - ${format(endTimeObj, 'HH:mm')}`
                    : "Tidak ada jadwal";

                  return (
                    <div 
                      key={day} 
                      className={`flex items-center justify-between px-4 py-2.5 ${
                        index !== daysOrder.length - 1 ? "border-b border-gray-50" : ""
                      } ${isPracticing ? "bg-white" : "bg-gray-50/50"}`}
                    >
                      <p className={`text-sm font-medium ${isPracticing ? "text-gray-900" : "text-gray-400"}`}>
                        {dayLabels[day]}
                      </p>
                      <p className={`text-sm font-semibold ${isPracticing ? "text-gray-900" : "text-gray-400 italic font-normal"}`}>
                        {timeRange}
                      </p>
                    </div>
                  );
                });
              })()}
            </div>

            {(!doctor.schedules || doctor.schedules.length === 0) && (
              <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <p className="text-gray-500 italic">Dokter ini belum memiliki jadwal praktek yang terdaftar.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};
