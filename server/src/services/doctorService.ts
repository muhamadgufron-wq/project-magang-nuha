import { addDays, getDay, startOfDay } from "date-fns";
import prisma from "../config/prisma";

/**
 * Otomatis mencetak slot jadwal harian dari Master Schedule
 * Rencana: Cek master schedule aktif, lalu buatkan slot untuk 14 hari kedepan jika belum ada.
 */
export const generateSchedulesFromMaster = async (daysAhead: number = 14) => {
  console.log(`[Generator] Mulai proses cetak slot untuk ${daysAhead} hari kedepan...`);
  
  // 1. Ambil semua Master Schedule yang aktif
  const masterSchedules = await prisma.doctorMasterSchedule.findMany({
    where: { status: 'ACTIVE' }
  });

  if (masterSchedules.length === 0) {
    console.log("[Generator] Tidak ada Master Schedule aktif ditemukan.");
    return { created: 0, skipped: 0 };
  }

  let createdCount = 0;
  let skippedCount = 0;

  // 2. Loop untuk setiap hari mulai dari hari ini sampai X hari kedepan
  const today = startOfDay(new Date());
  
  for (let i = 0; i < daysAhead; i++) {
    const targetDate = addDays(today, i);
    const dayOfWeek = getDay(targetDate); // 0 = Minggu, 1 = Senin, dst (cocok dengan DB kita)

    // Cari master schedule yang harinya cocok dengan targetDate ini
    const matchingMasters = masterSchedules.filter(m => m.day_of_week === dayOfWeek);

    for (const master of matchingMasters) {
      // 3. Cek apakah slot ini sudah pernah dibuat sebelumnya?
      // Kita cek kombinasi master_id dan date agar tidak duplikat
      const existingSchedule = await prisma.doctorSchedule.findFirst({
        where: {
          master_schedule_id: master.id,
          date: targetDate
        }
      });

      if (!existingSchedule) {
        // 4. Jika belum ada, buat slot baru (copy data dari Master)
        await prisma.doctorSchedule.create({
          data: {
            doctor_id: master.doctor_id,
            master_schedule_id: master.id,
            date: targetDate,
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

  console.log(`[Generator] Selesai! Berhasil buat ${createdCount} slot baru, ${skippedCount} slot sudah ada.`);
  return { created: createdCount, skipped: skippedCount };
};

export const getAllDoctors = async (specialization?: string, page: number = 1, limit: number = 10, date?: string) => {
  const skip = (page - 1) * limit;

  // Filter dasar untuk spesialisasi
  const where: any = specialization 
    ? { specialization: { contains: specialization, mode: 'insensitive' } } 
    : {};

  // Filter untuk jadwal: Jika tanggal diberikan, HANYA tampilkan dokter yang punya jadwal di tanggal itu
  const scheduleWhere = date 
    ? { date: new Date(date), status: 'ACTIVE' }
    : { date: { gte: new Date() }, status: 'ACTIVE' };

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
            name: true,
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
        user: {
          name: 'asc'
        }
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
  return await prisma.doctor.findUnique({
    where: { uuid },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          phone: true,
          is_vip: true,
        }
      },
      schedules: {
        where: {
          status: 'ACTIVE',
          date: {
            gte: new Date(), // Hanya ambil jadwal mendatang
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
