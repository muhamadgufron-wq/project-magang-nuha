import prisma from "../config/prisma";
import { v4 as uuidv4 } from 'uuid';

export const createRegistration = async (data: {
  userId: number;
  slotId: number;
  patientType: 'VIP' | 'GENERAL';
  schedule?: string;
}) => {
  // 1. Dapatkan Patient ID dari User ID
  const patient = await prisma.patient.findUnique({
    where: { user_id: data.userId },
  });

  if (!patient) {
    throw new Error("Profil pasien tidak ditemukan");
  }

  // 2. Jalankan Transaksi untuk validasi kuota dan pembuatan booking
  return await prisma.$transaction(async (tx) => {
    // Ambil data jadwal terbaru dengan locking
    const schedule = await tx.doctorSchedule.findUnique({
      where: { id: data.slotId },
      include: {
        doctor: {
          include: {
            user: {
              select: { name: true }
            }
          }
        }
      }
    });

    if (!schedule || schedule.status !== 'ACTIVE') {
      throw new Error("Jadwal tidak ditemukan atau sudah tidak aktif");
    }

    // Validasi kuota berdasarkan tipe pasien
    if (data.patientType === 'VIP') {
      if (schedule.booked_vip >= schedule.vip_quota) {
        throw new Error("Kuota VIP untuk jadwal ini sudah penuh");
      }
    } else {
      if (schedule.booked_general >= schedule.general_quota) {
        throw new Error("Kuota Umum untuk jadwal ini sudah penuh");
      }
    }

    // Ambil inisial nama dokter dari master data (tabel Doctor)
    const initials = schedule.doctor.initials;

    // Hitung nomor antrean berdasarkan slot jadwal dokter tersebut saja
    const slotQueueCount = await tx.registered.count({
      where: {
        slot_id: data.slotId
      }
    });
    
    const currentQueue = slotQueueCount + 1;
    const bookingCode = `${initials}-${currentQueue}`;

    // 3. Buat entitas Registered
    const registration = await tx.registered.create({
      data: {
        patient_id: patient.id,
        slot_id: data.slotId,
        booking_code: bookingCode,
        patient_type: data.patientType,
        schedule: schedule.date, // Sesuai ERD, bisa disesuaikan jika ingin jam spesifik
        status: 'BOOKED',
      },
      include: {
        doctor_schedule: {
          include: {
            doctor: {
              include: {
                user: {
                  select: { name: true }
                }
              }
            }
          }
        }
      }
    });

    // 4. Update jumlah yang sudah di-book pada tabel jadwal
    await tx.doctorSchedule.update({
      where: { id: data.slotId },
      data: {
        booked_vip: data.patientType === 'VIP' ? { increment: 1 } : undefined,
        booked_general: data.patientType === 'GENERAL' ? { increment: 1 } : undefined,
      }
    });

    return registration;
  });
};

export const getRegistrationsByUserId = async (userId: number) => {
  const patient = await prisma.patient.findUnique({
    where: { user_id: userId },
  });

  if (!patient) return [];

  return await prisma.registered.findMany({
    where: { patient_id: patient.id },
    include: {
      doctor_schedule: {
        include: {
          doctor: {
            include: {
              user: {
                select: { name: true }
              }
            }
          }
        }
      }
    },
    orderBy: {
      created_at: "desc",
    },
  });
};

export const getRegistrationById = async (id: number) => {
  return await prisma.registered.findUnique({
    where: { id },
    include: {
      doctor_schedule: {
        include: {
          doctor: {
            include: {
              user: {
                select: { name: true }
              }
            }
          }
        }
      },
      patient: true,
    },
  });
};

export const updateRegistrationStatus = async (id: number, status: string) => {
  return await prisma.registered.update({
    where: { id },
    data: { status },
  });
};
