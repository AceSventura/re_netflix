"use client";
//HOOKS REACT: Importazione degli strumenti base per la gestione dello stato e del DOM.
import React, { useState } from 'react';
//Fornisce l'oggetto router per eseguire navigazioni programmatiche
import { useRouter } from 'next/navigation';
// LIBRERIE ESTERNE: Uso di 'lucide-react' per icone vettoriali leggere e scalabili.
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import FaqSection from '@/components/hero/FAQSection';
import Footer from '@/components/hero/Footer';
import TrendingRow from '@/components/hero/TrendingRow';
import ReasonsToJoin from '@/components/hero/ReasonsToJoin';
import NetflixAdsBanner from '@/components/hero/NetflixAdBanner';
// SERVER ACTION: Questa è una funzione asincrona eseguita sul server.
import { checkEmailExists } from '@/app/actions/auth';

// 3. COMPOSITION PATTERN (Wrapper): Un componente di layout riutilizzabile.
//'children' è una prop speciale di React che rappresenta
// qualsiasi cosa venga racchiusa tra i tag <SectionLayout> ... </SectionLayout>.
const SectionLayout = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <section className={`py-5 px-12 sm:px-16 md:px-40 lg:px-88 ${className}`}>
      <div className="mx-auto max-w-480">
        {children}
      </div>
    </section>
  );
};

