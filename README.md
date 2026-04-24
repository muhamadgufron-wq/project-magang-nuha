# 🛡️ Fullstack Login System (Standard Industry)

Sistem autentikasi lengkap yang dibangun dengan arsitektur modern (Client-Server) menggunakan Next.js, Express.js, dan Prisma ORM. Proyek ini dioptimalkan untuk keamanan dan pengalaman pengguna yang responsif.

## 🚀 Teknologi yang Digunakan

### **Frontend (Client)**
*   **Framework:** Next.js 15 (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS (Modern UI)
*   **Notifications:** SweetAlert2 (Visual feedback)
*   **State Management:** React Hooks (useState, useEffect)

### **Backend (Server)**
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Language:** TypeScript
*   **Database ORM:** Prisma
*   **Database:** PostgreSQL (via Supabase/Local)
*   **Security:**
    *   **JWT (JSON Web Token):** Untuk autentikasi sesi.
    *   **Bcrypt:** Untuk hashing password sebelum disimpan ke database.
    *   **Zod:** Validasi skema input (Email & Password).

---

## 📁 Struktur Proyek

```text
login-page/
├── client/              # Frontend (Next.js)
│   ├── app/             # Routing & Pages
│   ├── components/      # UI Components
│   ├── services/        # API Call Functions
│   └── types/           # TypeScript Definitions
├── server/              # Backend (Express)
│   ├── src/
│   │   ├── controllers/ # Logic Pengendali HTTP
│   │   ├── services/    # Logic Bisnis & Database
│   │   ├── routes/      # Definisi Endpoint API
│   │   ├── validations/ # Skema Validasi Zod
│   │   └── config/      # Konfigurasi Database (Prisma)
│   └── prisma/          # Skema Database
└── README.md            # Dokumentasi Utama
```

---

## 🔐 Fitur Keamanan (Industry Standard)

1.  **Validasi Input Terpusat:** Menggunakan **Zod** di sisi server untuk memastikan hanya data valid (format email benar, password minimal 6 karakter) yang diproses.
2.  **Password Hashing:** Password pengguna tidak pernah disimpan dalam bentuk teks biasa, melainkan di-hash menggunakan algoritma **Bcrypt**.
3.  **Secure Authentication:** Menggunakan **JWT** untuk pertukaran data yang aman antara client dan server.
4.  **Error Handling:** Penanganan error yang informatif di sisi server untuk mencegah kebocoran informasi sistem.

---

## ⚙️ Cara Instalasi & Menjalankan

### **1. Clone Repositori**
```bash
git clone <url-repo-anda>
cd login-page
```

### **2. Setup Backend**
1.  Masuk ke folder server: `cd server`
2.  Instal dependensi: `npm install`
3.  Konfigurasi `.env`:
    ```env
    DATABASE_URL="postgresql://user:pass@localhost:5432/db_name"
    PORT=5000
    JWT_SECRET=rahasia_anda_disini
    ```
4.  Jalankan migrasi database: `npx prisma migrate dev`
5.  Mulai server: `npm run dev`

### **3. Setup Client**
1.  Masuk ke folder client: `cd ../client`
2.  Instal dependensi: `npm install`
3.  Mulai aplikasi: `npm run dev`
4.  Buka di browser: `http://localhost:3000`

---

## 🛠️ Pengembangan Selanjutnya (Roadmap)
- [ ] Implementasi **HttpOnly Cookies** untuk keamanan token yang lebih tinggi.
- [ ] Penambahan fitur **Register Account**.
- [ ] Pembuatan **Middleware Terproteksi** di sisi client (Next.js Middleware).
- [ ] Fitur **Lupa Password** via Email.
- [ ] Integrasi **Rate Limiting** untuk mencegah serangan Brute Force.

---

**Dibuat oleh:** [Nama Anda]
**Status Proyek:** Tahap Pengembangan (v1.0 - Validation & JWT Implemented)
