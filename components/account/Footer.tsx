"use client";

import Link from "next/link";

const Footer = () => {
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
    <footer className="w-full bg-[#f3f3f3] text-[#737373] py-12 border-t border-gray-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-8">
        
        {/* Intestazione con sottolineatura fissa */}
        <div className="mb-8">
          <p className="text-[16px]">
            Domande?{" "}
            <Link 
              href="https://help.netflix.com/contactus" 
              className="underline hover:text-black transition-colors"
            >
              Contattaci
            </Link>
          </p>
        </div>

        {/* Griglia Link - 'underline' rende la linea sempre visibile */}
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-3">
          {links.map((link, index) => (
            <li key={index} className="list-none">
              <Link 
                href={link.href} 
                className="text-[13px] underline hover:text-black leading-none inline-block text-[#737373]"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        
      </div>
    </footer>
  );
};

export default Footer;