import cron from "node-cron";
import app from "./app";
import { generateSchedulesFromMaster } from "./services/doctorService";
import { config } from "./config/env";

const PORT = config.port;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  // Jalankan generator pertama kali saat server nyala
  // Ini memastikan slot langsung ada tanpa nunggu tengah malam
  try {
    await generateSchedulesFromMaster(14);
  } catch (error) {
    console.error("[Cron] Gagal menjalankan generator awal:", error);
  }

  // Set up Cron Job: Jalan setiap hari jam 00:00
  // Format: 'menit jam tanggal bulan hari_dalam_minggu'
  cron.schedule('0 0 * * *', async () => {
    console.log("[Cron] Menjalankan tugas otomatis: Cetak slot jadwal dokter...");
    try {
      const result = await generateSchedulesFromMaster(14);
      console.log(`[Cron] Berhasil: ${result.created} slot baru dibuat, ${result.skipped} slot dilewati.`);
    } catch (error) {
      console.error("[Cron] Error saat menjalankan tugas otomatis:", error);
    }
  }, {
    timezone: "Asia/Jakarta"
  });
});