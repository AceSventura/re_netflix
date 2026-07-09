"use client";
 //HOOKS REACT: Importazione degli strumenti base per la gestione dello stato e del DOM.
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
// SERVER ACTIONS / CONTEXT: Importazione di funzioni asincrone per i dati
// e del Context API per lo stato globale dei profili.
import { getActiveProfile, removeProfileCookie } from "@/app/actions/profiles";
import { useProfiles } from "@/context/ProfileContext";

interface ActiveProfile {
  id_profilo: number;
  nome_profilo: string;
  avatar_url: string | null;
}

// Dichiarazione del Function Component principale
const AccountNavbar = () => {
  // GESTIONE DELLO STATO LOCALE (useState):
  // isOpen: Controlla la visibilità del menu a tendina.
  // profile: Memorizza i dati dell'utente una volta scaricati dal server.
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState<ActiveProfile | null>(null);
  
  // REFERENZA DOM (useRef):
  // Crea un riferimento persistente a un nodo del DOM (il contenitore del dropdown)
  // senza scatenare re-render quando cambia. Serve per intercettare i click esterni.
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // CICLO DI VITA E DATA FETCHING CLIENT-SIDE (useEffect):
  // L'array di dipendenze vuoto [] indica che l'effetto gira una sola volta al mount.
  useEffect(() => {
    // React vieta che la callback di useEffect sia asincrona direttamente.
    // Il pattern corretto è dichiarare una funzione async all'interno e chiamarla.
    async function fetchProfile() {
      try {
        const res = await getActiveProfile(); // Chiamata API/Server Action
        if (res.success && res.profile) {
          setProfile(res.profile); // Aggiorna lo stato, innescando un re-render
        }
      } catch (error) {
        console.error("Errore nel recupero del profilo:", error);
      }
    }
    fetchProfile(); //esecuzione della funzione asincrona
  }, []);

  // PATTERN "CLICK OUTSIDE" (useEffect):
  // Aggiunge un event listener globale al documento per chiudere il menu se clicchi fuori.
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Se il ref esiste e l'elemento cliccato NON è contenuto dentro il ref, chiudi.
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    
    // CLEANUP FUNCTION:
    // Rimuove il listener quando il componente viene distrutto.
    // Previene i memory leak (perdite di memoria) e comportamenti anomali.
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    router.push("/logout"); // Navigazione programmatica tramite useRouter
  };

  // Estrazione della funzione selectProfile da ProfileContext
  const { selectProfile } = useProfiles();

  const handleSwitchProfile = async () => {
    try {
      await removeProfileCookie();
      selectProfile(null);
      router.push("/browse");
    } catch (error) {
      console.error("Errore durante il cambio profilo:", error);
    }
  };

  // FALLBACK IMMAGINE: Operatore di coalescenza logica (||). 
  // Se avatar_url è null/undefined, usa l'URL di default fornito.
  const avatarSrc = profile?.avatar_url || "https://occ-0-2135-2581.1.nflxso.net/dnm/api/v6/SO2HoVCx33X8phZh2pZZmQ4QgNY/AAAABaEZAmr6k9h96-doKWxdUfUcAgUKY18xnhWDruqwhaEbG2bDAYjtd6pcIXvx9NzwJLfLbSJaMkqXp5prdK3PiDPvgtFoz6EMmA.png?r=229%22";

  return (
    // z-50: Forza la Navbar a stare sopra tutti gli altri elementi della pagina.
    <header className="w-full bg-white border-b border-gray-200 shadow-sm relative z-50">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-8 py-4">
        
        {/* Logo Netflix */}
        <div className="flex items-center">
          <Link href="/browse">
            <svg viewBox="0 0 111 30" className="w-28 md:w-32 h-auto fill-[#E50914] transition-opacity hover:opacity-80" aria-hidden="true">
              <path d="M105.06233,14.2806261 L110.999156,30 C109.249227,29.7497422 107.500234,29.4366857 105.718437,29.1554972 L102.374168,20.4686475 L98.9371075,28.4375293 C97.2499766,28.1563408 95.5928391,28.061674 93.9057081,27.8432843 L99.9372012,14.0931671 L94.4680851,-5.68434189e-14 L99.5313525,-5.68434189e-14 L102.593495,7.87421502 L105.874965,-5.68434189e-14 L110.999156,-5.68434189e-14 L105.06233,14.2806261 Z M90.4686475,-5.68434189e-14 L85.8749649,-5.68434189e-14 L85.8749649,27.2499766 C87.3746368,27.3437061 88.9371075,27.4055675 90.4686475,27.5930265 L90.4686475,-5.68434189e-14 Z M81.9055207,26.93692 C77.7186241,26.6557316 73.5307901,26.4064111 69.250164,26.3117443 L69.250164,-5.68434189e-14 L73.9366389,-5.68434189e-14 L73.9366389,21.8745899 C76.6248008,21.9373887 79.3120255,22.1557784 81.9055207,22.2804387 L81.9055207,26.93692 Z M64.2496954,10.6561065 L64.2496954,15.3435186 L57.8442216,15.3435186 L57.8442216,25.9996251 L53.2186709,25.9996251 L53.2186709,-5.68434189e-14 L66.3436123,-5.68434189e-14 L66.3436123,4.68741213 L57.8442216,4.68741213 L57.8442216,10.6561065 L64.2496954,10.6561065 Z M45.3435186,4.68741213 L45.3435186,26.2498828 C43.7810479,26.2498828 42.1876465,26.2498828 40.6561065,26.3117443 L40.6561065,4.68741213 L35.8121661,4.68741213 L35.8121661,-5.68434189e-14 L50.2183897,-5.68434189e-14 L50.2183897,4.68741213 L45.3435186,4.68741213 Z M30.749836,15.5928391 C28.687787,15.5928391 26.2498828,15.5928391 24.4999531,15.6875059 L24.4999531,22.6562939 C27.2499766,22.4678976 30,22.2495079 32.7809542,22.1557784 L32.7809542,26.6557316 L19.812541,27.6876933 L19.812541,-5.68434189e-14 L32.7809542,-5.68434189e-14 L32.7809542,4.68741213 L24.4999531,4.68741213 L24.4999531,10.9991564 C26.3126816,10.9991564 29.0936358,10.9054269 30.749836,10.9054269 L30.749836,15.5928391 Z M4.78114163,12.9684132 L4.78114163,29.3429562 C3.09401069,29.5313525 1.59340144,29.7497422 0,30 L0,-5.68434189e-14 L4.4690224,-5.68434189e-14 L10.562377,17.0315868 L10.562377,-5.68434189e-14 L15.2497891,-5.68434189e-14 L15.2497891,28.061674 C13.5935889,28.3437998 11.906458,28.4375293 10.1246602,28.6868498 L4.78114163,12.9684132 Z"/> 
            </svg>
          </Link>
        </div>

        {/* POSIZIONAMENTO DROPDOWN (relative/absolute):
            Il contenitore padre usa 'relative' per creare il sistema di coordinate. 
            Il ref={dropdownRef} è attaccato qui per monitorare l'area del menu. */}
        <div className="relative flex items-center" ref={dropdownRef}>
          
          <button
            onClick={() => setIsOpen(!isOpen)} // Toggle booleano dello stato
            className="flex items-center hover:opacity-80 transition-opacity focus:outline-none"
            type="button"
            aria-haspopup="true" // Accessibilità (a11y)
            aria-expanded={isOpen}
          >
            <div className="w-8 h-8 relative rounded overflow-hidden mr-2">
              {/* COMPONENTE <Image> di Next.js:
                  'fill' fa sì che l'immagine occupi esattamente il contenitore w-8 h-8.
                  'unoptimized' bypassa la compressione sul server di Next.js (utile se l'URL viene da fonti esterne non configurate). */}
              <Image
                src={avatarSrc}
                alt="Clicca per aprire il menu"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            
            {/* Animazione rotazione: Se isOpen è true, applica la classe 'rotate-180' per capovolgere la freccia */}
            <svg viewBox="0 0 24 24" className={`w-[14px] h-[14px] text-gray-800 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} fill="currentColor">
              <path fillRule="evenodd" d="M12 16a1 1 0 0 1-.707-.293l-6-6a1 1 0 0 1 1.414-1.414L12 13.586l5.293-5.293a1 1 0 0 1 1.414 1.414l-6 6A1 1 0 0 1 12 16z" clipRule="evenodd" />
            </svg>
          </button>
          
          {/* Menu a Tendina (posizionato direttamente sotto l'avatar) */}
          {/* CONDITIONAL RENDERING DEL MENU:
              Usa l'operatore &&. Il <div> viene montato nel DOM solo se isOpen è true.
              'absolute right-0 top-full mt-2' posiziona il menu sotto al bottone, allineato a destra. */}
          {isOpen && (
            <div className="absolute right-0 top-full mt-2 w-[280px] bg-white rounded shadow-[0_2px_12px_rgba(0,0,0,0.15)] border border-gray-200 py-2 z-50 flex flex-col">
              
              <Link href="/browse" className="flex items-center gap-4 px-5 py-3 hover:bg-gray-100 transition-colors text-black">

                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" className="text-gray-800 shrink-0">

                  <path fill="currentColor" fillRule="evenodd" d="M6.414 11H21v2H6.414l5.293 5.293-1.414 1.414-7-7a1 1 0 0 1 0-1.414l7-7 1.414 1.414z" clipRule="evenodd" />

                </svg>

                <span className="text-[15px] font-bold">Torna su Netflix</span>

              </Link>

             

              <hr className="bg-gray-200 border-none h-px my-1" />

 

              <Link href="/account" className="flex items-center gap-4 px-5 py-3 hover:bg-gray-100 transition-colors text-black">

                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" className="text-gray-800 shrink-0">

                  <path fill="currentColor" fillRule="evenodd" d="M15 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0m2 0A5 5 0 1 1 7 5a5 5 0 0 1 10 0M4 21a8 8 0 1 1 16 0v.514A68 68 0 0 1 12 22a68 68 0 0 1-8-.486zm17.15 2.378-.15-.99.151.99a1 1 0 0 0 .849-.99V21c0-5.523-4.477-10-10-10S2 15.477 2 21v1.389a1 1 0 0 0 .849.988L3 22.39c-.151.988-.15.988-.15.989h.003l.01.002.038.005.142.02q.186.027.535.072A70 70 0 0 0 12 24a70 70 0 0 0 8.422-.523q.35-.045.535-.072l.142-.02.038-.005.01-.002z" clipRule="evenodd" />

                </svg>

                <span className="text-[15px] font-bold">Account</span>

              </Link>

 

              <Link href="/account/profiles" className="flex items-center gap-4 px-5 py-3 hover:bg-gray-100 transition-colors text-black">

                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" className="text-gray-800 shrink-0">

                  <path fill="currentColor" fillRule="evenodd" d="M19.121 1.707a3 3 0 0 0-4.242 0l-1.586 1.586-.707.707-11 11A2 2 0 0 0 1 16.414V21a2 2 0 0 0 2 2h4.586A2 2 0 0 0 9 22.414l11-11 .707-.707 1.586-1.586a3 3 0 0 0 0-4.242zM15.586 7 14 5.414l-11 11V19a2 2 0 0 1 2 2h2.586l11-11L17 8.414 6.707 18.707l-1.414-1.414zm.707-3.879a1 1 0 0 1 1.414 0l3.172 3.172a1 1 0 0 1 0 1.414L20 8.586 15.414 4z" clipRule="evenodd" />

                </svg>

                <span className="text-[15px] font-bold">Gestisci i profili</span>

              </Link>

 

              <a href="https://help.netflix.com/" target="_blank" rel="noreferrer noopener" className="flex items-center gap-4 px-5 py-3 hover:bg-gray-100 transition-colors text-black">

                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" className="text-gray-800 shrink-0">

                  <path fill="currentColor" fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m0 8c-1.317 0-2 .743-2 1.5H8C8 7.257 10.003 6 12 6s4 1.257 4 3.5c0 1.349-1.08 2.268-2.178 2.68-.265.1-.49.25-.636.411-.14.156-.186.292-.186.409v1h-2v-1c0-1.435 1.168-2.335 2.119-2.692.729-.274.881-.66.881-.808 0-.757-.683-1.5-2-1.5m1.5 8.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" clipRule="evenodd" />

                </svg>

                <span className="text-[15px] font-bold">Centro assistenza</span>

                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" className="ml-auto text-gray-500 shrink-0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">

                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>

                  <polyline points="15 3 21 3 21 9"></polyline>

                  <line x1="10" y1="14" x2="21" y2="3"></line>

                </svg>

              </a>


              <hr className="bg-gray-200 border-none h-px my-1" />


              <button onClick={handleSwitchProfile} className="flex items-center justify-between px-5 py-3 hover:bg-gray-100 transition-colors text-black w-full text-left">

                <span className="text-[15px] font-bold">Cambia profilo</span>

                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" className="text-gray-500 shrink-0">

                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />

                </svg>

              </button>
              
              <button onClick={handleLogout} className="flex items-center px-5 py-3 hover:bg-gray-100 transition-colors text-black w-full text-left">
                <span className="text-[15px] font-bold">Esci</span>
              </button>
              
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AccountNavbar;