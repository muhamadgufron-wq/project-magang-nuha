import BookingForm from "@/modules/appointment/components/BookingForm";
import Navbar from "@/components/layout/Navbar/Navbar";
import Footer from "@/components/layout/Footer/Footer";

export default async function BookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20"> {/* Padding for fixed navbar */}
        <BookingForm doctorId={id} />
      </div>
      <Footer />
    </main>
  );
}
