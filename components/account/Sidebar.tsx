"use client";

import Link from "next/link";

// HOOK DI NAVIGAZIONE
import { usePathname } from "next/navigation";

// Dichiarazione del Function Component principale ed esportazione
export default function Sidebar() {

  // ESECUZIONE DELL'HOOK: 
  // pathname conterrà una stringa con il percorso attuale.
  // Ogni volta che l'utente naviga e l'URL cambia, questo hook forza un re-render del componente.
  const pathname = usePathname();

  // Array statico di oggetti. Rende il menu scalabile. 
  const menuItems = [
    { label: "Panoramica", href: "/account" },
    { label: "Abbonamento", href: "/account/membership" },
    { label: "Sicurezza", href: "/account/security" },
    { label: "Dispositivi", href: "/account/devices" },
    { label: "Profili", href: "/account/profiles" },
  ];

  return (
    // HTML SEMANTICO: Uso del tag <nav> specifico per i blocchi di navigazione.
    <nav className="flex flex-col gap-6">

      {/* Bottone Indietro */}
      <Link href="/browse" className="flex items-center gap-2 text-sm text-gray-700 hover:underline transition-all">
        <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
          <path fillRule="evenodd" d="M4.81 8.747h9.187v-1.5H4.81L7.529 4.53 6.47 3.469l-4 3.998a.75.75 0 0 0 0 1.06l4 4.001 1.06-1.06z" clipRule="evenodd" />
        </svg>
        Torna su Netflix
      </Link>

      {/* Lista Link */}
      <ul className="flex flex-col gap-1">
        {menuItems.map((item) => {
          
          // Verifica se l'URL attuale del browser combacia esattamente con l'href del link iterato.
          // Restituisce un booleano (true/false) che verrà usato per il rendering condizionale delle classi.
          const isActive = pathname === item.href;
          
          return (
            // Qui usiamo 'item.href' invece dell'indice. 
            // Essendo gli URL per natura univoci all'interno di un menu, sono perfetti come chiavi.
            <li key={item.href}>
              <Link
                href={item.href}

                // TEMPLATE LITERALS PER CLASSI DINAMICHE:
                // La sintassi {` stringa statica ${condizione ? 'se vero' : 'se falso'} `}
                // permette di innescare l'UI attiva (sfondo bianco, testo nero grassetto) 
                // solo per la voce di menu corrispondente alla pagina in cui si trova l'utente.
                className={`flex items-center gap-3 py-3 px-4 text-[15px] transition-all rounded-md ${
                  isActive
                    ? "bg-white shadow-sm font-bold text-black"
                    : "text-gray-500 hover:text-black hover:bg-gray-200/50"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}