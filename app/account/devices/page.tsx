import Navbar from "@/components/account/Navbar";
import Footer from "@/components/account/Footer";
import Sidebar from "@/components/account/Sidebar";
import Devices from "@/components/account/Devices";

export default function DevicesPage() {
  return (
    // min-h-screen: il componente occupa il 100% dell'altezza della finestra del browser
    // flex flex-col: Imposta un asse verticale per impilare Navbar, <main> e Footer.
    <div className="flex flex-col min-h-screen bg-[#F3F3F3]"> 
      <Navbar />
      
      {/* Container "Gabbia" centrato a 1024px */}
      {/*grow: Ordina al contenitore di espandersi e occupare tutto lo spazio verticale rimanente tra Navbar e Footer.*/}
      {/* max-w-5xl mx-auto: Limita la larghezza (1024px) e centra il blocco orizzontalmente nello schermo.*/}
      <main className="grow w-full max-w-5xl mx-auto px-4 md:px-8 py-12">

        {/*Gestione del layout interno (Sidebar + Contenuto).*/}
        {/*flex flex-col md:flex-row: Dal breakpoint md gli elementi diventano affiancati in riga.*/}
        <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
          
          {/* Sidebar a sinistra (Larghezza fissa Netflix) */}
          <aside className="w-full md:w-60 shrink-0"> 
            <Sidebar />
          </aside>

          {/* Contenuto Dispositivi a destra */}
          <Devices />

        </div>
      </main>

      <Footer />
    </div>
  );
}