# Healthcare Booking System - Fullstack (Next.js & Express)

Sistem manajemen layanan kesehatan modern yang memungkinkan pasien untuk menemukan dokter, melihat jadwal praktik rutin, dan melakukan pendaftaran janji temu secara online dengan mudah.

## 🚀 Fitur Utama

1.  **Sistem Booking Lengkap**: Pendaftaran janji temu dengan validasi kuota otomatis (VIP/Umum) dan pembuatan kode booking unik per hari.
2.  **Pencarian Dokter & Filter**: Menemukan dokter berdasarkan nama atau spesialisasi dengan antarmuka yang intuitif.
3.  **Jadwal Praktik Mingguan**: Visualisasi jadwal praktik rutin dokter (Senin - Minggu) yang bersih dan minimalis.
4.  **Dashboard Janji Temu**: Halaman terpusat untuk pasien mengelola pendaftaran aktif dan melihat riwayat berobat.
- **Autentikasi Berbasis Role**: Sistem login dan registrasi terintegrasi yang otomatis membuat profil Pasien atau Dokter.
6.  **Kalender Dinamis & Akurat**: Kalender booking bulanan dengan navigasi (Next/Prev) yang akurat secara real-time, sinkron dengan hari (Senin-Minggu).
7.  **Automated Slot Generator**: Sistem otomatis berbasis Cron Job yang mencetak slot harian dari template Master Schedule dokter secara rutin.

---

## 📂 Arsitektur & Struktur Folder

Proyek ini menggunakan **Modular Architecture** pada sisi client dan pola **Clean Config** pada sisi server.

### 1. Client (`/client`)
```text
client/
├── app/                  # Next.js App Router (Thin Pages)
├── modules/              # Core Logic per Fitur (Modular)
├── components/           # UI Shared (Layout: Navbar, Footer)
└── utils/                # Utilitas Utama
    ├── api-client.ts     # Smart Fetch Wrapper (Auto-Auth & Base URL)
    ├── api-endpoints.ts  # Centralized API Endpoint Map
    ├── routes.ts         # Centralized Page Route Map
    └── calendarHelper.ts # Logika perhitungan kalender dinamis
```

### 2. Server (`/server`)
```text
server/
├── prisma/               # Schema Database (Link Master to Real-time Slot)
├── src/
│   ├── config/           # Pusat Kendali (env.ts, database config)
│   ├── controllers/      # Penanganan Request
│   ├── services/         # Logika Bisnis & Slot Generator Logic
│   ├── routes/           # Endpoint API
│   └── index.ts          # Entry Point (Cron Jobs & Server Init)
```

---

## 🛠️ Teknologi Utama

- **Frontend:** Next.js 15+, TypeScript, Tailwind CSS, Lucide React.
- **State Management:** TanStack Query v5 (React Query).
- **Time Management:** Date-fns (Complex calendar & date calculation).
- **Backend:** Node.js (Express), TypeScript, Prisma ORM.
- **Automation:** Node-cron (Daily background tasks).
- **Config:** Dotenv (Environment management).
- **Database:** PostgreSQL.

---

## 🏗️ Standar Pengembangan Pro (Terbaru)

Proyek ini telah ditingkatkan ke standar industri dengan beberapa pola berikut:

1.  **Centralized Route & API Management**: Tidak ada lagi *hardcoded strings* untuk alamat URL. Semua diatur di satu peta pusat untuk kemudahan pemeliharaan.
2.  **Smart API Client**: Pembungkus `fetch` otomatis menangani injeksi token Bearer, manajemen header, dan format respon seragam.
3.  **Idempotent Slot Generator**: Skrip otomatisasi jadwal yang cerdas; menjamin ketersediaan slot 14 hari kedepan tanpa risiko duplikasi data.
4.  **Environment-Driven Config**: Semua parameter sensitif (Port, URL) dikelola lewat variabel lingkungan (`.env`) dan divalidasi saat startup.
5.  **Per-Slot Queueing**: Nomor antrean pasien sekarang bersifat independen untuk setiap dokter dan sesi praktik, menjamin keadilan urutan pelayanan.

---

## ⚙️ Cara Instalasi

### 1. Persiapan Database
- Masuk ke folder `server`, buat file `.env` dan isi `DATABASE_URL`.
- Jalankan: `npx prisma migrate dev` dan `npm run seed`.

### 2. Menjalankan Aplikasi
- **Server**: `cd server && npm install && npm run dev`.
- **Client**: `cd client && npm install && npm run dev`.
- Akses aplikasi di `http://localhost:3000`.
