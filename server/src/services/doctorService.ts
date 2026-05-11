import { addDays, getDay, startOfDay } from "date-fns";
import prisma from "../config/prisma";

/**
 * Otomatis mencetak slot jadwal harian dari Master Schedule
 * Rencana: Cek master schedule aktif, lalu buatkan slot untuk 14 hari kedepan jika belum ada.
 */
export const generateSchedulesFromMaster = async (daysAhead: number = 14) => {
  console.log(`[Generator] Mulai proses cetak slot untuk ${daysAhead} hari kedepan...`);
  
  const masterSchedules = await prisma.doctorMasterSchedule.findMany({
    where: { status: 'ACTIVE' }
  });

  if (masterSchedules.length === 0) return { created: 0, skipped: 0 };

  let createdCount = 0;
  let skippedCount = 0;

  // Gunakan waktu saat ini di Jakarta sebagai basis
  const now = new Date();
  const jakartaTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Jakarta"}));
  
  for (let i = 0; i < daysAhead; i++) {
    const d = new Date(jakartaTime);
    d.setDate(d.getDate() + i);
    
    // PAKSA ke UTC Midnight (00:00:00.000Z)
    const targetDate = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0));
    const dayOfWeek = targetDate.getUTCDay(); // 0=Minggu

    const matchingMasters = masterSchedules.filter(m => m.day_of_week === dayOfWeek);

    for (const master of matchingMasters) {
      const existingSchedule = await prisma.doctorSchedule.findFirst({
        where: {
          doctor_id: master.doctor_id,
          date: targetDate
        }
      });

      if (!existingSchedule) {
        await prisma.doctorSchedule.create({
          data: {
            doctor_id: master.doctor_id,
            master_schedule_id: master.id,
            date: targetDate, // Simpan sebagai UTC Midnight
            start_time: master.start_time,
            end_time: master.end_time,
            vip_quota: master.vip_quota,
            general_quota: master.general_quota,
            status: 'ACTIVE'
          }
        });
        createdCount++;
      } else {
        skippedCount++;
      }
    }
  }
  return { created: createdCount, skipped: skippedCount };
};

export const getAllDoctors = async (specialization?: string, page: number = 1, limit: number = 10, date?: string) => {
  const skip = (page - 1) * limit;
  const where: any = specialization 
    ? { specialization: { contains: specialization, mode: 'insensitive' } } 
    : {};

  let scheduleWhere: any;
  if (date) {
    // Parsing string 'YYYY-MM-DD' langsung ke UTC Midnight
    const [year, month, day] = date.split('-').map(Number);
    const utcDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
    
    scheduleWhere = {
      date: utcDate,
      status: 'ACTIVE'
    };
  } else {
    // Default: Ambil mulai dari hari ini (UTC Midnight)
    const d = new Date();
    const utcToday = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0));
    scheduleWhere = { 
      date: { gte: utcToday }, 
      status: 'ACTIVE' 
    };
  }

  // Tambahkan filter relasi: Dokter harus punya minimal satu jadwal yang sesuai kriteria di atas
  where.schedules = {
    some: scheduleWhere
  };

  const [doctors, total] = await Promise.all([
    prisma.doctor.findMany({
      where,
      include: {
        user: {
          select: {
            email: true,
            phone: true,
          }
        },
        schedules: {
          where: scheduleWhere,
          orderBy: {
            start_time: 'asc'
          }
        },
      },
      skip,
      take: limit,
      orderBy: {
        name: 'asc'
      }
    }),
    prisma.doctor.count({ where })
  ]);

  return {
    doctors,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};

export const getDoctorByUuid = async (uuid: string) => {
  // Ambil mulai dari hari ini (UTC Midnight) untuk konsistensi dengan getAllDoctors
  const d = new Date();
  const utcToday = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0));

  return await prisma.doctor.findUnique({
    where: { uuid },
    include: {
      user: {
        select: {
          email: true,
          phone: true,
          is_vip: true,
        }
      },
      master_schedules: {
        where: { status: 'ACTIVE' },
        orderBy: { day_of_week: 'asc' }
      },
      schedules: {
        where: {
          status: 'ACTIVE',
          date: {
            gte: utcToday, // Gunakan UTC Midnight agar sinkron dengan halaman utama
          }
        },
        orderBy: {
          date: 'asc'
        }
      },
    },
  });
};

/**
 * Mendapatkan daftar unik spesialisasi yang tersedia
 */
export const getAllSpecializations = async () => {
  const doctors = await prisma.doctor.findMany({
    select: {
      specialization: true
    }
  });
  
  // Ambil semua spesialisasi, ubah ke Uppercase, dan hilangkan duplikat
  const uniqueSpecs = Array.from(new Set(
    doctors
      .map(d => d.specialization?.toUpperCase())
      .filter((s): s is string => !!s)
  ));
  
  return uniqueSpecs.sort();
};
