import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  const hashedPassword = await bcrypt.hash('password123', 10)

  // 1. Upsert Admin
  await prisma.user.upsert({
    where: { email: 'admin@healthcare.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@healthcare.com',
      password: hashedPassword,
      role: 'ADMIN',
    }
  })
  console.log('Admin checked/created')

  // 2. Data Dokter dengan Master Schedule (Pola Mingguan)
  const doctorData = [
    {
      name: 'dr. Asep Kurniawan, Sp.JP',
      email: 'asep@healthcare.com',
      initials: 'AK',
      specialization: 'AHLI JANTUNG',
      masterSchedules: [
        { day_of_week: 1, start: 8, end: 12 }, // Senin
        { day_of_week: 3, start: 8, end: 12 }, // Rabu
        { day_of_week: 5, start: 13, end: 17 } // Jumat
      ]
    },
    {
      name: 'dr. Maya Wuninggar, Sp.JP',
      email: 'maya@healthcare.com',
      initials: 'MW',
      specialization: 'AHLI JANTUNG',
      masterSchedules: [
        { day_of_week: 2, start: 9, end: 13 }, // Selasa
        { day_of_week: 4, start: 9, end: 13 }, // Kamis
        { day_of_week: 6, start: 8, end: 11 }  // Sabtu
      ]
    },
    {
      name: 'dr. Budi Santoso, Sp.PD',
      email: 'budi@healthcare.com',
      initials: 'BS',
      specialization: 'PENYAKIT DALAM',
      masterSchedules: [
        { day_of_week: 1, start: 14, end: 18 }, // Senin
        { day_of_week: 2, start: 14, end: 18 }, // Selasa
        { day_of_week: 3, start: 14, end: 18 }  // Rabu
      ]
    },
    {
      name: 'dr. Ilham Ahmadi, Sp.PD',
      email: 'ilham@healthcare.com',
      initials: 'IA',
      specialization: 'PENYAKIT DALAM',
      masterSchedules: [
        { day_of_week: 4, start: 8, end: 12 }, // Kamis
        { day_of_week: 5, start: 8, end: 12 }, // Jumat
        { day_of_week: 6, start: 13, end: 16 } // Sabtu
      ]
    },
    {
      name: 'Siska Hamelia Putri, M.Psi',
      email: 'siska@healthcare.com',
      initials: 'SH',
      specialization: 'PSIKOLOGI KLINIS',
      masterSchedules: [
        { day_of_week: 1, start: 8, end: 15 }, // Senin
        { day_of_week: 3, start: 8, end: 15 }, // Rabu
        { day_of_week: 5, start: 8, end: 15 }  // Jumat
      ]
    }
  ]

  for (const doc of doctorData) {
    const user = await prisma.user.upsert({
      where: { email: doc.email },
      update: {
        name: doc.name,
        doctor: {
          update: {
            specialization: doc.specialization
          }
        }
      },
      create: {
        name: doc.name,
        email: doc.email,
        password: hashedPassword,
        role: 'DOCTOR',
        doctor: {
          create: {
            initials: doc.initials,
            specialization: doc.specialization,
          }
        }
      },
      include: { doctor: true }
    })

    if (user.doctor) {
      console.log(`Processing Doctor: ${doc.name}`)
      
      // 3. Create Master Schedules
      for (const ms of doc.masterSchedules) {
        await prisma.doctorMasterSchedule.upsert({
          where: {
            // Kita buat key unik buatan untuk seed: doctor_id + day_of_week + start_time
            uuid: `${user.doctor.id}-${ms.day_of_week}-${ms.start}` 
          },
          update: {},
          create: {
            uuid: `${user.doctor.id}-${ms.day_of_week}-${ms.start}`,
            doctor_id: user.doctor.id,
            day_of_week: ms.day_of_week,
            start_time: new Date(1970, 0, 1, ms.start, 0),
            end_time: new Date(1970, 0, 1, ms.end, 0),
            vip_quota: 5,
            general_quota: 15,
            status: 'ACTIVE'
          }
        })
      }

      // 4. GENERATOR: Buat DoctorSchedule (Slot Riil) untuk 30 hari ke depan
      const masterSchedules = await prisma.doctorMasterSchedule.findMany({
        where: { doctor_id: user.doctor.id }
      })

      for (let i = 0; i < 30; i++) {
        const targetDate = new Date()
        targetDate.setDate(targetDate.getDate() + i)
        targetDate.setHours(0, 0, 0, 0)
        
        const dayOfWeek = targetDate.getDay() // 0-6

        // Cari master schedule yang cocok dengan hari ini
        const matchedMasters = masterSchedules.filter(ms => ms.day_of_week === dayOfWeek)

        for (const ms of matchedMasters) {
          // Check if slot already exists for this date and time
          const existingSlot = await prisma.doctorSchedule.findFirst({
            where: {
              doctor_id: user.doctor.id,
              date: targetDate,
              start_time: ms.start_time
            }
          })

          if (!existingSlot) {
            await prisma.doctorSchedule.create({
              data: {
                doctor_id: user.doctor.id,
                date: targetDate,
                start_time: ms.start_time,
                end_time: ms.end_time,
                vip_quota: ms.vip_quota,
                general_quota: ms.general_quota,
                status: 'ACTIVE',
                notes: 'Generated from Master'
              }
            })
          }
        }
      }
    }
  }

  // 5. Upsert Sample Patient
  await prisma.user.upsert({
    where: { email: 'pasien@healthcare.com' },
    update: {},
    create: {
      name: 'Budi Pasien',
      email: 'pasien@healthcare.com',
      password: hashedPassword,
      role: 'PATIENT',
      patient: {
        create: {
          name: 'Budi Pasien',
          gender: 'LAKI_LAKI',
          identity_number: '3201234567890001',
          phone: '081234567890'
        }
      }
    }
  })

  console.log('Seeding & Schedule Generation finished successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