// Dichiarazione del Function Component principale ed esportazione
export default function NetflixLanding() {
    // INIZIALIZZAZIONE HOOKS:
    const router = useRouter();  // Per la navigazione programmatica
    const [email, setEmail] = useState("");  // Stato per l'input dell'email
    const [isLoading, setIsLoading] = useState(false);  // Stato per il feedback visivo di caricamento

    // GESTIONE EVENTO FORM (Submit):
    const handleStart = async (e: React.FormEvent) => {
        // Previene il comportamento di default del form (il ricaricamento della pagina)
        e.preventDefault();

        // Se l'input è vuoto, interrompe l'esecuzione
        if (!email) return;

        // Attiva lo stato di caricamento (disabiliterà il bottone)
        setIsLoading(true);

        try {
            // CHIAMATA AL BACKEND (Server Action):
            // Controlla se l'email esiste nel database
            const exists = await checkEmailExists(email);

            // Reindirizza alla pagina corretta passando l'email nell'URL
            // encodeURIComponent previene errori se l'email contiene caratteri speciali.
            if (exists) {
                router.push(`/login?email=${encodeURIComponent(email)}`);
            } else {
                router.push(`/signup?email=${encodeURIComponent(email)}`);
            }
        } catch (error) {
            console.error("Errore durante la verifica", error);
        } finally {
            // finally viene eseguito sempre, sia in caso di successo che di errore,
            // garantendo che il bottone venga riattivato.
            setIsLoading(false);
        }
    };

    return (
        // selection:bg-red-600 cambia il colore dell'evidenziatore del testo (quando selezioni col mouse)
        <div className="bg-black text-white font-sans selection:bg-red-600">
        
            {/* --- HERO SECTION --- */}
            {/* relative: Crea il contesto per posizionare l'immagine di sfondo in modo assoluto */}
            <section className="relative h-175 lg:h-200 w-full border-b-8 border-[#232323]">
                {/* Background Image Overlay */}
                <div className="absolute inset-0 z-0">
                
                {/* - fill: L'immagine si espande per occupare tutto il div genitore (absolute inset-0).
                    - priority: Fondamentale per l'LCP (Largest Contentful Paint). 
                        Forza Next.js a precaricare l'immagine immediatamente senza lazy-loading,
                        poiché si trova Above The Fold (visibile appena si apre la pagina). */}
                <Image 
                    src="/login-background.png"
                    className="object-cover opacity-50"
                    alt="Netflix Background"
                    fill
                    priority
                />

                {/* Gradiente sovrapposto all'immagine per migliorare la leggibilità del testo */}
                <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-black opacity-80" />
                </div>

                {/* Navbar */}
                <nav className="relative z-10 flex items-center justify-between px-6 py-6 lg:px-44">
                
                {/* SVG Logo */}
                <svg viewBox="0 0 111 30" className="w-24 lg:w-40 fill-red-600">
                    <path d="M105.06233,14.2806261 L110.999156,30 C109.249227,29.7497422 107.500234,29.4366857 105.718437,29.1554972 L102.374168,20.4686475 L98.9371075,28.4375293 C97.2499766,28.1563408 95.5928391,28.061674 93.9057081,27.8432843 L99.9372012,14.0931671 L94.4680851,-5.68434189e-14 L99.5313525,-5.68434189e-14 L102.593495,7.87421502 L105.874965,-5.68434189e-14 L110.999156,-5.68434189e-14 L105.06233,14.2806261 Z M90.4686475,-5.68434189e-14 L85.8749649,-5.68434189e-14 L85.8749649,27.2499766 C87.3746368,27.3437061 88.9371075,27.4055675 90.4686475,27.5930265 L90.4686475,-5.68434189e-14 Z M81.9055207,26.93692 C77.7186241,26.6557316 73.5307901,26.4064111 69.250164,26.3117443 L69.250164,-5.68434189e-14 L73.9366389,-5.68434189e-14 L73.9366389,21.8745899 C76.6248008,21.9373887 79.3120255,22.1557784 81.9055207,22.2804387 L81.9055207,26.93692 Z M64.2496954,10.6561065 L64.2496954,15.3435186 L57.8442216,15.3435186 L57.8442216,25.9996251 L53.2186709,25.9996251 L53.2186709,-5.68434189e-14 L66.3436123,-5.68434189e-14 L66.3436123,4.68741213 L57.8442216,4.68741213 L57.8442216,10.6561065 L64.2496954,10.6561065 Z M45.3435186,4.68741213 L45.3435186,26.2498828 C43.7810479,26.2498828 42.1876465,26.2498828 40.6561065,26.3117443 L40.6561065,4.68741213 L35.8121661,4.68741213 L35.8121661,-5.68434189e-14 L50.2183897,-5.68434189e-14 L50.2183897,4.68741213 L45.3435186,4.68741213 Z M30.749836,15.5928391 C28.687787,15.5928391 26.2498828,15.5928391 24.4999531,15.6875059 L24.4999531,22.6562939 C27.2499766,22.4678976 30,22.2495079 32.7809542,22.1557784 L32.7809542,26.6557316 L19.812541,27.6876933 L19.812541,-5.68434189e-14 L32.7809542,-5.68434189e-14 L32.7809542,4.68741213 L24.4999531,4.68741213 L24.4999531,10.9991564 C26.3126816,10.9991564 29.0936358,10.9054269 30.749836,10.9054269 L30.749836,15.5928391 Z M4.78114163,12.9684132 L4.78114163,29.3429562 C3.09401069,29.5313525 1.59340144,29.7497422 0,30 L0,-5.68434189e-14 L4.4690224,-5.68434189e-14 L10.562377,17.0315868 L10.562377,-5.68434189e-14 L15.2497891,-5.68434189e-14 L15.2497891,28.061674 C13.5935889,28.3437998 11.906458,28.4375293 10.1246602,28.6868498 L4.78114163,12.9684132 Z"></path>
                </svg>
                <div className="flex gap-4">
                    <select className="bg-black/50 border border-gray-500 px-4 py-1 rounded text-sm">
                    <option>Italiano</option>
                    <option>English</option>
                    </select>

                    {/* Navigazione programmatica on-click vs componente <Link> */}
                    <button className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded font-medium text-sm transition" onClick={() => router.push('/login')}>
                    Accedi
                    </button>
                </div>
                </nav>

                {/* Contenuto Centrale Hero */}
                <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
                <h1 className="text-3xl lg:text-6xl font-black mb-4">
                    Film, serie TV e tanto altro, senza limiti
                </h1>
                <p className="text-lg lg:text-2xl mb-8">
                    A partire da 6,99 €. Disdici quando vuoi.
                </p>

                {/* FORM CONTROLLED E SUBMIT: */}
                <form onSubmit={handleStart} className="flex flex-col lg:flex-row gap-2 w-full max-w-2xl">

                    {/* Controlled Input: Il valore dell'input è legato strettamente allo stato 'email'. 
                        Quando l'utente digita (onChange), lo stato si aggiorna. */}
                    <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Indirizzo email"
                    className="grow p-4 bg-black/40 border border-gray-500 rounded text-white outline-none"
                    />
                    <button 
                      type="submit" 

                      // GESTIONE STATO DI CARICAMENTO SULLA UI:
                        // Blocca il bottone per evitare invii multipli se la chiamata API è lenta.
                      disabled={isLoading}

                      // disabled:opacity-70 disabled:cursor-not-allowed modificano lo stile del bottone quando è bloccato
                      className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded text-xl font-bold flex items-center justify-center transition disabled:opacity-70 disabled:cursor-not-allowed"
                    >

                    {/* Rendering condizionale del testo: Se sta caricando mostra "Attendi...", 
                            altrimenti mostra "Inizia" e l'icona Chevron. */}
                    {isLoading ? 'Attendi...' : <>Inizia <ChevronRight className="ml-2" /></>}
                    </button>
                </form>
                <p className="mt-4 text-sm text-gray-300">
                    Vuoi guardare Netflix? Inserisci l&apos;indirizzo email per abbonarti o riattivare il tuo abbonamento.
                </p>
                </div>
            </section>  


            {/* L'uso di SectionLayout assicura che tutte queste sezioni abbiano
                la stessa larghezza massima (max-w) e gli stessi margini (px) */}
            {/* --- NETFLIX ADS BANNER --- */}
            <SectionLayout>
                <NetflixAdsBanner />
            </SectionLayout>

            {/* --- TRENDING ROW --- */}
            <SectionLayout>
                <TrendingRow />
            </SectionLayout>

            {/* --- REASONS TO JOIN SECTION --- */}
            <SectionLayout>
                <ReasonsToJoin />
            </SectionLayout>

            {/* --- FAQ SECTION --- */}
            <SectionLayout>
                <FaqSection />
            </SectionLayout>

            {/* --- FOOTER SECTION --- */}
            <SectionLayout>
                <Footer />
            </SectionLayout>

        </div>
    );
}