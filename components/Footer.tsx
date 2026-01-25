import React from 'react';

const Footer = () => {
  const links = [
    { name: 'Domande frequenti', href: 'https://help.netflix.com/support/412' },
    { name: 'Centro assistenza', href: 'https://help.netflix.com/' },
    { name: 'Account', href: 'https://www.netflix.com/youraccount' },
    { name: 'Media Center', href: 'https://media.netflix.com/' },
    { name: 'Rapporti con gli investitori', href: 'http://ir.netflix.com/' },
    { name: 'Opportunità di lavoro', href: 'https://jobs.netflix.com/jobs' },
    { name: 'Riscatta carte regalo', href: 'https://www.netflix.com/redeem' },
    { name: 'Acquista carte regalo', href: 'https://www.netflix.com/gift-cards' },
    { name: 'Come guardare Netflix', href: 'https://www.netflix.com/watch' },
    { name: 'Condizioni di utilizzo', href: 'https://help.netflix.com/legal/termsofuse' },
    { name: 'Privacy', href: 'https://help.netflix.com/legal/privacy' },
    { name: 'Preferenze per i cookie', href: '#' },
    { name: 'Informazioni sull\'azienda', href: 'https://help.netflix.com/legal/corpinfo' },
    { name: 'Contattaci', href: 'https://help.netflix.com/contactus' },
    { name: 'Test di velocità', href: 'https://fast.com/' },
    { name: 'Garanzia legale', href: 'https://netflix.com/legal/guarantee' },
    { name: 'Note legali', href: 'https://help.netflix.com/legal/notices' },
    { name: 'Solo su Netflix', href: 'https://www.netflix.com/it/browse/genre/839338' },
    { name: 'Preferenze per la pubblicità', href: 'https://netflix.com/adchoices' },
  ];

  return (
    <footer className="w-full bg-black text-[#b3b3b3] py-12 px-6 md:px-20 lg:px-40">
      <div className="max-w-6xl mx-auto">
        {/* Numero di telefono */}
        <p className="mb-8 hover:underline cursor-pointer">
          Domande? Chiama il numero <a href="tel:800931413">800 931 413</a>
        </p>

        {/* Griglia dei Link */}
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-sm">
          {links.map((link, index) => (
            <li key={index}>
              <a href={link.href} className="hover:underline underline-offset-2">
                {link.name}
              </a>
            </li>
          ))}
        </ul>

        {/* Selettore lingua */}
        <div className="mt-10 relative inline-block group">
        {/* Label per accessibilità */}
        <label htmlFor="language-picker" className="sr-only">Seleziona lingua</label>
        
        {/* Icona a sinistra */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10 text-white">
            <svg viewBox="0 0 16 16" width="16" height="16" data-icon="LanguagesSmall" data-icon-id=":R8pbamklaqlqp7:" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" role="img">
                <path fill="currentColor" fillRule="evenodd" d="M10.77 5.33 10.5 6 9.34 8.94l-.57 1.44L7.33 14h1.78l.73-1.97h3.58l.74 1.97H16l-3.43-8.67zm-.15 4.6-.24.63h2.51l-1.26-3.35zm-1.1-5.09.1-.19h-3.2V2h-1.5v2.65H.55V6h3.77A11 11 0 0 1 0 10.43c.33.28.81.8 1.05 1.16 1.5-.91 2.85-2.36 3.88-4.02v5.1h1.49V7.52q.6.95 1.33 1.8l.57-1.43a12 12 0 0 1-1.34-1.9h2.09z" clipRule="evenodd"></path>
            </svg>
        </div>

        {/* Il Select */}
        <select 
            id="language-picker"
            name="LanguageSelect"
            className="bg-black/50 border border-gray-600 text-white text-sm font-medium py-1.5 pl-9 pr-8 rounded appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-white w-full"
            defaultValue="it-IT"
        >
            <option value="it-IT">Italiano</option>
            <option value="en-IT">English</option>
        </select>

        {/* Icona Freccia Down (Destra) */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none z-10 text-white">
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none">
            <path 
                fill="currentColor" 
                fillRule="evenodd" 
                d="M11.6 6.5c.15 0 .22.18.12.28l-3.48 3.48a.33.33 0 0 1-.48 0L4.28 6.78a.17.17 0 0 1 .12-.28z" 
                clipRule="evenodd"
            />
            </svg>
        </div>
        </div>
        {/* Brand e Info Legali */}
        <p className="mt-8 text-sm">Netflix Italia</p>
        
        <div className="mt-6 text-[13px] leading-tight max-w-2xl">
          <p>
            Questa pagina è protetta da Google reCAPTCHA per garantire che tu non sia un bot. 
            <button className="text-blue-600 hover:underline ml-1">Scopri di più.</button>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;