# Modern Login Page - Fullstack (Next.js & Express)

Aplikasi autentikasi modern yang dibangun dengan arsitektur terpisah (Client-Server), mengutamakan performa tinggi, validasi ketat, dan pengalaman pengguna yang mulus.

## 🚀 Teknologi Utama

### Frontend (Client)
- **Framework:** Next.js (App Router)
- **State Management:** TanStack Query v5 (React Query)
- **Form Management:** React Hook Form
- **Validation:** Zod (Schema-based validation)
- **Styling:** Tailwind CSS
- **Authentication:** Cookies-based session management
- **UI Components:** SweetAlert2 for interactive notifications

### Backend (Server)
- **Runtime:** Node.js (Express)
- **Language:** TypeScript
- **ORM:** Prisma
- **Database:** PostgreSQL/MySQL (via Prisma)
- **Security:** JWT (JSON Web Token) & Bcrypt for hashing

---

## 📂 Struktur Folder Detail

### 1. Client (`/client`)
```text
client/
├── app/                  # Next.js App Router
│   ├── (auth)/           # Route Group untuk Autentikasi
│   │   ├── login/        # Halaman Login
│   │   └── register/     # Halaman Register
│   ├── layout.tsx        # Root Layout & Provider Injection
│   ├── page.tsx          # Halaman Utama (Terproteksi)
│   └── providers.tsx     # Konfigurasi TanStack Query Provider
├── hooks/
│   └── useAuth.tsx       # Global Auth Context & Hook (Cookie-based)
├── services/
│   └── authService.ts    # Komunikasi API (Login/Register) dengan JSDoc
├── types/
│   └── auth.ts           # Definisi tipe TypeScript untuk data Auth
├── utils/
│   ├── cookies.ts        # Utilitas manajemen Cookie (get, set, erase)
│   └── validation.ts     # Skema validasi Zod (Shared across forms)
├── proxy.ts              # Middleware/Proxy untuk Auth Guard (Server-side)
└── public/               # Asset statis (SVG, Images)
```

### 2. Server (`/server`)
```text
server/
├── prisma/               # Konfigurasi Database & Schema Prisma
├── src/
│   ├── config/           # Konfigurasi koneksi (Prisma Client)
│   ├── controllers/      # Logika penanganan request API
│   ├── routes/           # Definisi endpoint API (/auth/login, etc)
│   ├── services/         # Logika bisnis & manipulasi database
│   ├── types/            # Definisi tipe TypeScript backend
│   └── validations/      # Validasi input sisi server (Zod/Joi)
└── .env                  # Environment Variables (Database URL, Secret Key)
```

---

## 🛡️ Fitur Keamanan & UX

1.  **Auth Guard (Proxy/Middleware):** Proteksi rute di sisi server. User yang belum login tidak bisa mengakses `/`, dan user yang sudah login tidak bisa kembali ke `/login`.
2.  **Uncontrolled Forms:** Menggunakan React Hook Form untuk meminimalkan re-render, membuat input terasa sangat responsif.
3.  **Server-side Validation:** Validasi ganda (Client & Server) menggunakan Zod untuk menjamin integritas data.
4.  **Cookie Persistence:** Sesi tetap tersimpan meskipun browser ditutup (24 jam expiry).
5.  **TanStack Engine:** Manajemen status loading dan error yang otomatis dan reaktif.

---

## 🛠️ Cara Menjalankan

### Backend
1. Masuk ke folder `server`.
2. Instal dependensi: `npm install`.
3. Setup `.env` dan jalankan migrasi database: `npx prisma migrate dev`.
4. Jalankan server: `npm run dev`.

### Frontend
1. Masuk ke folder `client`.
2. Instal dependensi: `npm install`.
3. Jalankan aplikasi: `npm run dev`.
4. Akses di `http://localhost:3000`.

---

## 📝 Standar Pengembangan (Berdasarkan GEMINI.md)
- **TypeScript:** Strict typing digunakan di seluruh codebase.
- **Documentation:** JSDoc wajib ditambahkan pada setiap fungsi dan hook utama.
- **Clean Code:** Pemisahan antara logika bisnis (Service/Hook) dan presentasi (UI Components).
