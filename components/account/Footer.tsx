"use client";

import Link from "next/link";

const Footer = () => {
  // L'estrazione dei dati in un array di oggetti è una best practice React.
  // Rende il codice DRY (Don't Repeat Yourself) e facilita futuri aggiornamenti
  // o l'eventuale fetch di queste voci da un CMS headless.
  const links = [
    { label: "Rapporti con gli investitori", href: "https://ir.netflix.com/" },
    { label: "Media Center", href: "https://media.netflix.com/" },
    { label: "Opportunità di lavoro", href: "https://jobs.netflix.com/" },
    { label: "Preferenze per i cookie", href: "https://netflix.com/Cookies" },
    { label: "Condizioni di utilizzo", href: "https://help.netflix.com/legal/termsofuse" },
    { label: "Informativa sulla privacy", href: "https://help.netflix.com/legal/privacy" },
    { label: "Audio e sottotitoli", href: "https://www.netflix.com/browse/subtitles" },
    { label: "Centro assistenza", href: "https://help.netflix.com/" },
    { label: "Carte regalo", href: "https://www.netflix.com/redeem" },
    { label: "Preferenze per la pubblicità", href: "https://netflix.com/adchoices" },
  ];

  return (
    // SEMANTICA HTML: Uso corretto del tag <footer> per l'accessibilità.
    // border-t: Aggiunge una linea di separazione netta con il blocco <main> superiore.
    <footer className="w-full bg-[#f3f3f3] text-[#737373] py-12 border-t border-gray-200">

      {/* GABBIA DI LAYOUT: max-w-5xl allinea il footer alla larghezza massima (1024px)*/}
      <div className="max-w-5xl mx-auto px-4 sm:px-8">
        
        {/* Intestazione con sottolineatura fissa */}
        <div className="mb-8">
          <p className="text-[16px]">
            Domande?{" "}

            {/*COMPORTAMENTO NEXT LINK CON URL ASSOLUTI*/}
            <Link 
              href="https://help.netflix.com/contactus" 
              className="underline hover:text-black transition-colors"
            >
              Contattaci
            </Link>
          </p>
        </div>

        {/*CSS GRID RESPONSIVE: qui si usa Grid.
            - grid-cols-2: Su schermi piccoli (mobile) crea una griglia a 2 colonne.
            - md:grid-cols-4: Dal breakpoint tablet/desktop passa automaticamente a 4 colonne.
            - gap-y/gap-x: Gestisce in modo pulito la spaziatura verticale e orizzontale tra gli item. */}
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-3">

          {/*LIST RENDERING (React.map):
              Iterazione dell'array 'links' per generare i tag <li> dinamicamente. */}
          {links.map((link, index) => (
            // Usare l'indice (index) come key è accettabile qui perché 
            // la lista è statica (non viene riordinata o filtrata dall'utente). 
            // In liste dinamiche, servirebbe un ID univoco (es. link.id).
            <li key={index} className="list-none">
              <Link 
                href={link.href} 
                className="text-[13px] underline hover:text-black leading-none inline-block text-[#737373]"
              >
                {link.label} {/* Mostra il testo della voce di menu */}
              </Link>
            </li>
          ))}
        </ul>

        
      </div>
    </footer>
  );
};

export default Footer;