"use client";
//HOOKS REACT: Importazione degli strumenti base per la gestione dello stato e del DOM.
import React, { useEffect, useState } from "react";

// NEXT IMAGE: Ottimizzazione nativa delle immagini in Next.js.
import Image from "next/image";

// LIBRERIE ESTERNE: Uso di 'lucide-react' per icone vettoriali leggere e scalabili.
import { AlertTriangle, ArrowLeftRight, ChevronRight } from "lucide-react";

// Server Actions importate per dialogare con il backend.
import { getUserProfiles, getActiveProfile, setActiveProfile } from "@/app/actions/profiles";

// TYPESCRIPT - INTERFACCIA CON PROPRIETÀ DINAMICHE:
// 'isActive' è opzionale (?) perché non viene restituito direttamente dal database, 
// ma viene calcolato e aggiunto a runtime dal frontend nel blocco useEffect.
interface Profile {
  id_profilo: number;
  nome_profilo: string;
  avatar_url: string | null;
  isActive?: boolean; 
}

// COMPONENTIZZAZIONE (ListRow): Sotto-componente astratto e riutilizzabile.
// Invece di ripetere il markup <li> per ogni riga, si crea un modulo generico.
// Questo rispetta il principio DRY (Don't Repeat Yourself).
const ListRow = ({
  icon,
  title,
  subtitle,
  badge,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  badge?: string;
  onClick?: () => void;
}) => (

  // last:border-b-0: Utility Tailwind molto utile. Rimuove il bordo inferiore 
  // solo all'ultimo elemento della lista per evitare doppie righe col contenitore.
  <li className="border-b border-gray-200 last:border-b-0">
    <button 
      onClick={onClick}
      className="flex w-full items-center gap-4 py-4 px-4 hover:bg-gray-50 transition-colors text-left"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded overflow-hidden">
        {icon}
      </div>
      
      {/* min-w-0: L'hack CSS per Flexbox per troncare testi lunghi */}
      <div className="flex-1 min-w-0">
        <div className="text-base font-bold text-black">{title}</div>
        {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
      </div>
      
      {/* Badge condizionale per mostrare lo stato "Ora attivo" */}
      {badge && <span className="text-sm font-bold text-blue-600">{badge}</span>}
      
      <ChevronRight size={20} className="text-gray-400" />
    </button>
  </li>
);

// Dichiarazione del Function Component principale ed esportazione
export default function Profiles() {
  // 6. GESTIONE STATO GLOBALE DEL COMPONENTE:
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true); // Gestisce lo scheletro visivo iniziale
  const [error, setError] = useState<string | null>(null);

  // 7. DATA FETCHING CONCORRENTE (Domanda d'esame su Performance):
  useEffect(() => {
    async function loadData() {
      try {
        // Promise.all: Esegue le due chiamate API SIMULTANEAMENTE, non in sequenza.
        const [profilesRes, activeRes] = await Promise.all([
          getUserProfiles(),
          getActiveProfile()
        ]);

        if (!profilesRes.success) {
          setError(profilesRes.error || "Errore nel caricamento");
          return;
        }

        // Estrae l'ID del profilo attivo se esiste
        const activeId = activeRes.success && activeRes.profile ? activeRes.profile.id_profilo : null;

        // DATA TRANSFORMATION:
        // Crea un nuovo array mappando i profili e iniettando il booleano 'isActive'
        // confrontando l'ID del profilo iterato con l'ID attivo appena scaricato.
        const formatted = (profilesRes.profiles || []).map((p) => ({
          ...p,
          isActive: p.id_profilo === activeId,
        }));

        setProfiles(formatted);
      } catch (err) {
        setError("Errore di connessione");
      } finally {
        // finally viene eseguito SEMPRE, sia che il blocco try riesca, sia che fallisca nel catch.
        // Assicura che l'interfaccia esca dallo stato di "Caricamento...".
        setLoading(false);
      }
    }

    loadData();
  }, []); // Array dipendenze vuoto: esegue solo al mounting

  // AGGIORNAMENTO OTTIMISTICO DELLO STATO (Optimistic UI):
  const handleProfileSelect = async (id_profilo: number) => {
    // Invia l'azione al server
    const res = await setActiveProfile(id_profilo);
    
    // Se il server risponde OK, aggiorna l'interfaccia ricalcolando il valore 'isActive'
    // senza dover riscaricare di nuovo l'intero array di profili dal database.
    if (res.success) {
      setProfiles((prev) =>
        prev.map((p) => ({
          ...p,
          isActive: p.id_profilo === id_profilo,
        }))
      );
    }
  };

  return (
    <section className="w-full">
      <h1 className="text-3xl font-bold text-black mb-8">Profili</h1>

      {/* SEZIONE 1: Link Statici */}
      <p className="font-semibold mb-3">Filtro famiglia e autorizzazioni</p>
      <div className="mb-8 border border-gray-300 rounded-md overflow-hidden bg-white">
        <ul>
          {/* Riutilizzo del componente astratto ListRow per UI statica */}
          <ListRow
            icon={<AlertTriangle size={24} className="text-black" />}
            title="Modifica filtro famiglia"
            subtitle="Imposta fasce d'età, blocca titoli"
          />
          <ListRow
            icon={<ArrowLeftRight size={24} className="text-black" />}
            title="Trasferisci un profilo"
            subtitle="Copia un profilo in un altro account"
          />
        </ul>
      </div>

      {/* SEZIONE 2: Dati Dinamici e Liste */}
      <p className="font-semibold mb-3">Impostazioni del profilo</p>
      <div className="border border-gray-300 rounded-md overflow-hidden mb-6 bg-white flex flex-col">
        <ul>
          {/* RENDERING CONDIZIONALE A CASCATA (Ternario multiplo):
              Gestisce i 4 stati possibili della UI in modo pulito:
              1. Sta caricando?
              2. Ha fallito (errore)?
              3. Ha successo ma è vuoto?
              4. Ha successo e ci sono dati. */}
          {loading ? (
            <li className="p-4 text-gray-500">Caricamento...</li>
          ) : error ? (
            <li className="p-4 text-red-500">{error}</li>
          ) : profiles.length === 0 ? (
            <li className="p-4 text-gray-500">Nessun profilo trovato.</li>
          ) : (
            
            // MAP CON KEY: Essenziale per le performance di rendering delle liste.
            profiles.map((p) => (
              <ListRow
                key={p.id_profilo} // Usa l'ID univoco del database, perfetto per le liste dinamiche
                title={p.nome_profilo}
                badge={p.isActive ? "Ora attivo" : undefined}
                onClick={() => handleProfileSelect(p.id_profilo)}
                icon={
                  <Image 
                    src={p.avatar_url || "https://occ-0-2135-2581.1.nflxso.net/dnm/api/v6/SO2HoVCx33X8phZh2pZZmQ4QgNY/AAAABaEZAmr6k9h96-doKWxdUfUcAgUKY18xnhWDruqwhaEbG2bDAYjtd6pcIXvx9NzwJLfLbSJaMkqXp5prdK3PiDPvgtFoz6EMmA.png?r=229"} 
                    alt={p.nome_profilo} 
                    width={40} 
                    height={40} 
                    className="rounded" 
                  />
                }
              />
            ))
          )}
        </ul>
        
        {/* LOGICA DI BUSINESS SULLA UI: Limite dei 5 profili */}
        <div className="px-4 pb-5 pt-2">
          <button 
            // Disabilita fisicamente il bottone HTML se ci sono 5 o più profili
            disabled={profiles.length >= 5}
            
            // Cambia dinamicamente le classi CSS in base allo stesso limite, 
            // fornendo un feedback visivo (bottone grigio e cursore bloccato).
            className={`w-full py-3 font-semibold text-[16px] rounded-md transition-colors ${
              profiles.length >= 5 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-[#e6e6e6] hover:bg-[#d6d6d6] text-black'
            }`}
          >
            Aggiungi profilo
          </button>
          <p className="text-[13px] text-gray-600 mt-4 text-center">
            Aggiungi fino a 5 profili per chiunque viva con te.
          </p>
        </div>
      </div>
    </section>
  );
}