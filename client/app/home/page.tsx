"use client";

import { DoctorList } from "@/modules/doctor";
import Navbar from "@/components/layout/Navbar/Navbar";
import Footer from "@/components/layout/Footer/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FDFDFD]">
      <Navbar />
      
      <div className="pt-24 pb-16 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <DoctorList />
        </div>
      </div>

      <Footer />
    </main>
  );
}
