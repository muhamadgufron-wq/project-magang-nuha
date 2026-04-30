import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/modules/auth";
import Providers from "./providers";


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Healthcare - Booking Dokter Online Dengan Mudah",
  description: "Halaman Login Modern dengan Poppins",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full" suppressHydrationWarning>
      <body className={`${poppins.className} min-h-full flex flex-col antialiased`} suppressHydrationWarning>
        <Providers>
          <AuthProvider>
            {children}
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
