import { Doctor } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface PaginatedDoctors {
  doctors: Doctor[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const fetchDoctors = async (specialization?: string, page: number = 1, limit: number = 10, date?: string): Promise<PaginatedDoctors> => {
  const url = new URL(`${API_URL}/doctors`);
  if (specialization) {
    url.searchParams.append("specialization", specialization);
  }
  if (date) {
    url.searchParams.append("date", date);
  }
  url.searchParams.append("page", page.toString());
  url.searchParams.append("limit", limit.toString());

  const response = await fetch(url.toString());
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Gagal mengambil daftar dokter");
  }

  return data.data;
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
