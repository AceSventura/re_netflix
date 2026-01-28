import Navbar from "@/components/account/Navbar";
import Footer from "@/components/account/Footer";  

export default function AccountPage() {
    return (
        /* min-h-screen forza la pagina a essere alta quanto il browser */
        <div className="flex flex-col min-h-screen bg-[#F3F3F3]">
            
            {/* 1. Navbar sempre in alto */}
            <Navbar />
            
            {/* 2. Spazio vuoto flessibile 
               Il flex-grow qui è fondamentale: "mangia" tutto lo spazio bianco 
               disponibile e spinge il footer verso il basso. 
            */}
            <div className="flex-grow" />

            {/* 3. Footer sempre in fondo */}
            <Footer />
            
        </div>
    );
}