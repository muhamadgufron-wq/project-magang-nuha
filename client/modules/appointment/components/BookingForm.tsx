"use client";

import { useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDoctor } from "../../doctor/hooks/useDoctors";
import { useCreateRegistration } from "../hooks/useAppointments";
import { useRouter } from "next/navigation";
import { format, parseISO, isSameDay, isValid, parse, addMonths, subMonths, isSameMonth } from "date-fns";
import { id as localeID } from "date-fns/locale";
import { Calendar, ChevronLeft, ChevronRight, User, ShieldPlus, Activity } from "lucide-react";
import Swal from "sweetalert2";
import { MONTHS, GENDER_OPTIONS, INSURANCE_OPTIONS } from "@/utils/constants";
import { generateCalendarGrid, isPrevMonthDisabled, isDateInPast } from "@/utils/calendarHelper";

// Validasi Form
const bookingSchema = z.object({
  patientName: z.string().min(3, "Nama lengkap wajib diisi"),
  gender: z.string().min(1, "Pilih jenis kelamin"),
  phone: z.string().min(12, "Nomor telepon tidak valid"),
  birthDate: z.string().min(1, "Tanggal lahir wajib diisi"),
  nik: z.string().length(16, "NIK harus 16 digit"),
  insuranceType: z.string().min(1, "Pilih jenis asuransi"),
  complaint: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

/**
 * Komponen Form Booking Dokter
 * Di sini pasien bisa isi data diri, pilih tanggal, dan jam konsultasi.
 */
export default function BookingForm({ doctorId }: { doctorId: string }) {
  const router = useRouter();
  const { data: doctor, isLoading } = useDoctor(doctorId);
  const createRegistration = useCreateRegistration();

  // Setup form pakai React Hook Form + Zod buat validasi
  const { control, handleSubmit, watch, formState: { errors } } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      patientName: "",
      gender: "",
      phone: "",
      birthDate: "",
      nik: "",
      insuranceType: "",
      complaint: "",
    },
  });

  const patientName = watch("patientName");
  const insuranceType = watch("insuranceType");

  // State buat simpan pilihan user & navigasi kalender
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [viewDate, setViewDate] = useState(new Date());

  // Bikin grid tanggal kalender berdasarkan bulan yang lagi dilihat
  const calendarDays = useMemo(() => generateCalendarGrid(viewDate), [viewDate]);

  // Cek apakah di tanggal tertentu si dokter ada jadwal aktif
  const hasAvailableSchedule = (date: Date) => {
    if (!doctor?.schedules) return false;
    return doctor.schedules.some((s) => isSameDay(parseISO(s.date), date) && s.status === "ACTIVE");
  };

  // Filter jam praktek yang tersedia buat tanggal yang dipilih user
  const availableSlotsForSelectedDate = useMemo(() => {
    if (!doctor?.schedules || !selectedDate) return [];
    return doctor.schedules.filter((s) => isSameDay(parseISO(s.date), selectedDate) && s.status === "ACTIVE");
  }, [doctor?.schedules, selectedDate]);

  // Fungsi buat geser bulan di kalender
  const nextMonth = () => setViewDate(addMonths(viewDate, 1));
  const prevMonth = () => {
    if (isPrevMonthDisabled(viewDate)) return;
    setViewDate(subMonths(viewDate, 1));
  };

  // Status tombol 'Kemarin' di kalender (biar gak bisa liat masa lalu)
  const isPrevBtnDisabled = useMemo(() => isPrevMonthDisabled(viewDate), [viewDate]);

  // Fungsi pas form disubmit
  const onSubmit = (data: BookingFormData) => {
    if (!selectedSlotId) {
      Swal.fire({
        title: "Pilih Jadwal",
        text: "Silakan pilih tanggal dan jam terlebih dahulu",
        icon: "warning",
        confirmButtonColor: "#10b981",
      });
      return;
    }

    Swal.fire({
      title: "Konfirmasi Booking",
      text: `Apakah Anda yakin ingin membuat janji temu dengan ${doctor?.user?.name}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Ya, Booking!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        createRegistration.mutate(
          {
            slotId: selectedSlotId,
            patientType: data.insuranceType === "UMUM" ? "GENERAL" : "VIP",
          },
          {
            onSuccess: () => {
              router.push("/home");
            },
          }
        );
      }
    });
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64 text-emerald-600">Memuat data...</div>;
  }

  if (!doctor) {
    return <div className="text-center py-10">Dokter tidak ditemukan.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Dokter</h1>
        <p className="text-gray-600">Ikuti langkah-langkah di bawah ini untuk menjadwalkan konsultasi dengan spesialis kami.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Kolom Kiri: Formulir */}
        <div className="flex-1">
          <form id="booking-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Step 1: Informasi Pasien */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">1</div>
                <h2 className="text-xl font-bold text-gray-800">Informasi Pasien</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                  <Controller
                    name="patientName"
                    control={control}
                    render={({ field }) => (
                      <input {...field} type="text" placeholder="Masukan nama anda" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
                    )}
                  />
                  {errors.patientName && <p className="text-red-500 text-xs mt-1">{errors.patientName.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Kelamin</label>
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <select {...field} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white">
                        <option hidden aria-readonly="true">Pilih Jenis Kelamin</option>
                        {GENDER_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    )}
                  />
                  {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Telepon</label>
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <input {...field} type="tel" placeholder="085773868152" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
                    )}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Lahir</label>
                  <Controller
                    name="birthDate"
                    control={control}
                    render={({ field }) => (
                      <input {...field} type="date" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
                    )}
                  />
                  {errors.birthDate && <p className="text-red-500 text-xs mt-1">{errors.birthDate.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">NIK (Nomor Induk Kependudukan)</label>
                  <Controller
                    name="nik"
                    control={control}
                    render={({ field }) => (
                      <input {...field} type="text" maxLength={16} placeholder="Masukan 16 digit NIK" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
                    )}
                  />
                  {errors.nik && <p className="text-red-500 text-xs mt-1">{errors.nik.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Asuransi</label>
                  <Controller
                    name="insuranceType"
                    control={control}
                    render={({ field }) => (
                      <select {...field} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white">
                        <option  hidden aria-readonly="true">Pilih Jenis Asuransi</option>
                        {INSURANCE_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    )}
                  />
                  {errors.insuranceType && <p className="text-red-500 text-xs mt-1">{errors.insuranceType.message}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Keluhan</label>
                  <Controller
                    name="complaint"
                    control={control}
                    render={({ field }) => (
                      <textarea {...field} rows={3} placeholder="Sebutkan keluhan-keluhan anda" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none"></textarea>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Jadwal Dokter */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">2</div>
                <h2 className="text-xl font-bold text-gray-800">Jadwal Dokter</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Kalender */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-800">Pilih Tanggal</h3>
                    <div className="flex gap-2">
                      <button 
                        type="button" 
                        onClick={prevMonth}
                        disabled={isPrevBtnDisabled}
                        className={`p-1 rounded transition-colors ${
                          isPrevBtnDisabled 
                            ? 'bg-gray-50 text-gray-200 cursor-not-allowed' 
                            : 'bg-gray-50 text-gray-500 hover:bg-emerald-100 hover:text-emerald-600'
                        }`}
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button 
                        type="button" 
                        onClick={nextMonth}
                        className="p-1 rounded bg-gray-50 text-gray-500 hover:bg-emerald-100 hover:text-emerald-600 transition-colors"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-white border border-gray-100 rounded-xl p-4">
                    <div className="text-center font-bold text-emerald-800 mb-6 flex items-center justify-center gap-2">
                      {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
                    </div>
                    
                    <div className="grid grid-cols-7 gap-2">
                      {/* Hari header */}
                      {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
                        <div key={day} className="text-center text-[10px] font-medium text-gray-400 mb-2">{day}</div>
                      ))}
                      
                      {/* Date tiles */}
                      {calendarDays.map((date) => {
                        const isSelected = selectedDate && isSameDay(date, selectedDate);
                        const isAvailable = hasAvailableSchedule(date);
                        const isCurrentMonth = isSameMonth(date, viewDate);
                        const isPast = isDateInPast(date);
                        
                        return (
                          <button
                            key={date.toISOString()}
                            type="button"
                            disabled={!isCurrentMonth || isPast}
                            onClick={() => {
                              setSelectedDate(date);
                              setSelectedSlotId(null);
                            }}
                            className={`relative flex flex-col items-center justify-center py-2.5 rounded-lg transition-all border ${
                              isSelected 
                                ? 'bg-emerald-600 border-emerald-600 text-white z-10' 
                                : !isCurrentMonth
                                  ? 'bg-gray-50/50 border-transparent text-gray-200 cursor-default opacity-0'
                                  : isPast
                                    ? 'bg-gray-50 border-transparent text-gray-300 cursor-not-allowed'
                                    : 'bg-white border-transparent hover:border-emerald-200 hover:bg-emerald-50 text-gray-700'
                            }`}
                          >
                            <span className="text-xs font-bold">{format(date, 'd')}</span>
                            
                            {/* Titik ketersediaan */}
                            {isCurrentMonth && !isPast && (
                              <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${
                                isAvailable ? (isSelected ? 'bg-white' : 'bg-emerald-500') : 'bg-gray-300'
                              }`} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                    
                    {/* Legend */}
                    <div className="mt-6 flex items-center justify-center gap-6 border-t border-gray-50 pt-4">
                       <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="text-[10px] font-medium text-gray-500">Tersedia</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-gray-300" />
                          <span className="text-[10px] font-medium text-gray-500">Tidak Ada</span>
                       </div>
                    </div>
                  </div>
                </div>

                {/* Pilih Jam */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-4">Pilih Jam</h3>
                  
                  {selectedDate ? (
                    availableSlotsForSelectedDate.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3">
                        {availableSlotsForSelectedDate.map((slot) => {
                          const isSelected = selectedSlotId === slot.id;
                          const parseTime = (timeStr: string | undefined) => {
                            if (!timeStr) return null;
                            try {
                              if (timeStr.includes('T')) return parseISO(timeStr);
                              return parse(timeStr, "HH:mm:ss", new Date());
                            } catch (e) {
                              return null;
                            }
                          };
                          const startTimeObj = parseTime(slot.start_time);
                          const formattedStartTime = startTimeObj && isValid(startTimeObj) ? format(startTimeObj, 'HH.mm') : "-";
                          const isFull = slot.booked_general >= slot.general_quota && slot.booked_vip >= slot.vip_quota;

                          return (
                            <button
                              key={slot.id}
                              type="button"
                              disabled={isFull}
                              onClick={() => setSelectedSlotId(slot.id)}
                              className={`py-3 px-4 rounded-lg text-sm font-medium transition-all text-center border
                                ${isSelected 
                                  ? 'bg-emerald-600 border-emerald-600 text-white z-10' 
                                  : isFull
                                    ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed line-through'
                                    : 'bg-white border-emerald-100 text-emerald-700 hover:bg-emerald-100'
                                }
                              `}
                            >
                              {formattedStartTime} WIB
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-center px-4">
                        <p className="text-sm font-medium text-gray-400">Tidak ada jadwal praktek tersedia pada tanggal ini.</p>
                      </div>
                    )
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-center px-4">
                      <Calendar className="w-10 h-10 text-gray-300 mb-3" />
                      <p className="text-sm font-medium text-gray-400">Silakan pilih tanggal terlebih dahulu dari kalender.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </form>
        </div>

        {/* Kolom Kanan: Detail Booking (Sticky) */}
        <div className="w-full lg:w-[400px]">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Detail Booking</h2>
            
            {/* Dokter Info */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-6 border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                <div className="w-full h-full bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-xl font-black">
                  {doctor.user.name.charAt(4)}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{doctor.user.name}</h3>
                <p className="text-xs text-emerald-600 font-bold">Spesialis {doctor.specialization || "Umum"}</p>
              </div>
            </div>

            {/* Detail Info */}
            <div className="space-y-5 mb-8">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0 text-emerald-600">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-[12px] text-gray-400 font-medium mb-1">Pasien</p>
                  <p className="text-gray-900 font-medium text-sm">{patientName || <span className="text-gray-300 italic">Belum diisi</span>}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0 text-emerald-600">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-[12px] text-gray-400 font-medium mb-1">Jadwal Konsultasi</p>
                  <p className="text-gray-900 font-medium text-sm">
                    {selectedDate ? format(selectedDate, 'EEEE, d MMMM yyyy', { locale: localeID }) : <span className="text-gray-300 italic">Pilih tanggal</span>}
                  </p>
                  {selectedSlotId && (() => {
                    const selectedSlot = doctor.schedules.find(s => s.id === selectedSlotId);
                    const timeStr = selectedSlot?.start_time;
                    let timeObj = null;
                    if (timeStr) {
                      if (timeStr.includes('T')) timeObj = parseISO(timeStr);
                      else timeObj = parse(timeStr, "HH:mm:ss", new Date());
                    }
                    return (
                      <p className="text-sm font-medium mt-1">
                        Pukul {timeObj && isValid(timeObj) ? format(timeObj, 'HH:mm') : "-"} WIB
                      </p>
                    );
                  })()}
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0 text-emerald-600">
                  <ShieldPlus size={20} />
                </div>
                <div>
                  <p className="text-[12px] text-gray-400 font-medium mb-1">Jenis Layanan</p>
                  <p className="text-gray-900 font-medium text-sm">{insuranceType || <span className="text-gray-300 italic">Pilih asuransi</span>}</p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              form="booking-form"
              disabled={createRegistration.isPending}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-200 text-white font-medium py-4 rounded-2xl transition-all flex items-center justify-center gap-2 group"
            >
              {createRegistration.isPending ? "Memproses Data..." : "Konfirmasi Booking"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
