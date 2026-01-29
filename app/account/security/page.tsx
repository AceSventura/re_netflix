import Navbar from "@/components/account/Navbar";
import Footer from "@/components/account/Footer";
import Sidebar from "@/components/account/Sidebar";
import Security from "@/components/account/Security";

export default function SecurityPage() {
  return (
    /* Il contenitore principale gestisce l'altezza minima e lo sfondo grigio */
    <div className="flex flex-col min-h-screen bg-[#F3F3F3]">
      {/* 1. Navbar superiore */}
      <Navbar />
      
      {/* 2. Area centrale: Layout a due colonne
          - max-w-[1100px]: mantiene il contenuto centrato e non troppo largo
          - flex-col md:flex-row: impila sidebar e contenuto su mobile, li affianca su desktop
      */}
      <main className="flex-grow w-full max-w-[1100px] mx-auto px-4 md:px-8 py-10">
        <div className="flex flex-col md:flex-row gap-12">
          
          {/* Colonna Sinistra: Navigazione (Sidebar) */}
          <aside className="w-full md:w-60 shrink-0">
            <Sidebar />
          </aside>

          {/* Colonna Destra: Componente Sicurezza tipizzato */}
          <Security />

        </div>
      </main>

      {/* 3. Footer in fondo alla pagina */}
      <Footer />
    </div>
  );
}