import React from 'react';
import { Users, BriefcaseMedical, ThumbsUp } from 'lucide-react';

/**
 * Stats component untuk menampilkan data statistik pada Landing Page.
 */
export const Stats = () => {
  return (
    <section className="bg-[#0B6B46] py-16 mt-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-[2rem] p-10 flex flex-col items-center justify-center text-center shadow-lg">
          <Users className="w-12 h-12 text-emerald-700 mb-4" />
          <h3 className="text-3xl font-bold text-emerald-700 mb-2">50k+</h3>
          <p className="text-gray-600 font-medium">Pasien Aktif</p>
        </div>
        <div className="bg-emerald-600 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center text-white shadow-lg border-2 border-emerald-500/50">
          <BriefcaseMedical className="w-12 h-12 mb-4 text-white" />
          <h3 className="text-3xl font-bold mb-2">1k+</h3>
          <p className="font-medium text-emerald-50">Dokter Berpengalaman</p>
        </div>
        <div className="bg-white rounded-[2rem] p-10 flex flex-col items-center justify-center text-center shadow-lg">
          <ThumbsUp className="w-12 h-12 text-emerald-700 mb-4" />
          <h3 className="text-3xl font-bold text-emerald-700 mb-2">99%</h3>
          <p className="text-gray-600 font-medium">Tingkat Kepuasan</p>
        </div>
      </div>
    </section>
  );
};
