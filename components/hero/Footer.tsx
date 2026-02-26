"use client";

import React, { useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';

const footerLinks = [
    { name: "Domande frequenti", href: "https://help.netflix.com/support/412" },
    { name: "Centro assistenza", href: "https://help.netflix.com/" },
    { name: "Account", href: "https://www.netflix.com/youraccount" },
    { name: "Media Center", href: "https://media.netflix.com/" },
    { name: "Rapporti con gli investitori", href: "http://ir.netflix.com/" },
    { name: "Opportunità di lavoro", href: "https://jobs.netflix.com/jobs" },
    { name: "Riscatta carte regalo", href: "https://www.netflix.com/redeem" },
    { name: "Acquista carte regalo", href: "https://www.netflix.com/gift-cards" },
    { name: "Come guardare Netflix", href: "https://www.netflix.com/watch" },
    { name: "Condizioni di utilizzo", href: "https://help.netflix.com/legal/termsofuse" },
    { name: "Privacy", href: "https://help.netflix.com/legal/privacy" },
    { name: "Preferenze per i cookie", href: "#" },
    { name: "Informazioni sull'azienda", href: "https://help.netflix.com/legal/corpinfo" },
    { name: "Contattaci", href: "https://help.netflix.com/contactus" },
    { name: "Test di velocità", href: "https://fast.com/" },
    { name: "Garanzia legale", href: "https://netflix.com/legal/guarantee" },
    { name: "Note legali", href: "https://help.netflix.com/legal/notices" },
    { name: "Solo su Netflix", href: "https://www.netflix.com/it/browse/genre/839338" },
    { name: "Preferenze per la pubblicità", href: "https://netflix.com/adchoices" },
];

const Footer = () => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <footer className={`bg-black text-[#b3b3b3] font-sans`}>
      <div className="max-w-[1920px] mx-auto">
        
        {/* Contatto */}
        <p className="mb-8 text-base">
          Domande? Chiama il numero <a href="tel:800931413" className="hover:underline">800 931 413</a>
        </p>

        {/* Griglia Link Iterata */}
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-4 mb-12 text-sm">
          {footerLinks.map((link, index) => (
            <li key={index}>
              <a href={link.href} className="hover:underline border-b border-transparent hover:border-[#b3b3b3] transition-all">
                {link.name}
              </a>
            </li>
          ))}
        </ul>

        {/* Selettore Lingua Custom */}
        <div className="relative inline-block mb-8">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-white">
            <Globe size={16} />
          </div>
          <select 
            className="appearance-none bg-black border border-[#333] text-white py-[6px] pl-10 pr-10 rounded text-sm focus:outline-none focus:ring-2 focus:ring-white transition-all cursor-pointer"
            defaultValue="it-IT"
          >
            <option value="it-IT">Italiano</option>
            <option value="en-IT">English</option>
          </select>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-white">
            <ChevronDown size={14} />
          </div>
        </div>

        {/* Info Paese */}
        <p className="text-sm mb-6 font-light">Netflix Italia</p>

        {/* ReCAPTCHA Box */}
        <div className="text-[13px] leading-tight text-[#8c8c8c] max-w-2xl font-light">
          <p>
            Questa pagina è protetta da Google reCAPTCHA per garantire che tu non sia un bot. 
            {!showDetails && (
              <button 
                onClick={() => setShowDetails(true)}
                className="text-[#0071eb] hover:underline ml-1 font-normal"
              >
                Scopri di più.
              </button>
            )}
          </p>
          
          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showDetails ? 'max-h-40 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
            <p>
              Le informazioni raccolte da Google reCAPTCHA sono soggette alle 
              <a href="https://policies.google.com/privacy" className="text-[#0071eb] hover:underline mx-1" target="_blank" rel="noreferrer">Norme sulla privacy</a> 
              e ai 
              <a href="https://policies.google.com/terms" className="text-[#0071eb] hover:underline mx-1" target="_blank" rel="noreferrer">Termini di servizio</a> 
              di Google e vengono utilizzate per fornire, mantenere e migliorare il servizio reCAPTCHA e per fini di sicurezza generale (non sono utilizzate per gli annunci personalizzati di Google).
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;