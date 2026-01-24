import React from 'react';

const MemberFooter = () => {
  const footerLinks = [
    { name: 'Audiodescrizione', href: '/browse/audio-description' },
    { name: 'Centro assistenza', href: 'https://help.netflix.com/' },
    { name: 'Carte regalo', href: '/redeem' },
    { name: 'Media Center', href: 'https://media.netflix.com/' },
    { name: 'Rapporti con gli investitori', href: 'http://ir.netflix.com/' },
    { name: 'Opportunità di lavoro', href: 'https://jobs.netflix.com/' },
    { name: 'Condizioni di utilizzo', href: 'https://help.netflix.com/legal/termsofuse' },
    { name: 'Privacy', href: 'https://help.netflix.com/legal/privacy' },
    { name: 'Note legali', href: 'https://help.netflix.com/legal/notices' },
    { name: 'Preferenze per i cookie', href: '/Cookies' },
    { name: 'Informazioni sull\'azienda', href: 'https://help.netflix.com/legal/corpinfo' },
    { name: 'Contattaci', href: 'https://help.netflix.com/contactus' },
    { name: 'Preferenze per la pubblicità', href: 'https://netflix.com/adchoices' },
  ];

  return (
    <footer className=" text-[#808080] py-12 px-8 md:px-24 lg:px-64 font-sans select-none">
      <div className="max-w-5xl mx-auto">
        
        {/* Social Links */}
        <div className="flex gap-7 mb-8 text-white">
          <a href="https://www.facebook.com/Netflixitalia" target="_blank" aria-label="facebook" className="hover:text-white transition">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M13.99 13.16v8.82h-3.95v-8.82h-3.2V9.51h3.2V6.73c0-3.16 1.9-4.91 4.78-4.91q1.42.02 2.82.25v3.1h-1.6A1.82 1.82 0 0 0 14 7.15V9.5h3.5l-.56 3.65z"/></svg>
          </a>
          <a href="https://www.instagram.com/NetflixIT" target="_blank" aria-label="instagram" className="hover:text-white transition">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M21.93 16.123a5.96 5.96 0 0 1-1.615 4.189 5.9 5.9 0 0 1-4.19 1.615c-1.651.094-6.6.094-8.25 0a5.96 5.96 0 0 1-4.19-1.615 5.92 5.92 0 0 1-1.615-4.189c-.093-1.651-.093-6.6 0-8.25a5.94 5.94 0 0 1 1.615-4.19 5.95 5.95 0 0 1 4.19-1.61c1.651-.094 6.6-.094 8.25 0a5.96 5.96 0 0 1 4.19 1.615 5.92 5.92 0 0 1 1.615-4.189c.093 1.651.093 6.595 0 8.246M20.2 12c0-1.455.12-4.578-.4-5.894a3.37 3.37 0 0 0-1.9-1.9c-1.312-.517-4.439-.4-5.894-.4s-4.578-.121-5.894.4a3.38 3.38 0 0 0-1.9 1.9c-.517 1.312-.4 4.439-.4 5.894s-.121 4.578.4 5.894a3.38 3.38 0 0 0 1.9 1.9c1.312.517 4.44.4 5.894.4s4.578.121 5.894-.4a3.38 3.38 0 0 0 1.9-1.9c.519-1.312.4-4.439.4-5.894m-3.07 0A5.127 5.127 0 1 1 12 6.873 5.12 5.12 0 0 1 17.129 12zm-1.794 0a3.333 3.333 0 1 0-6.664 0 3.333 3.333 0 0 0 6.663 0zm2-4.141a1.2 1.2 0 1 1 1.2-1.2 1.193 1.193 0 0 1-1.197 1.2z"/></svg>
          </a>
          <a href="https://twitter.com/NetflixIT" target="_blank" aria-label="twitter" className="hover:text-white transition">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M20.77 8.2A12.65 12.65 0 0 1 8.03 20.96c-2.44 0-4.83-.7-6.88-2.01q.54.06 1.08.05a9 9 0 0 0 5.56-1.91 4.5 4.5 0 0 1-4.19-3.1q.42.06.85.06.6 0 1.17-.15a4.5 4.5 0 0 1-3.58-4.4v-.06a4.5 4.5 0 0 0 2.02.57 4.5 4.5 0 0 1-1.38-5.99c2.27 2.8 5.63 4.5 9.23 4.69a4.48 4.48 0 0 1 7.64-4.09q1.51-.3 2.84-1.08A4.5 4.5 0 0 1 20.42 6q1.34-.15 2.58-.69a10 10 0 0 1-2.25 2.32q.02.28.02.58"/></svg>
          </a>
          <a href="https://www.youtube.com/channel/UCi_T2R1AzOCun4-PI4Or2ng" target="_blank" aria-label="youtube" className="hover:text-white transition">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M22.54 6.67c-.25-.95-1-1.7-1.94-1.96-1.72-.46-8.6-.46-8.6-.46s-6.88 0-8.6.46c-.95.26-1.69 1-1.94 1.96A29 29 0 0 0 1 12q-.02 2.69.46 5.33c.25.95 1 1.7 1.94 1.96 1.72.46 8.6.46 8.6.46s6.89 0 8.6-.46c.95-.26 1.69-1 1.94-1.96q.48-2.64.46-5.33.02-2.69-.46-5.33m-12.79 8.6V8.73L15.5 12z"/></svg>
          </a>
        </div>

        {/* Links Grid */}
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-4 gap-x-8 mb-10 text-[13px]">
          {footerLinks.map((link, index) => (
            <li key={index}>
              <a href={link.href} className="hover:underline">
                {link.name}
              </a>
            </li>
          ))}
        </ul>


        {/* Copyright */}
        <div className="text-[11px]">
          <span>© 1997-2026 Netflix, Inc.‎</span>
        </div>
      </div>
    </footer>
  );
};

export default MemberFooter;