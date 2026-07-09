import Navbar from "@/components/account/Navbar";
import Footer from "@/components/account/Footer";
import Sidebar from "@/components/account/Sidebar";
import Panoramica from "@/components/account/Panoramica";

export default function AccountPage() {
    return (
        // min-h-screen: il componente occupa il 100% dell'altezza della finestra del browser
    // flex flex-col: Imposta un asse verticale per impilare Navbar, <main> e Footer.
        <div className="flex flex-col min-h-screen bg-[#F3F3F3]">
            <Navbar />
            
            {/* Layout centrale */}
            {/*grow: Ordina al contenitore di espandersi e occupare tutto lo spazio verticale rimanente tra Navbar e Footer.*/}
            {/* mx-auto: Centratura orizzontale automatica.*/}
            <main className="flex-grow w-full max-w-[1100px] mx-auto px-4 md:px-8 py-10">

                {/*Gestione del layout interno (Sidebar + Contenuto).*/}
                {/*flex flex-col md:flex-row: Dal breakpoint md gli elementi diventano affiancati in riga.*/}
                <div className="flex flex-col md:flex-row gap-12">
                    
                    {/* Sidebar a sinistra (Larghezza fissa Netflix) */}
                    <aside className="w-full md:w-60 shrink-0">
                        <Sidebar />
                    </aside>

                    {/* Contenuto Panormaica  a destra*/}
                    <section className="flex-1 min-w-0">
                        <Panoramica />
                    </section>

                </div>
            </main>

        
            <Footer />
        </div>
    );
}