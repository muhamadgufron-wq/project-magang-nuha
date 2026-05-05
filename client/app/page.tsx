"use client";

import React from 'react';
import Navbar from '@/components/layout/Navbar/Navbar';
import Footer from '@/components/layout/Footer/Footer';
import { Hero, Stats, Services, CTA } from "@/modules/landing";

/**
 * Landing Page utama aplikasi Healthcare.
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar />
      
      <main>
        <Hero />
        <Stats />
        <Services />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
