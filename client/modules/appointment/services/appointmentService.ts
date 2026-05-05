import { getCookie } from "@/utils/cookies";
import { Registered, CreateRegistrationRequest } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getHeaders = () => {
  const token = getCookie("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const createRegistration = async (data: CreateRegistrationRequest): Promise<Registered> => {
  const response = await fetch(`${API_URL}/appointments`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Gagal membuat janji temu");
  }

  return result.data;
};

export const fetchMyRegistrations = async (): Promise<Registered[]> => {
  const response = await fetch(`${API_URL}/appointments/me`, {
    headers: getHeaders(),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Gagal mengambil daftar janji temu");
  }

  return Array.isArray(result.data) ? result.data : [];
};

export const cancelRegistration = async (id: number): Promise<Registered> => {
  const response = await fetch(`${API_URL}/appointments/${id}/status`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify({ status: "CANCELLED" }),
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Gagal membatalkan janji temu");
  }

  return result.data;
};
