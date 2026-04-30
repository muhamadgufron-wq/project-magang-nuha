import React from 'react';
import Link from 'next/link';

/**
 * Footer component untuk Landing Page.
 * Berisi informasi hak cipta dan tautan kebijakan.
 */
const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-12 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-xl font-black text-slate-900 flex items-center gap-1">
          <span className="text-emerald-700">Healthcare</span>
        </div>
        
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
          <Link href="#" className="hover:text-emerald-700 transition-colors">PRIVACY POLICY</Link>
          <Link href="#" className="hover:text-emerald-700 transition-colors">TERMS OF SERVICE</Link>
          <Link href="#" className="hover:text-emerald-700 transition-colors">ACCESSIBILITY</Link>
          <Link href="#" className="hover:text-emerald-700 transition-colors">CONTACT SUPPORT</Link>
        </div>
        
        <div className="text-xs font-medium text-gray-400">
          © 2026 HEALTHCARE SYSTEMS. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
