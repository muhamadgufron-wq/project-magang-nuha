import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as appointmentService from "../services/appointmentService";
import { CreateRegistrationRequest } from "../types";
import Swal from "sweetalert2";

export const useRegistrations = () => {
  return useQuery({
    queryKey: ["registrations", "me"],
    queryFn: appointmentService.fetchMyRegistrations,
  });
};

export const useCreateRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRegistrationRequest) => appointmentService.createRegistration(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
      Swal.fire({
        title: "Berhasil!",
        text: "Janji temu Anda telah berhasil dibuat.",
        icon: "success",
        confirmButtonColor: "#10b981",
      });
    },
    onError: (error: Error) => {
      Swal.fire({
        title: "Gagal!",
        text: error.message || "Terjadi kesalahan saat membuat janji temu.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    },
  });
};

export const useCancelRegistration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => appointmentService.cancelRegistration(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
      Swal.fire({
        title: "Dibatalkan!",
        text: "Janji temu Anda telah dibatalkan.",
        icon: "success",
        confirmButtonColor: "#10b981",
      });
    },
    onError: (error: Error) => {
      Swal.fire({
        title: "Gagal!",
        text: error.message || "Gagal membatalkan janji temu.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    },
  });
};
