import { Request, Response } from "express";
import * as doctorService from "../services/doctorService";
import { sendSuccess, sendError } from "../utils/response";

export const getDoctors = async (req: Request, res: Response) => {
  try {
    const { specialization } = req.query;
    const doctors = await doctorService.getAllDoctors(specialization as string);
    return sendSuccess(res, "Berhasil mengambil daftar dokter", doctors);
  } catch (error) {
    console.error("GetDoctors Error:", error);
    return sendError(res, "Gagal mengambil daftar dokter");
  }
};

export const getDoctorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const doctor = await doctorService.getDoctorById(Number(id));
    if (!doctor) {
      return sendError(res, "Dokter tidak ditemukan", 404);
    }
    return sendSuccess(res, "Berhasil mengambil detail dokter", doctor);
  } catch (error) {
    console.error("GetDoctorById Error:", error);
    return sendError(res, "Gagal mengambil detail dokter");
  }
};

export const getSpecializations = async (req: Request, res: Response) => {
  try {
    const specializations = await doctorService.getAllSpecializations();
    return sendSuccess(res, "Berhasil mengambil daftar spesialisasi", specializations);
  } catch (error) {
    console.error("GetSpecializations Error:", error);
    return sendError(res, "Gagal mengambil daftar spesialisasi");
  }
};
