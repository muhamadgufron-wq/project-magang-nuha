"use client";

import { useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDoctor } from "../../doctor/hooks/useDoctors";
import { useCreateRegistration } from "../hooks/useAppointments";
import { useRouter } from "next/navigation";
import { format, parseISO, isSameDay, isValid, parse } from "date-fns";
import { id as localeID } from "date-fns/locale";
import { Calendar, ChevronLeft, ChevronRight, User, ShieldPlus} from "lucide-react";
import Swal from "sweetalert2";

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

export default function BookingForm({ doctorId }: { doctorId: string }) {
  const router = useRouter();
  const { data: doctor, isLoading } = useDoctor(doctorId);
  const createRegistration = useCreateRegistration();

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

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);

  // Group schedules by date
  const availableDates = useMemo(() => {
    if (!doctor?.schedules) return [];
    const dates = doctor.schedules.map((s) => parseISO(s.date));
    return dates.filter(
      (date, i, self) =>
        self.findIndex((d) => isSameDay(d, date)) === i
    ).sort((a, b) => a.getTime() - b.getTime());
  }, [doctor?.schedules]);

  const availableSlotsForSelectedDate = useMemo(() => {
    if (!doctor?.schedules || !selectedDate) return [];
    return doctor.schedules.filter((s) => isSameDay(parseISO(s.date), selectedDate));
  }, [doctor?.schedules, selectedDate]);

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
                      <input {...field} type="text" placeholder="Masukan nama anda" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
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
                      <select {...field} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white">
                        <option hidden aria-readonly="true">Pilih Jenis Kelamin</option>
                        <option value="LAKI_LAKI">Laki-laki</option>
                        <option value="PEREMPUAN">Perempuan</option>
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
                      <input {...field} type="tel" placeholder="085773868152" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
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
                      <input {...field} type="date" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
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
                      <input {...field} type="text" maxLength={16} placeholder="Masukan 16 digit NIK" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
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
                      <select {...field} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white">
                        <option  hidden aria-readonly="true">Pilih Jenis Asuransi</option>
                        <option value="UMUM">Umum / Pribadi</option>
                        <option value="BPJS">BPJS Kesehatan</option>
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
                      <textarea {...field} rows={3} placeholder="Sebutkan keluhan-keluhan anda" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none"></textarea>
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
                    <h3 className="font-semibold text-gray-800">Pilih Tanggal</h3>
                    <div className="flex gap-2">
                      <button type="button" className="p-1 rounded bg-gray-50 text-gray-500 hover:bg-gray-100"><ChevronLeft size={20} /></button>
                      <button type="button" className="p-1 rounded bg-gray-50 text-gray-500 hover:bg-gray-100"><ChevronRight size={20} /></button>
                    </div>
                  </div>
                  
                  <div className="bg-white border border-gray-100 rounded-xl p-4">
                    <div className="text-center font-medium text-sm text-gray-600 mb-4">
                      {availableDates.length > 0 ? format(availableDates[0], 'MMMM yyyy', { locale: localeID }) : 'Bulan'}
                    </div>
                    {availableDates.length > 0 ? (
                      <div className="grid grid-cols-5 gap-2">
                        {availableDates.slice(0, 15).map((date) => {
                          const isSelected = selectedDate && isSameDay(date, selectedDate);
                          return (
                            <button
                              key={date.toISOString()}
                              type="button"
                              onClick={() => {
                                setSelectedDate(date);
                                setSelectedSlotId(null);
                              }}
                              className={`py-2 rounded-lg text-sm font-medium transition-all ${
                                isSelected 
                                  ? 'bg-emerald-600 text-white shadow-md' 
                                  : 'hover:bg-emerald-50 text-gray-700'
                              }`}
                            >
                              <div className="text-xs opacity-70 mb-1">{format(date, 'EEE', { locale: localeID })}</div>
                              {format(date, 'd')}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-4">Tidak ada jadwal tersedia.</p>
                    )}
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
                          // Simple check for full
                          const isFull = slot.booked_general >= slot.general_quota && slot.booked_vip >= slot.vip_quota;

                          return (
                            <button
                              key={slot.id}
                              type="button"
                              disabled={isFull}
                              onClick={() => setSelectedSlotId(slot.id)}
                              className={`py-3 px-4 rounded-xl text-sm font-medium transition-all text-center border
                                ${isSelected 
                                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' 
                                  : isFull
                                    ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed line-through'
                                    : 'bg-white border-emerald-100 text-emerald-700 hover:bg-emerald-50'
                                }
                              `}
                            >
                              {formattedStartTime} WIB
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 py-4 bg-gray-50 rounded-xl text-center">Tidak ada jam praktek pada tanggal ini.</p>
                    )
                  ) : (
                    <p className="text-sm text-gray-500 py-8 bg-gray-50 rounded-xl text-center border border-dashed border-gray-200">
                      Silakan pilih tanggal terlebih dahulu
                    </p>
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
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-6">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                <div className="w-full h-full bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-xl font-black">
                  {doctor.user.name.charAt(0)}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{doctor.user.name}</h3>
                <p className="text-xs text-emerald-600 font-medium">Spesialis {doctor.specialization || "Umum"}</p>
              </div>
            </div>

            {/* Detail Info */}
            <div className="space-y-5 mb-8">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 text-emerald-600">
                  <User size={16} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Pasien</p>
                  <p className="text-gray-900 font-semibold ">{patientName || <span className="text-gray-400">Nama Pasien</span>}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 text-emerald-600">
                  <Calendar size={16} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Tanggal & Waktu</p>
                  <p className="text-gray-900 font-semibold">
                    {selectedDate ? format(selectedDate, 'EEEE, d MMMM yyyy', { locale: localeID }) : <span className="text-gray-400">Pilih tanggal</span>}
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
                      <p className="text-sm text-gray-600 mt-1">
                        {timeObj && isValid(timeObj) ? format(timeObj, 'HH:mm') : "-"} WIB
                      </p>
                    );
                  })()}
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0 text-emerald-600">
                  <ShieldPlus size={16} />
                </div>
                <div><p className="text-xs text-gray-500 font-medium mb-1">Asuransi</p>
                  <p className="text-xs text-gray-500">{insuranceType || '-'}</p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              form="booking-form"
              disabled={createRegistration.isPending}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 group"
            >
              {createRegistration.isPending ? "Memproses..." : "Booking"}
              {!createRegistration.isPending && <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
