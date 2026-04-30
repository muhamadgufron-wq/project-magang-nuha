"use client";

import React from 'react';
import Navbar from '@/components/layout/Navbar/Navbar';
import Footer from '@/components/layout/Footer/Footer';
import Hero from '@/components/landing/Hero/Hero';
import Stats from '@/components/landing/Stats/Stats';
import Services from '@/components/landing/Services/Services';
import CTA from '@/components/landing/CTA/CTA';

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
