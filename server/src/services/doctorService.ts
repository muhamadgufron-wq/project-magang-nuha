import prisma from "../config/prisma";

export const getAllDoctors = async (specialization?: string) => {
  return await prisma.doctor.findMany({
    where: specialization 
      ? { specialization: { contains: specialization, mode: 'insensitive' } } 
      : {},
    include: {
      user: {
        select: {
          name: true,
          email: true,
          phone: true,
        }
      },
      schedules: true,
    },
  });
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
    },
    distinct: ['specialization']
  });
  
  return doctors
    .map(d => d.specialization)
    .filter((s): s is string => s !== null);
};
