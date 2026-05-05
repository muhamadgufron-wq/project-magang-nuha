import React from 'react';
import Link from 'next/link';
import { BriefcaseMedical } from 'lucide-react';

/**
 * CTA (Call to Action) component untuk bagian bawah Landing Page.
 */
export const CTA = () => {
  return (
    <section className="px-6 lg:px-12 pb-24 max-w-7xl mx-auto">
      <div className="bg-[#0F172A] rounded-[3rem] p-12 lg:p-20 relative overflow-hidden flex flex-col items-start min-h-[450px] justify-center shadow-2xl">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 opacity-10 pointer-events-none">
           <div className="w-[500px] h-[500px] rounded-full border-[40px] border-white flex items-center justify-center">
              <BriefcaseMedical className="w-48 h-48 text-white" />
           </div>
        </div>
        
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
            Ready to prioritize your health?
          </h2>
          <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed">
            Join thousands of patients who have already switched to the smarter way of managing healthcare.
          </p>
          <Link href="/register" className="inline-flex items-center justify-center px-10 py-5 bg-white text-slate-900 font-bold text-lg rounded-full hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.2)]">
            Create Your Account
          </Link>
        </div>
      </div>
    </section>
  );
};
