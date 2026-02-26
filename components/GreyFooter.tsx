"use client";

import React from 'react';

const NetflixGreyFooter = () => {
  const links = [
    { name: "Domande frequenti", href: "#" },
    { name: "Centro assistenza", href: "#" },
    { name: "Condizioni di utilizzo", href: "#" },
    { name: "Privacy", href: "#" },
    { name: "Preferenze per i cookie", href: "#" },
    { name: "Informazioni sull'azienda", href: "#" },
    { name: "Preferenze per la pubblicità", href: "#" },
  ];

  return (
    /* bg-[#f3f3f3] toglie la trasparenza e imposta il grigio Netflix */
    <footer className="w-full bg-[#f3f3f3] border-t border-[#e6e6e6] text-[#737373] py-8 z-10">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <p className="mb-6 text-base">
          Domande? Chiama il numero verde <a href="tel:800931413" className="hover:underline">800 931 413</a>
        </p>

        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-4 mb-8 text-[13px]">
          {links.map((link, idx) => (
            <li key={idx}>
              <a href={link.href} className="hover:underline">
                {link.name}
              </a>
            </li>
          ))}
        </ul>

        {/* Selettore Lingua Custom */}
        <div className="relative inline-block bg-white border border-[#b3b3b3] rounded">
            <div className="flex items-center px-2 py-3">
                <svg viewBox="0 0 16 16" width="16" height="16" className="fill-[#737373] mr-2">
                    <path d="M10.77 5.33 10.5 6 9.34 8.94l-.57 1.44L7.33 14h1.78l.73-1.97h3.58l.74 1.97H16l-3.43-8.67zm-.15 4.6-.24.63h2.51l-1.26-3.35zm-1.1-5.09.1-.19h-3.2V2h-1.5v2.65H.55V6h3.77A11 11 0 0 1 0 10.43c.33.28.81.8 1.05 1.16 1.5-.91 2.85-2.36 3.88-4.02v5.1h1.49V7.52q.6.95 1.33 1.8l.57-1.43a12 12 0 0 1-1.34-1.9h2.09z" />
                </svg>
                <select className="bg-transparent text-[#737373] text-sm outline-none appearance-none pr-8 cursor-pointer">
                    <option>Italiano</option>
                    <option>English</option>
                </select>
                <div className="absolute right-3 pointer-events-none">
                    <svg width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M11.6 6.5c.15 0 .22.18.12.28l-3.48 3.48a.33.33 0 0 1-.48 0L4.28 6.78a.17.17 0 0 1 .12-.28z" />
                    </svg>
                </div>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default NetflixGreyFooter;