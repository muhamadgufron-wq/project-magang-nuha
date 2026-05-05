import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware untuk mengelola akses rute berdasarkan status autentikasi.
 * 
 * - Halaman Publik: / (Landing Page)
 * - Halaman Autentikasi: /login, /register (Akses terbatas jika sudah login)
 * - Halaman Proteksi: /home (Wajib login)
 */
export default function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');
  const isLandingPage = pathname === '/';
  
  // Rute yang membutuhkan login
  const isProtectedPage = 
    pathname.startsWith('/home') || 
    pathname.startsWith('/appointments') ||
    pathname.includes('/booking'); // Melindungi rute booking di dalam /doctors/[id]/booking

  // 1. Jika mencoba mengakses halaman login/register ATAU landing page saat SUDAH login
  if ((isAuthPage || isLandingPage) && token) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // 2. Jika mencoba mengakses halaman terproteksi saat BELUM login
  if (isProtectedPage && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. Biarkan rute lainnya (Landing page jika belum login, Daftar Dokter, Detail Dokter) terbuka
  return NextResponse.next();
}

// Konfigurasi matcher untuk menentukan rute mana yang akan diproses oleh middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - SVG, PNG, JPG (image files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg).*)',
  ],
};
