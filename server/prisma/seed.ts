import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // 1. Bersihkan data lama (opsional, tergantung kebutuhan)
  await prisma.registered.deleteMany({})
  await prisma.doctorSchedule.deleteMany({})
  await prisma.doctor.deleteMany({})
  await prisma.patient.deleteMany({})
  await prisma.user.deleteMany({})

  const hashedPassword = await bcrypt.hash('password123', 10)

  // 2. Create Admin
  const admin = await prisma.user.create({
    data: {
      name: 'Super Admin',
      email: 'admin@healthcare.com',
      password: hashedPassword,
      role: 'ADMIN',
    }
  })
  console.log('Admin created')

  // 3. Create Doctors
  const doctorData = [
    {
      name: 'dr. Asep Kurniawan',
      email: 'asep@healthcare.com',
      specialization: 'Ahli Jantung',
      practice_number: 'STR/2026/001',
      description: 'Dokter spesialis jantung dengan pengalaman lebih dari 15 tahun dalam menangani kasus kardiologi kompleks.'
    },
    {
      name: 'dr. Budi Santoso',
      email: 'budi@healthcare.com',
      specialization: 'Ahli Penyakit Dalam',
      practice_number: 'STR/2026/002',
      description: 'Spesialis penyakit dalam yang fokus pada pengobatan preventif dan manajemen penyakit kronis.'
    }
  ]

  for (const doc of doctorData) {
    const user = await prisma.user.create({
      data: {
        name: doc.name,
        email: doc.email,
        password: hashedPassword,
        role: 'DOCTOR',
        doctor: {
          create: {
            specialization: doc.specialization,
            practice_number: doc.practice_number,
            description: doc.description,
          }
        }
      },
      include: {
        doctor: true
      }
    })

    console.log(`Doctor ${doc.name} created`)

    // 4. Create Schedules for each doctor (7 days ahead)
    if (user.doctor) {
      for (let i = 0; i < 7; i++) {
        const date = new Date()
        date.setDate(date.getDate() + i)
        date.setHours(0, 0, 0, 0)

        // Sesi Pagi
        await prisma.doctorSchedule.create({
          data: {
            doctor_id: user.doctor.id,
            date: date,
            start_time: new Date(1970, 0, 1, 8, 0), // 08:00
            end_time: new Date(1970, 0, 1, 12, 0),  // 12:00
            vip_quota: 5,
            general_quota: 15,
            status: 'ACTIVE',
            notes: 'Sesi Pagi'
          }
        })

        // Sesi Sore
        await prisma.doctorSchedule.create({
          data: {
            doctor_id: user.doctor.id,
            date: date,
            start_time: new Date(1970, 0, 1, 14, 0), // 14:00
            end_time: new Date(1970, 0, 1, 17, 0),  // 17:00
            vip_quota: 3,
            general_quota: 10,
            status: 'ACTIVE',
            notes: 'Sesi Sore'
          }
        })
      }
      console.log(`Schedules for ${doc.name} created`)
    }
  }

  // 5. Create a Sample Patient (for testing)
  await prisma.user.create({
    data: {
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
  console.log('Sample Patient created')

  console.log('Seeding finished successfully!')
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
