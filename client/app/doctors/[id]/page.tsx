import { DoctorDetail } from "@/modules/doctor";
import Navbar from "@/components/layout/Navbar/Navbar";
import  Footer  from "@/components/layout/Footer/Footer";

export default function DoctorDetailPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20"> {/* Padding for fixed navbar */}
        <DoctorDetail />
      </div>
      <Footer />
    </main>
  );
}
