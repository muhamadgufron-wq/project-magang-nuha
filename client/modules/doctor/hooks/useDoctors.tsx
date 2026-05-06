"use client";

import { useQuery } from "@tanstack/react-query";
import * as doctorService from "../services/doctorService";

export const useDoctors = (specializationId?: string, page: number = 1, limit: number = 10, date?: string) => {
  return useQuery({
    queryKey: ["doctors", specializationId, page, limit, date],
    queryFn: () => doctorService.fetchDoctors(specializationId, page, limit, date),
  });
};

export const useDoctor = (id: string) => {
  return useQuery({
    queryKey: ["doctor", id],
    queryFn: () => doctorService.fetchDoctorById(id),
    enabled: !!id,
  });
};

export const useSpecializations = () => {
  return useQuery({
    queryKey: ["specializations"],
    queryFn: doctorService.fetchSpecializations,
  });
};
