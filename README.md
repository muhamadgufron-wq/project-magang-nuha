# Healthcare Booking System - Fullstack (Next.js & Express)

Sistem manajemen layanan kesehatan modern yang memungkinkan pasien untuk menemukan dokter, melihat jadwal praktik rutin, dan melakukan pendaftaran janji temu secara online dengan mudah.

## 🚀 Fitur Utama

1.  **Sistem Booking Lengkap**: Pendaftaran janji temu dengan validasi kuota otomatis (VIP/Umum) dan pembuatan kode booking unik per hari.
2.  **Pencarian Dokter & Filter**: Menemukan dokter berdasarkan nama atau spesialisasi dengan antarmuka yang intuitif.
3.  **Jadwal Praktik Mingguan**: Visualisasi jadwal praktik rutin dokter (Senin - Minggu) yang bersih dan minimalis.
4.  **Dashboard Janji Temu**: Halaman terpusat untuk pasien mengelola pendaftaran aktif dan melihat riwayat berobat.
5.  **Autentikasi Berbasis Role**: Sistem login dan registrasi terintegrasi yang otomatis membuat profil Pasien atau Dokter.

---

## 📂 Arsitektur & Struktur Folder

Proyek ini menggunakan **Modular Architecture** pada sisi client untuk pemisahan kekhawatiran (*Separation of Concerns*) yang lebih baik.

### 1. Client (`/client`)
```text
client/
├── app/                  # Next.js App Router (Thin Pages)
│   ├── doctors/          # Fitur Pencarian & Detail Dokter
│   ├── appointments/     # Manajemen Janji Temu Pasien
│   └── (auth)/           # Autentikasi (Login/Register)
├── modules/              # Core Logic per Fitur (Modular)
│   ├── doctor/           # Hooks, Services, Types, Components (Doctor)
│   ├── appointment/      # Hooks, Services, Types, Components (Booking)
│   ├── auth/             # Manajemen Sesi & User
│   └── landing/          # Komponen Statis Landing Page (Modularized)
├── components/           # UI Shared (Layout: Navbar, Footer)
└── utils/                # Utilitas (Cookies, Validation, Date-fns helpers)
```

### 2. Server (`/server`)
```text
server/
├── prisma/               # Schema Database (Sync with latest ERD)
├── src/
│   ├── controllers/      # Penanganan Request (Auth, Doctor, Appointment)
│   ├── services/         # Logika Bisnis & DB Transaction (Queue Logic)
│   ├── routes/           # Endpoint API terproteksi JWT
│   └── validations/      # Skema validasi input (Zod)
```

---

## 🛠️ Teknologi Utama

- **Frontend:** Next.js 15+, TypeScript, Tailwind CSS, Lucide React.
- **State Management:** TanStack Query v5 (React Query).
- **Time Management:** Date-fns (Safe parsing & weekly formatting).
- **Backend:** Node.js (Express), TypeScript, Prisma ORM.
- **Database:** PostgreSQL (Mendukung transaksi untuk validasi kuota).

---

## 🛡️ Keamanan & Validasi

- **JWT Authentication**: Penggunaan Token untuk akses API terproteksi.
- **Strict Typing**: Implementasi TypeScript di seluruh proyek untuk keamanan tipe data.
- **Double Validation**: Validasi skema (Zod) dilakukan di sisi Client (Form) dan Server (API).
- **Database Transactions**: Menjamin integritas data pendaftaran saat terjadi akses konkuren pada kuota dokter.

---

## ⚙️ Cara Instalasi

### 1. Persiapan Database
- Masuk ke folder `server`, buat file `.env` dan isi `DATABASE_URL`.
- Jalankan: `npx prisma migrate dev` dan `npm run seed`.

### 2. Menjalankan Aplikasi
- **Server**: `cd server && npm install && npm run dev`.
- **Client**: `cd client && npm install && npm run dev`.
- Akses aplikasi di `http://localhost:3000`.
