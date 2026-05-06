"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useDoctors, useSpecializations } from "../hooks/useDoctors";
import { User, Calendar, ChevronDown } from "lucide-react";

// Helper untuk tanggal dalam format Indonesia
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).toUpperCase();
  } catch {
    return dateString;
  }
};

// Helper untuk mendapatkan nama hari saja
const getDayName = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { weekday: 'long' });
  } catch {
    return "";
  }
};

// Helper untuk format waktu (HH:mm)
const formatTime = (timeString: string) => {
  if (!timeString) return "-";
  try {
    const date = new Date(timeString);
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  } catch {
    return timeString;
  }
};

const DoctorListContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Ambil nilai awal dari URL atau gunakan default (tanggal hari ini)
  const initialSpec = searchParams.get("specialization") || "";
  const initialDate = searchParams.get("date") || new Date().toISOString().split('T')[0];
  const initialPage = parseInt(searchParams.get("page") || "1");

  // Local states untuk input (sebelum klik tombol cari)
  const [inputSpecialization, setInputSpecialization] = useState<string>(initialSpec);
  const [inputDate, setInputDate] = useState<string>(initialDate);

  // States yang memicu re-fetch data (applied)
  const [appliedSpecialization, setAppliedSpecialization] = useState<string>(initialSpec);
  const [appliedDate, setAppliedDate] = useState<string>(initialDate);
  
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const limit = 10;

  // Sinkronisasi state jika URL berubah
  useEffect(() => {
    const spec = searchParams.get("specialization") || "";
    const date = searchParams.get("date") || new Date().toISOString().split('T')[0];
    const page = parseInt(searchParams.get("page") || "1");

    setInputSpecialization(spec);
    setInputDate(date);
    setAppliedSpecialization(spec);
    setAppliedDate(date);
    setCurrentPage(page);
  }, [searchParams]);
  
  const { data: result, isLoading: loadingDoctors } = useDoctors(appliedSpecialization, currentPage, limit, appliedDate);
  const { data: specializationsData, isLoading: loadingSpecs } = useSpecializations();

  const doctors = result?.doctors || [];
  const pagination = result?.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 };
  const specializations = Array.isArray(specializationsData) ? specializationsData : [];

  const updateURL = (spec: string, date: string, page: number) => {
    const params = new URLSearchParams();
    if (spec) params.set("specialization", spec);
    if (date) params.set("date", date);
    if (page > 1) params.set("page", page.toString());
    
    // Gunakan window.history untuk update URL tanpa memicu middleware/re-render berat
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
  };

  const handleSearch = () => {
    setAppliedSpecialization(inputSpecialization);
    setAppliedDate(inputDate);
    setCurrentPage(1);
    updateURL(inputSpecialization, inputDate, 1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL(appliedSpecialization, appliedDate, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loadingDoctors || loadingSpecs) {
    return <div className="flex justify-center items-center h-96 text-emerald-600 font-medium">Memuat data...</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar Filter */}
      <aside className="w-full lg:w-72 shrink-0">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm sticky top-24">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Cari Spesialis</h2>

          {/* Specialization Select */}
          <div className="mb-4">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <User className="w-4 h-4 text-gray-400" />
              </div>
              <select 
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#005B41] appearance-none cursor-pointer"
                value={inputSpecialization}
                onChange={(e) => setInputSpecialization(e.target.value)}
              >
                <option value="">Semua Spesialis</option>
                {specializations.map((spec: any, index: number) => (
                  <option key={index} value={spec}>{spec}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Date Picker */}
          <div className="mb-6">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <Calendar className="w-4 h-4 text-gray-400" />
              </div>
              <input 
                type="date" 
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#005B41] cursor-pointer"
                value={inputDate}
                onChange={(e) => setInputDate(e.target.value)}
              />
            </div>
          </div>

          <button 
            onClick={handleSearch}
            className="w-full bg-[#005B41] text-white py-3 rounded-lg font-semibold hover:bg-emerald-900 transition-all text-sm tracking-wide"
          >
            Cari Spesialis
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <div className="mb-8 text-center pt-2">
          <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-wide">
            JADWAL PRAKTEK DOKTER SPESIALIS
          </h1>
          <p className="text-lg font-medium text-gray-500 mt-2">
            {formatDate(appliedDate)}
          </p>
        </div>

        {/* Doctor Table - Matches Screenshot */}
        <div className="bg-white border border-gray-200 overflow-hidden rounded-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#E8F3EF] text-gray-800 border-b border-gray-200">
                  <th className="px-6 py-4 text-sm font-bold w-1/5">Spesialis</th>
                  <th className="px-6 py-4 text-sm font-bold w-1/4">Nama Dokter</th>
                  <th className="px-6 py-4 text-sm font-bold w-1/6">Waktu</th>
                  <th className="px-6 py-4 text-sm font-bold w-1/6">Keterangan</th>
                  <th className="px-6 py-4 text-sm font-bold text-center w-1/4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 border-b border-gray-100">
                {(() => {
                  // Group doctors by specialization (case-insensitive)
                  const groupedDoctors: { [key: string]: any[] } = {};
                  doctors.forEach(doctor => {
                    const spec = (doctor.specialization || "UMUM").toUpperCase();
                    if (!groupedDoctors[spec]) groupedDoctors[spec] = [];
                    groupedDoctors[spec].push(doctor);
                  });

                  return Object.entries(groupedDoctors).map(([spec, groupDoctors]) => {
                    return groupDoctors.map((doctor, index) => {
                      const activeSchedule = doctor.schedules?.[0];
                      return (
                        <tr 
                          key={doctor.id} 
                          className="hover:bg-gray-50 transition-colors"
                        >
                          {/* Specialization Column with rowSpan */}
                          {index === 0 && (
                            <td 
                              className="px-6 py-6 align-top border-r border-gray-100 bg-gray-50/30" 
                              rowSpan={groupDoctors.length}
                            >
                              <span className="text-sm font-bold text-gray-700 uppercase leading-tight">
                                {spec}
                              </span>
                            </td>
                          )}
                          
                          <td className="px-6 py-6 align-top border-r border-gray-50">
                            <div className="text-sm text-gray-800 font-medium">
                              {doctor.user.name}
                            </div>
                          </td>
                          <td className="px-6 py-6 align-top border-r border-gray-50">
                            <div className="text-sm text-gray-600">
                              {activeSchedule ? (
                                <>
                                  {formatTime(activeSchedule.start_time)} -<br/>
                                  {formatTime(activeSchedule.end_time)}
                                </>
                              ) : (
                                "-"
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-6 align-top border-r border-gray-50">
                            <div className={`text-sm font-medium ${activeSchedule ? 'text-emerald-600' : 'text-red-500'}`}>
                              {activeSchedule ? "Praktik" : "Tidak Praktik"}
                            </div>
                          </td>
                          <td className="px-6 py-6 align-top">
                            <div className="flex flex-row items-start justify-center gap-2">
                              <Link 
                                href={`/doctors/${doctor.uuid}`}
                                className="px-4 py-2 bg-white border border-emerald-600 text-emerald-700 rounded-lg text-xs font-bold text-center hover:bg-emerald-50 transition-all whitespace-nowrap shadow-sm"
                              >
                                Lihat Jadwal
                              </Link>
                              {activeSchedule && (
                                <Link 
                                  href={`/doctors/${doctor.uuid}/booking?day=${getDayName(appliedDate)}`}
                                  className="px-4 py-2 bg-[#005B41] text-white rounded-lg text-xs font-bold text-center hover:bg-emerald-900 transition-all shadow-sm whitespace-nowrap"
                                >
                                  Buat Janji
                                </Link>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    });
                  });
                })()}
              </tbody>
            </table>
          </div>

          {/* Empty State in Table */}
          {doctors.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 font-medium">Tidak ada dokter yang ditemukan.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-1 mt-8 mb-4">
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-8 h-8 flex items-center justify-center text-sm border bg-white text-emerald-700 border-gray-200 hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            &lsaquo;
          </button>
          
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(num => (
            <button 
              key={num}
              onClick={() => handlePageChange(num)}
              className={`w-8 h-8 flex items-center justify-center text-sm border transition-colors ${num === currentPage ? 'bg-[#005B41] text-white border-[#005B41]' : 'bg-white text-emerald-700 border-gray-200 hover:bg-emerald-50'}`}
            >
              {num}
            </button>
          ))}

          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === pagination.totalPages}
            className="w-8 h-8 flex items-center justify-center text-sm border bg-white text-emerald-700 border-gray-200 hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            &rsaquo;
          </button>
        </div>
      </div>
    </div>
  );
};

export const DoctorList: React.FC = () => {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-96 text-emerald-600 font-medium">Memuat pencarian...</div>}>
      <DoctorListContent />
    </Suspense>
  );
};
