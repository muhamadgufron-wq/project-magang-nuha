"use client";

import React, { useState, useMemo } from "react";
import { 
  format, 
  parseISO, 
  isSameDay, 
  isValid, 
  parse, 
  addMonths, 
  subMonths, 
  isSameMonth 
} from "date-fns";
import { id as localeID } from "date-fns/locale";
import { Calendar, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { generateCalendarGrid, isPrevMonthDisabled, isDateInPast } from "@/utils/calendarHelper";

interface Schedule {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
  booked_vip: number;
  vip_quota: number;
  booked_general: number;
  general_quota: number;
}

interface BookingCalendarProps {
  schedules: Schedule[];
  onSlotSelect?: (slotId: number, date: Date) => void;
  selectedSlotId?: number | null;
  interactive?: boolean;
}

/**
 * Komponen Kalender Booking Global
 * Digunakan di Detail Dokter dan Form Booking untuk memastikan konsistensi data.
 */
export default function BookingCalendar({ 
  schedules, 
  onSlotSelect, 
  selectedSlotId: externalSelectedSlotId,
  interactive = true 
}: BookingCalendarProps) {
  const [viewDate, setViewDate] = useState(new Date());
  const [internalSelectedDate, setInternalSelectedDate] = useState<Date | null>(null);
  const [internalSelectedSlotId, setInternalSelectedSlotId] = useState<number | null>(null);

  // Gunakan state eksternal jika disediakan, jika tidak gunakan internal
  const selectedSlotId = externalSelectedSlotId !== undefined ? externalSelectedSlotId : internalSelectedSlotId;

  // Bikin grid tanggal kalender
  const calendarDays = useMemo(() => generateCalendarGrid(viewDate), [viewDate]);

  // Cek apakah di tanggal tertentu ada jadwal aktif
  const hasAvailableSchedule = (date: Date) => {
    return schedules.some((s) => isSameDay(parseISO(s.date), date) && s.status === "ACTIVE");
  };

  // Filter jam praktek untuk tanggal yang dipilih
  const availableSlots = useMemo(() => {
    if (!internalSelectedDate) return [];
    return schedules.filter((s) => isSameDay(parseISO(s.date), internalSelectedDate) && s.status === "ACTIVE");
  }, [schedules, internalSelectedDate]);

  const nextMonth = () => setViewDate(addMonths(viewDate, 1));
  const prevMonth = () => {
    if (isPrevMonthDisabled(viewDate)) return;
    setViewDate(subMonths(viewDate, 1));
  };

  const formatTimeAgnostic = (timeStr: string) => {
    if (!timeStr) return "-";
    try {
      if (timeStr.includes('T')) {
        const date = parseISO(timeStr);
        const hours = date.getUTCHours().toString().padStart(2, '0');
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
      }
      return timeStr.substring(0, 5).replace(':', '.');
    } catch {
      return "-";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Bagian Kalender */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600" />
            Pilih Tanggal
          </h3>
          <div className="flex gap-1">
            <button 
              type="button" 
              onClick={prevMonth}
              disabled={isPrevMonthDisabled(viewDate)}
              className="p-1.5 rounded-lg hover:bg-emerald-50 text-gray-400 hover:text-emerald-600 disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              type="button" 
              onClick={nextMonth}
              className="p-1.5 rounded-lg hover:bg-emerald-50 text-gray-400 hover:text-emerald-600 transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="text-center font-bold text-emerald-900 mb-6 bg-emerald-50 py-2 rounded-xl">
          {format(viewDate, 'MMMM yyyy', { locale: localeID })}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
            <div key={day} className="text-center text-[10px] font-black text-gray-400 mb-3 uppercase tracking-wider">{day}</div>
          ))}
          
          {calendarDays.map((date) => {
            const isSelected = internalSelectedDate && isSameDay(date, internalSelectedDate);
            const isAvailable = hasAvailableSchedule(date);
            const isCurrentMonth = isSameMonth(date, viewDate);
            const isPast = isDateInPast(date);
            
            return (
              <button
                key={date.toISOString()}
                type="button"
                disabled={!isCurrentMonth || isPast || !isAvailable}
                onClick={() => {
                  setInternalSelectedDate(date);
                  setInternalSelectedSlotId(null);
                }}
                className={`relative flex flex-col items-center justify-center py-3 rounded-xl transition-all border ${
                  isSelected 
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-100 z-10' 
                    : !isCurrentMonth
                      ? 'bg-transparent border-transparent text-gray-200 cursor-default opacity-0'
                      : isPast
                        ? 'bg-gray-50 border-transparent text-gray-300 cursor-not-allowed'
                        : isAvailable
                          ? 'bg-white border-emerald-100 hover:border-emerald-500 hover:bg-emerald-50 text-gray-800'
                          : 'bg-white border-transparent text-gray-300 cursor-not-allowed'
                }`}
              >
                <span className="text-xs font-bold">{format(date, 'd')}</span>
                {isAvailable && isCurrentMonth && !isPast && (
                  <div className={`w-1 h-1 rounded-full mt-1 ${isSelected ? 'bg-white' : 'bg-emerald-500'}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bagian Pilih Jam */}
      <div className="flex flex-col">
        <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-6">
          <Clock className="w-4 h-4 text-emerald-600" />
          Pilih Jam Praktek
        </h3>
        
        {internalSelectedDate ? (
          <div className="grid grid-cols-1 gap-3">
            {availableSlots.map((slot) => {
              const isSelected = selectedSlotId === slot.id;
              const isFull = slot.booked_general >= slot.general_quota && slot.booked_vip >= slot.vip_quota;

              return (
                <button
                  key={slot.id}
                  type="button"
                  disabled={isFull}
                  onClick={() => {
                    if (interactive) {
                      setInternalSelectedSlotId(slot.id);
                      onSlotSelect?.(slot.id, internalSelectedDate);
                    }
                  }}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                    isSelected 
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' 
                      : isFull
                        ? 'bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white border-gray-100 text-gray-700 hover:border-emerald-500 hover:bg-emerald-50'
                  }`}
                >
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-bold">
                      {formatTimeAgnostic(slot.start_time)} - {formatTimeAgnostic(slot.end_time)} WIB
                    </span>
                    <span className={`text-[10px] mt-1 ${isSelected ? 'text-emerald-100' : 'text-gray-400'}`}>
                      {isFull ? "Kuota Penuh" : "Tersedia"}
                    </span>
                  </div>
                  {isSelected && <div className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200 text-center px-6">
            <Calendar className="w-10 h-10 text-gray-200 mb-4" />
            <p className="text-sm font-medium text-gray-400">Silakan pilih tanggal pada kalender untuk melihat jam praktek.</p>
          </div>
        )}
      </div>
    </div>
  );
}
