import prisma from "../config/prisma";

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
