import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import * as appointmentService from "../services/appointmentService";
import { createRegistrationSchema, updateRegistrationStatusSchema } from "../validations/appointmentValidation";
import { ZodError } from "zod";
import { sendSuccess, sendError } from "../utils/response";

export const createRegistration = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return sendError(res, "User tidak terautentikasi", 401);

    const validatedData = createRegistrationSchema.parse(req.body);
    
    const registration = await appointmentService.createRegistration({
      userId,
      slotId: validatedData.slotId,
      patientType: validatedData.patientType as 'VIP' | 'GENERAL',
      schedule: validatedData.schedule,
    });

    return sendSuccess(res, "Pendaftaran berhasil", registration, 201);
  } catch (error: any) {
    if (error instanceof ZodError) {
      return sendError(res, error.issues[0].message, 400);
    }
    
    const knownErrors = [
      "Profil pasien tidak ditemukan",
      "Jadwal tidak ditemukan atau sudah tidak aktif",
      "Kuota VIP untuk jadwal ini sudah penuh",
      "Kuota Umum untuk jadwal ini sudah penuh"
    ];

    if (knownErrors.includes(error.message)) {
      return sendError(res, error.message, 400);
    }

    console.error("Create Registration Error:", error);
    return sendError(res, "Terjadi kesalahan pada server", 500);
  }
};

export const getMyRegistrations = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return sendError(res, "User tidak terautentikasi", 401);

    const registrations = await appointmentService.getRegistrationsByUserId(userId);
    return sendSuccess(res, "Daftar pendaftaran berhasil diambil", registrations);
  } catch (error: any) {
    console.error("Get My Registrations Error:", error);
    return sendError(res, "Terjadi kesalahan pada server", 500);
  }
};

export const updateStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = updateRegistrationStatusSchema.parse(req.body);

    const registration = await appointmentService.getRegistrationById(Number(id));
    if (!registration) {
      return sendError(res, "Pendaftaran tidak ditemukan", 404);
    }

    const updatedRegistration = await appointmentService.updateRegistrationStatus(Number(id), validatedData.status);
    return sendSuccess(res, "Status pendaftaran berhasil diperbarui", updatedRegistration);
  } catch (error: any) {
    if (error instanceof ZodError) {
      return sendError(res, error.issues[0].message, 400);
    }
    console.error("Update Registration Status Error:", error);
    return sendError(res, "Terjadi kesalahan pada server", 500);
  }
};
