"use client";

import NetflixGreyFooter from '@/components/GreyFooter';

export default function SignupPasswordPage() {
  return (
    /* bg-white assicura che il corpo pagina sia bianco, tipico del setup */
    <div className="flex flex-col min-h-screen bg-white">
      
      {/* Header Bianco con Logo Rosso */}
      <header className="flex items-center justify-between px-6 py-5 border-b border-[#e6e6e6]">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" 
            alt="Netflix" 
            className="w-24 md:w-40"
          />
          <a href="/login" className="text-black font-bold hover:underline">Accedi</a>
      </header>

      {/* Sezione Centrale - Occupa tutto lo spazio libero con flex-grow */}
      <main className="flex-grow flex flex-col items-center pt-10 md:pt-20 px-6 pb-20">
          <div className="w-full max-w-[440px] text-black text-left">
              {/* Qui inserisci il tuo form password passaggio 1 di 3 */}
              <span className="uppercase text-xs tracking-tight">Passaggio 1 di 3</span>
              <h1 className="text-3xl font-bold mt-2">Piacere di rivederti!</h1>
              {/* ... resto del contenuto ... */}
          </div>
      </main>

      {/* Footer Grigio (ora solido e sul fondo grazie a flex-grow sopra) */}
      <NetflixGreyFooter />
      
    </div>
  );
}