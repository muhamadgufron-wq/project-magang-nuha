import { z } from "zod";

export const createRegistrationSchema = z.object({
  slotId: z.number().int({ message: "ID Slot Jadwal harus berupa angka" }),
  patientType: z.enum(["VIP", "GENERAL"]).default("GENERAL"),
  schedule: z.string().optional(), // Bisa digunakan untuk menyimpan jam spesifik jika diperlukan
});

export const updateRegistrationStatusSchema = z.object({
  status: z.enum(["BOOKED", "REGISTERED", "CANCELLED"]),
});
