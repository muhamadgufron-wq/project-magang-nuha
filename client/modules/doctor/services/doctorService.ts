import { Doctor } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchDoctors = async (specialization?: string): Promise<Doctor[]> => {
  const url = new URL(`${API_URL}/doctors`);
  if (specialization) {
    url.searchParams.append("specialization", specialization);
  }

  const response = await fetch(url.toString());
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Gagal mengambil daftar dokter");
  }

  return Array.isArray(data.data) ? data.data : [];
};

export const fetchDoctorById = async (id: string): Promise<Doctor> => {
  const response = await fetch(`${API_URL}/doctors/${id}`);
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Gagal mengambil detail dokter");
  }

  return data.data;
};

export const fetchSpecializations = async (): Promise<string[]> => {
  const response = await fetch(`${API_URL}/doctors/specializations`);
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Gagal mengambil daftar spesialisasi");
  }

  return Array.isArray(data.data) ? data.data : [];
};
