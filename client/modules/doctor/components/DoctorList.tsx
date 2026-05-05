"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useDoctors, useSpecializations } from "../hooks/useDoctors";
import { Search, Filter, Calendar } from "lucide-react";

export const DoctorList: React.FC = () => {
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>("");
  const [searchName, setSearchName] = useState<string>("");
  
  const { data: doctorsData, isLoading: loadingDoctors } = useDoctors(selectedSpecialization);
  const { data: specializationsData, isLoading: loadingSpecs } = useSpecializations();

  const doctors = Array.isArray(doctorsData) ? doctorsData : [];
  const specializations = Array.isArray(specializationsData) ? specializationsData : [];

  if (loadingDoctors || loadingSpecs) {
    return <div className="flex justify-center items-center h-96 text-emerald-600 font-medium">Memuat data dokter...</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar Filter */}
      <aside className="w-full lg:w-72 shrink-0">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-24">
          <div className="flex items-center gap-2 mb-6">
            <Filter className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-gray-800">Filter Pencarian</h2>
          </div>

          {/* Search by Name */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Dokter</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Cari dokter"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </div>
          </div>

          {/* Specialization Checkboxes */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Spesialis</label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  checked={selectedSpecialization === ""}
                  onChange={() => setSelectedSpecialization("")}
                />
                <span className="text-sm text-gray-600 group-hover:text-emerald-600 transition-colors">Semua Spesialis</span>
              </label>
              {specializations.map((spec: any, index: number) => (
                <label key={index} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    checked={selectedSpecialization === spec}
                    onChange={() => setSelectedSpecialization(spec)}
                  />
                  <span className="text-sm text-gray-600 group-hover:text-emerald-600 transition-colors">{spec}</span>
                </label>
              ))}
            </div>
          </div>

          <button className="w-full bg-emerald-700 text-white py-3 rounded-xl font-bold hover:bg-emerald-800 transition-all">
            Terapkan Filter
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cari Dokter</h1>
          <p className="text-gray-500">Cari dokter sesuai dengan keluhan atau penyakit anda.</p>
        </div>

        {/* Doctor Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {doctors
            .filter(d => d.user.name.toLowerCase().includes(searchName.toLowerCase()))
            .map((doctor: any) => (
            <div 
              key={doctor.id} 
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
            >
              {/* Image Placeholder */}
              <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 text-3xl font-bold">
                    {doctor.user.name.charAt(4).toLowerCase()}
                  </div>
                </div>
              </div>

              <div className="p-5">
                <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full uppercase tracking-wider mb-3">
                  {doctor.specialization || "Umum"}
                </span>
                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-emerald-700 transition-colors line-clamp-1">
                  {doctor.user.name}
                </h3>
                <p className="text-xs text-gray-500 mb-6">
                  {doctor.description || `Spesialis Ahli ${doctor.specialization || "Umum"}`}
                </p>

                <Link 
                  href={`/doctors/${doctor.id}`}
                  className="flex items-center justify-center gap-2 w-full bg-emerald-700 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-800 transition-all"
                >
                  <Calendar className="w-4 h-4" />
                  Lihat Jadwal
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {doctors.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-500">Tidak ada dokter yang ditemukan.</p>
          </div>
        )}

        {/* Pagination Placeholder */}
        <div className="flex justify-center items-center gap-2 mt-12">
          <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
            &lsaquo;
          </button>
          <button className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold">
            1
          </button>
          <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
            2
          </button>
          <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
            3
          </button>
          <span className="px-2 text-gray-400">...</span>
          <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
            8
          </button>
          <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
            &rsaquo;
          </button>
        </div>
      </div>
    </div>
  );
};
