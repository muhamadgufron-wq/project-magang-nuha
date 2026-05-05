"use client";

import { useQuery } from "@tanstack/react-query";
import * as doctorService from "../services/doctorService";

export const useDoctors = (specializationId?: string) => {
  return useQuery({
    queryKey: ["doctors", specializationId],
    queryFn: () => doctorService.fetchDoctors(specializationId),
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
