import { Request, Response } from "express";
import * as doctorService from "../services/doctorService";
import { sendSuccess, sendError } from "../utils/response";

export const getDoctors = async (req: Request, res: Response) => {
  try {
    const { specialization, page, limit, date } = req.query;
    
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;

    const result = await doctorService.getAllDoctors(
      specialization as string, 
      pageNum, 
      limitNum,
      date as string
    );
    
    return sendSuccess(res, "Berhasil mengambil daftar dokter", result);
  } catch (error) {
    console.error("GetDoctors Error:", error);
    return sendError(res, "Gagal mengambil daftar dokter");
  }
};

export const getDoctorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // id ini sekarang adalah UUID
    const doctor = await doctorService.getDoctorByUuid(id);
    if (!doctor) {
      return sendError(res, "Dokter tidak ditemukan", 404);
    }
    return sendSuccess(res, "Berhasil mengambil detail dokter", doctor);
  } catch (error) {
    console.error("GetDoctorByUuid Error:", error);
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
