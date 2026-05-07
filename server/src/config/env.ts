import dotenv from "dotenv";
import path from "path";

// Load environment variables dari file .env
dotenv.config({ path: path.join(__dirname, "../../.env") });

/**
 * Konfigurasi Pusat Aplikasi
 * Semua variabel environment dikumpulkan di sini biar gampang dikelola.
 */
export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  // Kamu bisa nambahin config lain di sini nanti, misal:
  // jwtSecret: process.env.JWT_SECRET,
  // databaseUrl: process.env.DATABASE_URL,
};

// Validasi sederhana biar gak ada config penting yang ketinggalan
if (!process.env.DATABASE_URL) {
  console.warn("[Config] Warning: DATABASE_URL tidak ditemukan di .env!");
}
