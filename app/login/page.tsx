"use client";

// HOOKS REACT
import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
// HOOKS DI NAVIGAZIONE (App Router):
// useRouter: Per le transizioni di pagina (router.push).
// useSearchParams: Per leggere le query string dall'URL
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

// Dichiarazione del Function Component principale ed esportazione
export default function LoginPage() {
  const router = useRouter(); // Per la navigazione programmatica
  const searchParams = useSearchParams(); // Per leggere i parametri della query string

  // STATI COMPLESSI E MULTIPLI:
  // Gestione step (macchina a stati semplificata).
  const [step, setStep] = useState<"identifier" | "otp">("identifier");

  // Inizializzazione: prende l'email dall'URL se esiste, altrimenti stringa vuota.
  const [emailPhone, setEmailPhone] = useState(searchParams.get("email") || "");

  // Array di stringhe per gestire i 4 quadrati del codice OTP in modo indipendente.
  const [otp, setOtp] = useState<string[]>(new Array(4).fill(""));

  // Stato per la gestione dell'espansione del menu di aiuto
  const [helpExpanded, setHelpExpanded] = useState(false);

  // Stato per la gestione dei messaggi di errore
  const [errorMessage, setErrorMessage] = useState("");

  // Stato per la gestione del caricamento (loading)
  const [isLoading, setIsLoading] = useState(false);

  // Invece di puntare a un singolo <div>, qui useRef memorizza un array di input HTML.
  // Servirà per spostare automaticamente il cursore (focus) da un quadratino all'altro.
  const inputRefs = useRef<HTMLInputElement[]>([]);

  // 1. Definiamo la funzione con useCallback 
  // useCallback "congela" la funzione in memoria.
  const handleIdentifierSubmit = useCallback(async (e: React.FormEvent | null, emailToUse?: string) => {
    if (e) e.preventDefault();  // Impedisce il refresh solo se invocata da un form HTML
    setErrorMessage("");  // Resetta il messaggio di errore prima di inviare la richiesta

    const targetEmail = emailToUse || emailPhone; // Usa l'email passata come argomento o quella dallo stato

    
    if (targetEmail.trim()) {
      setIsLoading(true); // Imposta lo stato di caricamento a true prima della chiamata API
      try {
        // Chiamata API standard verso le Route Handlers di Next.js
        const res = await fetch("/api/auth/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: targetEmail })
        });
        
        const data = await res.json(); // Parsing della risposta JSON
        
        if (res.ok && data.success) {  // Se la risposta è OK e il backend conferma il successo
          setEmailPhone(targetEmail); // Aggiorna lo stato con l'email valida
          setStep("otp");  // Passa allo step successivo per l'inserimento del codice OTP
        } else {
          setErrorMessage(data.error || "Si è verificato un errore."); 
        }
      } catch (err) {
        setErrorMessage("Errore di connessione al server."); 
      } finally {
        setIsLoading(false); // Reset dello stato di caricamento dopo la chiamata API
      }
    }
  }, [emailPhone]); // useCallback si aggiorna solo se cambia emailPhone

  // 2. Usiamo useEffect DOPO la dichiarazione della funzione
  useEffect(() => {
    const emailFromUrl = searchParams.get("email"); // Legge l'email dalla query string
    if (emailFromUrl) { 
      handleIdentifierSubmit(null, emailFromUrl); // Chiama la funzione di invio dell'email senza evento (null) e con l'email dalla query string
    }
  }, [searchParams, handleIdentifierSubmit]); // useEffect si attiva quando cambia searchParams o handleIdentifierSubmit

  // --- STEP 2: Verifica Codice OTP al Backend ---
  const verifyCode = async (completedOtp: string) => { // Funzione asincrona per verificare il codice OTP
    setErrorMessage(""); 
    try {
      const numericOtp = parseInt(completedOtp, 10); // Converte la stringa OTP in numero intero

      // Chiamata API verso la Route Handler di Next.js per verificare il codice OTP
      const res = await fetch("/api/auth/verify-otp", { 
        method: "POST",
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ email: emailPhone, otp: numericOtp }) 
      });

      const data = await res.json(); // Parsing della risposta JSON
      
      if (res.ok && data.success) { 
        router.push("/browse"); // Login completato, vai alla pagina di browse
      } else {
        setErrorMessage(data.error || "Codice non valido.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Errore di connessione al server.");
    }
  };

  // Gestione del cambio dei singoli quadrati OTP
  const handleOtpChange = (element: HTMLInputElement, index: number) => { 
    // Regex che forza l'utente a inserire solo numeri (rimuove lettere)
    const value = element.value.replace(/[^0-9]/g, ""); 
    if (!value) return;

    const newOtp = [...otp]; // Crea una copia dell'array OTP per aggiornare lo stato
    newOtp[index] = value.substring(value.length - 1); // Prende solo l'ultimo carattere inserito
    setOtp(newOtp); // Aggiorna lo stato con il nuovo array OTP

    // se non sono all'ultimo input, sposta il cursore al successivo
    if (index < 3 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }

    // Se sono all'ultimo quadratino, unisci i numeri e invia la richiesta
    if (index === 3) {
      const finalOtp = newOtp.join(""); 
      if (finalOtp.length === 4) {
        verifyCode(finalOtp); // Chiama la funzione per verificare il codice OTP al backend
      }
    }
  };

  // Gestione del tasto Backspace/Cancella nell'OTP
  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // se premo Backspace, svuoto il quadrato e torno al precedente
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      newOtp[index] = ""; 
      setOtp(newOtp); // Aggiorna lo stato con il nuovo array OTP svuotato

      if (index > 0 && inputRefs.current[index - 1]) { // Se non sono al primo input, sposta il cursore al precedente
        inputRefs.current[index - 1].focus(); // Sposta il focus al quadrato precedente
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
            <Image
              src="https://occ.a.nflxso.net/dnmt/api/v6/iL4oJVDYZ8KLSrJ6eG2OwtghbfQ/AAAAAVBEN9I57czDc_uW4ZnDTNTb9hWvK70hYAqf0VNv_dsufIxZqfNclKrp7ugn5j0DkKCYy_4ncEpi6fJk1wpPuLO61r5YUWiEbVjxFpCESIWdJwAAOvAX.svg" 
              alt="NETFLIX" 
              width={140}
              height={32}
              priority
              className="h-7 w-auto object-contain"
            />
          </Link>
        </div>
      </header>

      {/* 2. MAIN CONTENT */}
      <main className="flex-grow flex justify-center items-center py-12 px-4 relative z-10">
        <div className="w-full max-w-[440px]">
          
          {/* Rendering Condizionale Errore */}
          {errorMessage && (  
            <div className="bg-[#e87c03] text-white p-3 rounded mb-4 text-[14px]">
              {errorMessage} {/* Mostra il messaggio di errore se esiste */}
            </div>
          )}

          {/* Valuta lo stato 'step'. Se è "identifier", renderizza il primo blocco <>.
              Altrimenti (:), renderizza la schermata dell'OTP. */}
          {step === "identifier" ? (
            /* Schermata Inserisci i tuoi dati (email)*/
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

              <div className="w-full bg-[#333333]/90 rounded px-4 py-3.5 flex justify-between items-center mb-6">
                <span className="text-[16px] text-white font-medium truncate mr-2">
                  {emailPhone || "fabio0442@gmail.com"} {/*Mostra l'email o il numero di telefono inserito in precedenza*/}
                </span>
                <button 
                  onClick={() => {
                    setErrorMessage(""); 
                    setStep("identifier"); // Torna allo step precedente per modificare l'email
                  }}
                  className="text-white underline text-[14px] font-bold shrink-0 hover:text-gray-300 transition-colors"
                >
                  Modifica
                </button>
              </div>
                
              {/* Itera i 4 elementi vuoti dell'array 'otp'. */}
              <div className="flex gap-4 justify-start mb-5">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}  // L'utente non può digitare più di 1 carattere a livello HTML
                    value={data}
                    ref={(el) => { if (el) inputRefs.current[index] = el; }}  // Salva il riferimento dell'input nell'array di ref
                    onChange={(e) => handleOtpChange(e.target, index)} // Gestisce il cambio di valore dell'input
                    onKeyDown={(e) => handleOtpKeyDown(e, index)} // Gestisce il tasto Backspace
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
                  onClick={handleIdentifierSubmit}
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

            {/* se helpExpanded è true, mostra i link di aiuto */}
            {helpExpanded && ( // 
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