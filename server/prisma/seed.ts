import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding 50 doctors...')

  // Cleanup existing doctor data to avoid collisions
  console.log('Cleaning up existing doctor data...')
  await prisma.registered.deleteMany({})
  await prisma.doctorSchedule.deleteMany({})
  await prisma.doctorMasterSchedule.deleteMany({})
  await prisma.doctor.deleteMany({})
  await prisma.user.deleteMany({ where: { role: 'DOCTOR' } })

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

  // Data Generator untuk 50 Dokter
  const specializations = [
    'AHLI JANTUNG', 'PENYAKIT DALAM', 'PSIKOLOGI KLINIS', 'PEDIATRI (ANAK)', 
    'KULIT DAN KELAMIN', 'MATA', 'THT', 'SARAF', 'BEDAH UMUM', 'KANDUNGAN'
  ]
  
  const firstNames = [
    'Budi', 'Siti', 'Agus', 'Lani', 'Dedi', 'Rina', 'Iwan', 'Maya', 'Eko', 'Sari',
    'Andi', 'Dewi', 'Hendra', 'Yanti', 'Aris', 'Mira', 'Toni', 'Nina', 'Rudi', 'Ina',
    'Fajar', 'Putri', 'Gani', 'Rosa', 'Hadi', 'Lia', 'Jaka', 'Siska', 'Kiki', 'Roni',
    'Lutfi', 'Meta', 'Nico', 'Olla', 'Panji', 'Qori', 'Rama', 'Sela', 'Tio', 'Uli',
    'Vino', 'Wanda', 'Xena', 'Yuda', 'Zizi', 'Abdi', 'Bela', 'Candra', 'Dina', 'Erik'
  ]

  const lastNames = [
    'Santoso', 'Aminah', 'Kurniawan', 'Wulandari', 'Hidayat', 'Putri', 'Setiawan', 'Wuninggar', 'Prasetyo', 'Indah',
    'Saputra', 'Lestari', 'Wijaya', 'Sari', 'Nugroho', 'Utami', 'Purnama', 'Rahayu', 'Gunawan', 'Kartika',
    'Hidayat', 'Permata', 'Suryono', 'Zulfa', 'Baskoro', 'Ayu', 'Mahendra', 'Hamelia', 'Puspita', 'Jaya',
    'Hakim', 'Farida', 'Siregar', 'Mandasari', 'Wibowo', 'Aini', 'Pratama', 'Fitri', 'Kusuma', 'Aulia',
    'Sudirman', 'Mulyani', 'Simanjuntak', 'Febriani', 'Tanjung', 'Saraswati', 'Gultom', 'Handayani', 'Lubis', 'Rahman'
  ]

  const usedInitials = new Set<string>()

  for (let i = 0; i < 50; i++) {
    const firstName = firstNames[i]
    const lastName = lastNames[i]
    const fullName = `dr. ${firstName} ${lastName}, Sp.${i % 10 === 0 ? 'JP' : i % 5 === 0 ? 'PD' : 'OG'}`
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@healthcare.com`
    
    // Generate Unique 2-letter initials
    let initials = (firstName[0] + lastName[0]).toUpperCase()
    if (usedInitials.has(initials)) {
      // Jika tabrakan, coba kombinasi lain: huruf pertama depan + huruf kedua belakang
      initials = (firstName[0] + (lastName[1] || lastName[0])).toUpperCase()
    }
    if (usedInitials.has(initials)) {
      // Jika masih tabrakan, coba: huruf kedua depan + huruf pertama belakang
      initials = ((firstName[1] || firstName[0]) + lastName[0]).toUpperCase()
    }
    // Jika masih tabrakan (sangat jarang untuk 50 data), gunakan huruf random A-Z
    while (usedInitials.has(initials)) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      initials = chars[Math.floor(Math.random() * 26)] + chars[Math.floor(Math.random() * 26)]
    }
    usedInitials.add(initials)

    const spec = specializations[i % specializations.length]

    // Buat Master Schedule Variatif
    const masterSchedules = []
    const workingDays = [1, 2, 3, 4, 5, 6] // Sen - Sab
    const selectedDays = workingDays.sort(() => 0.5 - Math.random()).slice(0, 3) // Pilih 3 hari acak

    for (const day of selectedDays) {
      const startHour = 8 + Math.floor(Math.random() * 6) // Mulai antara jam 8 - 14
      masterSchedules.push({
        day_of_week: day,
        start: startHour,
        end: startHour + 4 // Durasi 4 jam
      })
    }

    const user = await prisma.user.upsert({
      where: { email: email },
      update: {
        name: fullName,
        doctor: {
          update: {
            name: fullName,
            initials: initials,
            specialization: spec
          }
        }
      },
      create: {
        name: fullName,
        email: email,
        password: hashedPassword,
        role: 'DOCTOR',
        doctor: {
          create: {
            name: fullName,
            initials: initials,
            specialization: spec,
            practice_number: `STR-${1000 + i}`,
            description: `Dokter spesialis ${spec.toLowerCase()} berpengalaman dalam melayani pasien dengan ramah dan profesional.`
          }
        }
      },
      include: { doctor: true }
    })

    if (user.doctor) {
      console.log(`Processing Doctor ${i + 1}/50: ${fullName}`)
      
      // Create Master Schedules
      for (const ms of masterSchedules) {
        const scheduleUuid = `MS-${user.doctor.id}-${ms.day_of_week}-${ms.start}`
        await prisma.doctorMasterSchedule.upsert({
          where: { uuid: scheduleUuid },
          update: {},
          create: {
            uuid: scheduleUuid,
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

      // Generate Slot untuk 14 hari ke depan
      const doctorMasterSchedules = await prisma.doctorMasterSchedule.findMany({
        where: { doctor_id: user.doctor.id }
      })

      for (let j = 0; j < 14; j++) {
        const targetDate = new Date()
        targetDate.setDate(targetDate.getDate() + j)
        targetDate.setHours(0, 0, 0, 0)
        
        const dayOfWeek = targetDate.getDay()

        const matchedMasters = doctorMasterSchedules.filter(ms => ms.day_of_week === dayOfWeek)

        for (const ms of matchedMasters) {
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
                notes: 'Auto Generated'
              }
            })
          }
        }
      }
    }
  }

  // Sample Patient
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

  console.log('Seeding 50 Doctors successfully finished!')
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
