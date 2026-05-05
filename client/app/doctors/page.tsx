import { DoctorList } from "@/modules/doctor";
import Navbar from "@/components/layout/Navbar/Navbar";
import Footer from "@/components/layout/Footer/Footer";

export default function DoctorsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-28 pb-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <DoctorList />
        </div>
      </div>
      <Footer />
    </main>
  );
}
