"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";

export default function LoginPage() {
  // Stati per il controllo del flusso
  const [step, setStep] = useState<"identifier" | "otp">("identifier"); // "identifier" o "otp"
  const [emailPhone, setEmailPhone] = useState("");
  const [otp, setOtp] = useState<string[]>(new Array(4).fill(""));
  const [helpExpanded, setHelpExpanded] = useState(false);

  // Riferimenti per gli input del codice OTP
  const inputRefs = useRef<HTMLInputElement[]>([]);

  // Gestione dell'invio dell'identificativo (Step 1)
  const handleIdentifierSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailPhone.trim()) {
      setStep("otp");
    }
  };

  // Gestione del cambio dei singoli quadrati OTP
  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    const value = element.value.replace(/[^0-9]/g, ""); // Solo numeri
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1); // Prende solo l'ultimo carattere
    setOtp(newOtp);

    // Sposta il focus al campo successivo se compilato
    if (index < 3 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Gestione del tasto Backspace/Cancella nell'OTP
  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);

      // Sposta il focus al campo precedente
      if (index > 0 && inputRefs.current[index - 1]) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  return (
    <div 
      className="relative min-h-screen bg-cover bg-center font-sans flex flex-col justify-between"
      style={{
        backgroundImage: "url('https://occ-0-2907-2582.1.nflxso.net/dnm/api/v6/iMyKkw5SVrkCXbCfSBEb_Pjar5Y/AAAAQBTxE26zgLJoqZnmxUCfZtVJ2HbJUsVonZ_9Uo-pn68zarPK.png')"
      }}
    >
      
      {/* 1. HEADER */}
      <header className="w-full relative z-10 border-b border-white/10 py-5 bg-black/20 backdrop-blur-[1px]">
        <div className="max-w-[1024px] mx-auto px-4 sm:px-8">
          <Link href="/">
            <img 
              src="https://occ.a.nflxso.net/dnmt/api/v6/iL4oJVDYZ8KLSrJ6eG2OwtghbfQ/AAAAAVBEN9I57czDc_uW4ZnDTNTb9hWvK70hYAqf0VNv_dsufIxZqfNclKrp7ugn5j0DkKCYy_4ncEpi6fJk1wpPuLO61r5YUWiEbVjxFpCESIWdJwAAOvAX.svg" 
              alt="NETFLIX" 
              className="h-7 w-auto object-contain"
            />
          </Link>
        </div>
      </header>

      {/* 2. MAIN CONTENT */}
      <main className="flex-grow flex justify-center items-center py-12 px-4 relative z-10">
        <div className="w-full max-w-[440px]">
          
          {step === "identifier" ? (
            /* Schermata Inserisci i tuoi dati */
            <>
              <h1 className="text-[32px] font-bold tracking-tight text-white mb-2">
                Inserisci i tuoi dati per accedere
              </h1>
              <p className="text-[16px] text-[#a3a3a3] font-medium mb-6">
                Oppure crea un nuovo account.
              </p>

              <form onSubmit={handleIdentifierSubmit} className="flex flex-col gap-4">
                <div className="relative w-full bg-[#161616]/90 rounded border border-gray-600 focus-within:border-white transition-all">
                  <input
                    type="text"
                    id="userLoginId"
                    value={emailPhone}
                    onChange={(e) => setEmailPhone(e.target.value)}
                    required
                    className="w-full bg-transparent px-4 pt-6 pb-2 text-[16px] text-white outline-none placeholder-transparent peer"
                    placeholder=" "
                  />
                  <label 
                    htmlFor="userLoginId"
                    className="absolute left-4 top-4 text-gray-400 text-[16px] transition-all cursor-text pointer-events-none
                               peer-placeholder-shown:top-4 peer-placeholder-shown:text-[16px] 
                               peer-focus:top-1 peer-focus:text-[12px] 
                               peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:text-[12px]"
                  >
                    Indirizzo email o numero di cellulare
                  </label>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#e50914] text-white font-bold py-3.5 rounded text-[16px] transition-colors hover:bg-[#c40812] active:scale-[0.99]"
                >
                  Continua
                </button>
              </form>
            </>
          ) : (
            /* Schermata Inserisci codice OTP */
            <>
              <h1 className="text-[32px] font-bold tracking-tight text-white mb-6 leading-tight">
                Inserisci il codice che ti abbiamo inviato per email
              </h1>

              {/* Box riepilogo email con tasto Modifica */}
              <div className="w-full bg-[#333333]/90 rounded px-4 py-3.5 flex justify-between items-center mb-6">
                <span className="text-[16px] text-white font-medium truncate mr-2">
                  {emailPhone || "fabio0442@gmail.com"}
                </span>
                <button 
                  onClick={() => setStep("identifier")}
                  className="text-white underline text-[14px] font-bold shrink-0 hover:text-gray-300 transition-colors"
                >
                  Modifica
                </button>
              </div>

              {/* Rettangoli OTP (Altezza aumentata a h-20, larghezza mantenuta a w-14) */}
              <div className="flex gap-4 justify-start mb-5">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={data}
                    ref={(el) => { if (el) inputRefs.current[index] = el; }}
                    onChange={(e) => handleOtpChange(e.target, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                    className="w-14 h-20 bg-[#161616]/90 border border-gray-600 rounded text-center text-2xl font-bold text-white outline-none focus:border-white transition-all"
                  />
                ))}
              </div>

              <p className="text-[14px] text-[#a3a3a3] font-medium">
                Questo codice scadrà tra 15 minuti.
              </p>
              <p className="text-[14px] text-[#a3a3a3] font-medium mt-1">
                Non hai ricevuto un codice?{" "}
                <button 
                  onClick={() => console.log("Codice reinviato")}
                  className="text-white underline font-bold hover:text-gray-300"
                >
                  Reinvia il codice.
                </button>
              </p>
            </>
          )}

          {/* Chiedi Assistenza Dropdown */}
          <div className="mt-8">
            <button 
              onClick={() => setHelpExpanded(!helpExpanded)}
              className="flex items-center gap-1 text-white hover:underline text-[14px] font-medium"
            >
              <span>Chiedi assistenza</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="14" 
                height="14" 
                fill="none" 
                viewBox="0 0 16 16"
                className={`transition-transform duration-150 ${helpExpanded ? "rotate-180" : ""}`}
              >
                <path fill="currentColor" fillRule="evenodd" d="m7.999 10.437 5.468-5.468 1.06 1.06-5.998 6a.75.75 0 0 1-1.06 0l-6-6L2.53 4.97z" clipRule="evenodd" />
              </svg>
            </button>

            {helpExpanded && (
              <div className="mt-4 flex flex-col gap-3 pl-1">
                <Link href="/loginhelp" className="text-gray-400 underline text-[13px]">
                  Non ricordi l&apos;indirizzo email o il numero di cellulare?
                </Link>
                <Link href="https://help.netflix.com/node/311830241325668" target="_blank" className="text-gray-400 underline text-[13px]">
                  Scopri di più sull&apos;accesso
                </Link>
              </div>
            )}
          </div>

          <p className="text-[13px] text-[#737373] mt-8 leading-normal">
            Questa pagina è protetta da Google reCAPTCHA per garantire che tu non sia un bot.
          </p>
        </div>
      </main>

      {/* 3. FOOTER */}
      <footer className="w-full relative z-10 bg-black/60 backdrop-blur-[2px] text-[#737373] pt-12 pb-8 border-t border-white/10">
        <div className="max-w-[1024px] mx-auto px-4 sm:px-8">
          <p className="text-[16px] text-[#737373] mb-6">
            Domande? Chiama il numero verde 800 931 413
          </p>
          
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-4 text-[13px] mb-8">
            <li><Link href="https://help.netflix.com/support/412" className="underline hover:text-white">Domande frequenti</Link></li>
            <li><Link href="https://help.netflix.com" className="underline hover:text-white">Centro assistenza</Link></li>
            <li><Link href="https://help.netflix.com/legal/termsofuse" className="underline hover:text-white">Condizioni di utilizzo</Link></li>
            <li><Link href="https://help.netflix.com/legal/privacy" className="underline hover:text-white">Privacy</Link></li>
            <li><Link href="#" className="underline hover:text-white">Preferenze per i cookie</Link></li>
            <li><Link href="https://help.netflix.com/legal/corpinfo" className="underline hover:text-white">Informazioni sull&apos;azienda</Link></li>
            <li><Link href="https://netflix.com/adchoices" className="underline hover:text-white">Preferenze per la pubblicità</Link></li>
          </ul>

          <div className="inline-block relative">
            <select className="bg-black/80 border border-gray-600 text-white font-medium py-1.5 pl-8 pr-10 rounded text-sm outline-none appearance-none cursor-pointer">
              <option value="it-IT">Italiano</option>
              <option value="en-IT">English</option>
            </select>
            <div className="absolute left-2.5 top-2.5 text-gray-400 text-xs">🌐</div>
            <div className="absolute right-3 top-2.5 text-gray-400 text-xs pointer-events-none">▼</div>
          </div>
        </div>
      </footer>
    </div>
  );
}