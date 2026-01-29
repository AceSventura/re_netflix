import Navbar from "@/components/account/Navbar";
import Footer from "@/components/account/Footer";
import Sidebar from "@/components/account/Sidebar";
import Membership from "@/components/account/Membership";

export default function MembershipPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F3F3F3]">
      {/* Navbar superiore */}
      <Navbar />
      
      {/* Layout centrale */}
      <main className="grow w-full max-w-[1100px] mx-auto px-4 md:px-8 py-10">
        <div className="flex flex-col md:flex-row gap-12">
          
          {/* Sidebar a sinistra */}
          <aside className="w-full md:w-60 shrink-0">
            <Sidebar />
          </aside>

          {/* Contenuto Abbonamento a destra */}
          <Membership />

        </div>
      </main>

      {/* Footer in fondo */}
      <Footer />
    </div>
  );
}