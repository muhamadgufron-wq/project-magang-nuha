import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  startOfDay 
} from "date-fns";

/**
 * Menghasilkan array tanggal untuk mengisi grid kalender pada bulan tertentu.
 * Termasuk hari padding dari bulan sebelumnya dan berikutnya untuk melengkapi minggu.
 * 
 * @param viewDate - Objek Date yang mewakili bulan yang akan dibuat
 * @returns Array berisi objek Date untuk grid kalender
 */
export const generateCalendarGrid = (viewDate: Date): Date[] => {
  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  return eachDayOfInterval({ start: startDate, end: endDate });
};

/**
 * Memeriksa apakah navigasi mundur (bulan sebelumnya) harus dinonaktifkan.
 * Mencegah pengguna menavigasi ke bulan sebelum bulan saat ini.
 * 
 * @param viewDate - Bulan yang sedang dilihat saat ini
 * @param currentDate - Tanggal referensi saat ini (default: new Date())
 * @returns boolean - True jika navigasi mundur harus dilarang
 */
export const isPrevMonthDisabled = (viewDate: Date, currentDate: Date = new Date()): boolean => {
  return isSameMonth(viewDate, currentDate) || viewDate < currentDate;
};

/**
 * Memeriksa apakah tanggal tertentu berada di masa lalu relatif terhadap hari ini.
 * 
 * @param date - Tanggal yang akan diperiksa
 * @returns boolean - True jika tanggal sudah lewat
 */
export const isDateInPast = (date: Date): boolean => {
  return startOfDay(date) < startOfDay(new Date());
};
