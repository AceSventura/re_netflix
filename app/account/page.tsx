import Navbar from "@/components/account/Navbar";
import Footer from "@/components/account/Footer";
import Sidebar from "@/components/account/Sidebar";
import Panoramica from "@/components/account/Panoramica";

export default function AccountPage() {
    return (
        <div className="flex flex-col min-h-screen bg-[#F3F3F3]">
            {/* 1. Navbar */}
            <Navbar />
            
            {/* 2. Contenuto Centrale: Layout a due colonne */}
            <main className="flex-grow w-full max-w-[1100px] mx-auto px-4 md:px-8 py-10">
                <div className="flex flex-col md:flex-row gap-12">
                    
                    {/* Colonna Sinistra: Sidebar */}
                    <aside className="w-full md:w-60 shrink-0">
                        <Sidebar />
                    </aside>

                    {/* Colonna Destra: Panoramica Account */}
                    <section className="flex-1 min-w-0">
                        <Panoramica />
                    </section>

                </div>
            </main>

            {/* 3. Footer */}
            <Footer />
        </div>
    );
}