"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const plans = [
  {
    id: "5200",
    name: "Standard con pubblicità",
    subtitle: "1080p",
    bgStyle: { backgroundColor: "#4f56cc" },
    features: [
      { label: "Quota mensile", value: "6,99 €" },
      { label: "Qualità audio e video", value: "Buona" },
      { label: "Risoluzione", value: "1080p (Full HD)" },
      { label: "Dispositivi supportati", value: "TV, computer, cellulare e tablet" },
      { label: "Dispositivi su cui il tuo nucleo domestico può guardare Netflix contemporaneamente", value: "2" },
      { label: "Dispositivi su cui sono consentiti i download", value: "2" },
      { label: "Pubblicità", value: "Meno di quanto potresti pensare" },
    ]
  },
  {
    id: "3088",
    name: "Standard",
    subtitle: "1080p",
    bgStyle: { background: "linear-gradient(135deg, #4f56cc 0%, #9d369e 100%)" },
    features: [
      { label: "Quota mensile", value: "13,99 €" },
      { label: "Qualità audio e video", value: "Buona" },
      { label: "Risoluzione", value: "1080p (Full HD)" },
      { label: "Dispositivi supportati", value: "TV, computer, cellulare e tablet" },
      { label: "Dispositivi su cui il tuo nucleo domestico può guardare Netflix contemporaneamente", value: "2" },
      { label: "Dispositivi su cui sono consentiti i download", value: "2" },
      { label: "Pubblicità", value: "Senza pubblicità" },
    ]
  },
  {
    id: "3108",
    name: "Premium",
    subtitle: "4K + HDR",
    bgStyle: { background: "linear-gradient(135deg, #4f56cc 0%, #9d369e 50%, #e50914 100%)" },
    features: [
      { label: "Quota mensile", value: "19,99 €" },
      { label: "Qualità audio e video", value: "Massima" },
      { label: "Risoluzione", value: "4K (Ultra HD) + HDR" },
      { label: "Audio spaziale (esperienza audio immersiva)", value: "Incluso" },
      { label: "Dispositivi supportati", value: "TV, computer, cellulare e tablet" },
      { label: "Dispositivi su cui il tuo nucleo domestico può guardare Netflix contemporaneamente", value: "4" },
      { label: "Dispositivi su cui sono consentiti i download", value: "6" },
      { label: "Pubblicità", value: "Senza pubblicità" },
    ]
  }
];

export default function RegisterPage() {
  // Aggiunto lo step "regform" per la creazione della password
  const [currentStep, setCurrentStep] = useState<"info" | "plans" | "accountSetup" | "regform">("info");
  
  // Stati per i dati dell'utente
  const [selectedPlanId, setSelectedPlanId] = useState("5200"); 
  const [email, setEmail] = useState(""); // In un'app reale potresti pre-compilarla dalla sessione
  const [password, setPassword] = useState("");
  const [specialOffers, setSpecialOffers] = useState(false);

  // Gestori della navigazione
  const handlePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep("accountSetup");
  };

  const handleAccountSetupSubmit = () => {
    setCurrentStep("regform");
  };

  const handleRegistrationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Dati di registrazione inviati:", { email, password, selectedPlanId, specialOffers });
    // Qui andrà la chiamata fetch al tuo backend Prisma per creare l'utente
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-[#333]">
      
      {/* HEADER */}
      <header className="w-full border-b border-gray-200 py-6 bg-white flex-shrink-0">
        <div className="max-w-[1000px] mx-auto px-4 flex justify-between items-center">
          <Link href="/">
            <Image
              src="https://occ.a.nflxso.net/dnmt/api/v6/iL4oJVDYZ8KLSrJ6eG2OwtghbfQ/AAAAAVBEN9I57czDc_uW4ZnDTNTb9hWvK70hYAqf0VNv_dsufIxZqfNclKrp7ugn5j0DkKCYy_4ncEpi6fJk1wpPuLO61r5YUWiEbVjxFpCESIWdJwAAOvAX.svg"
              alt="Netflix"
              width={140}
              height={32}
              priority
            />
          </Link>
          <Link href="/login" className="font-bold hover:underline text-lg">
            Accedi
          </Link>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-grow flex justify-center py-12 px-4 md:px-8">
        
        {/* --- STEP 1: INFORMATIVA --- */}
        {currentStep === "info" && (
          <div className="max-w-[340px] text-left flex flex-col space-y-6 mt-10">
            <div className="text-[#e50914]">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 48 48">
                <path fill="currentColor" fillRule="evenodd" d="M2 24C2 11.85 11.85 2 24 2s22 9.85 22 22-9.85 22-22 22S2 36.15 2 24M24 0C10.745 0 0 10.745 0 24s10.745 24 24 24 24-10.745 24-24S37.255 0 24 0m-2.293 30.707 12-12-1.414-1.414L21 28.586l-5.293-5.293-1.414 1.414 6 6 .707.707z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-[13px] font-medium text-gray-800 mb-1">Passaggio <b>1</b> di <b>3</b></p>
              <h1 className="text-3xl font-bold leading-tight">Scegli un piano</h1>
            </div>
            <ul className="space-y-4 mb-2">
              <li className="flex items-start gap-3 text-[18px]">
                <span className="text-[#e50914] font-bold mt-0.5">✓</span> Senza impegno, disdici quando vuoi.
              </li>
              <li className="flex items-start gap-3 text-[18px]">
                <span className="text-[#e50914] font-bold mt-0.5">✓</span> Un intrattenimento senza fine a un costo mensile ridotto.
              </li>
              <li className="flex items-start gap-3 text-[18px]">
                <span className="text-[#e50914] font-bold mt-0.5">✓</span> Guarda Netflix su tutti i tuoi dispositivi.
              </li>
            </ul>
            <button 
              onClick={() => setCurrentStep("plans")}
              className="w-full bg-[#e50914] text-white text-center py-4 rounded font-medium text-xl hover:bg-[#f6121d] transition-colors"
            >
              Avanti
            </button>
          </div>
        )}

        {/* --- STEP 2: SELEZIONE PIANI --- */}
        {currentStep === "plans" && (
          <div className="w-full max-w-[960px] flex flex-col">
            <div className="mb-6">
              <p className="text-[13px] text-gray-700 font-medium mb-1">Passaggio <b>1</b> di <b>3</b></p>
              <h1 className="text-3xl font-bold">Scegli il piano più adatto a te</h1>
            </div>

            <form onSubmit={handlePlanSubmit} className="flex flex-col">
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                {plans.map((plan) => {
                  const isSelected = selectedPlanId === plan.id;
                  
                  return (
                    <label 
                      key={plan.id}
                      htmlFor={`select-${plan.id}`}
                      className={`flex-1 relative border rounded-[14px] flex flex-col cursor-pointer transition-all duration-200 overflow-hidden ${
                        isSelected 
                          ? "border-[#737373] shadow-md ring-1 ring-[#737373]" 
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <input 
                        type="radio" 
                        id={`select-${plan.id}`} 
                        name="plan-select" 
                        value={plan.id}
                        checked={isSelected}
                        onChange={(e) => setSelectedPlanId(e.target.value)}
                        className="sr-only" 
                      />

                      <div className="relative w-full p-4 pb-6 text-white" style={plan.bgStyle}>
                        <span data-uia="plan-name" className="block text-[22px] font-bold leading-tight">
                          {plan.name}
                        </span>
                        <span className="block text-[15px] font-medium opacity-90 mt-1">
                          {plan.subtitle}
                        </span>
                        
                        {isSelected && (
                          <div className="absolute bottom-4 right-4">
                            <svg width="24" height="22" viewBox="0 0 24 22" fill="none">
                              <path fillRule="evenodd" clipRule="evenodd" d="M12.0183 21.0833C17.7761 21.0833 22.4438 16.5688 22.4438 11C22.4438 5.43112 17.7761 0.916656 12.0183 0.916656C6.26044 0.916656 1.59277 5.43112 1.59277 11C1.59277 16.5688 6.26044 21.0833 12.0183 21.0833ZM11.7407 14.3982L17.4273 8.89817L16.087 7.60181L11.0705 12.4536L8.89738 10.3518L7.55702 11.6482L10.4004 14.3982L11.0705 15.0463L11.7407 14.3982Z" fill="white" />
                            </svg>
                          </div>
                        )}
                      </div>

                      <div className="px-4 py-2 flex flex-col flex-grow bg-white">
                        {plan.features.map((feature, idx) => (
                          <div key={idx} className="py-[14px] border-b border-gray-200 last:border-0">
                            <div className="text-[13px] font-medium text-[#737373] leading-snug">{feature.label}</div>
                            <div className="text-[16px] font-bold text-[#333] mt-1">{feature.value}</div>
                          </div>
                        ))}
                      </div>
                    </label>
                  );
                })}
              </div>

              <div className="w-full text-left text-[13px] text-[#737373] space-y-4 mb-8">
                <p>
                  <Link href="https://help.netflix.com/node/126831" target="_blank" className="text-[#0071eb] hover:underline">Scopri di più sui piani con pubblicità</Link>. Se selezioni un piano con pubblicità, dovrai fornire la tua data di nascita per la personalizzazione della pubblicità e altre finalità previste dall&apos;<Link href="#" className="text-[#0071eb] hover:underline">Informativa sulla privacy</Link> di Netflix.
                </p>
                <p>
                  La disponibilità di Full HD (1080p), Ultra HD (4K) e HDR dipende dalla tua connessione Internet e dalle capacità del tuo dispositivo. Non tutti i contenuti sono disponibili in tutte le risoluzioni. Per ulteriori dettagli leggi le <Link href="https://help.netflix.com/legal/termsofuse" target="_blank" className="text-[#0071eb] hover:underline">Condizioni di utilizzo</Link>.
                </p>
                <p>
                  Solo chi vive con te può usare il tuo account. Aggiungi 1 utente extra con Standard o fino a 2 con Premium. <Link href="https://www.netflix.com/pricing" target="_blank" className="text-[#0071eb] hover:underline">Scopri di più</Link>. Guarda su 4 dispositivi diversi contemporaneamente con Premium e su 2 con Standard o Standard con pubblicità.
                </p>
                <p>
                  Gli eventi in diretta sono inclusi in ogni piano Netflix e contengono pubblicità.
                </p>
              </div>

              <div className="w-full flex justify-center">
                <button 
                  type="submit"
                  className="w-full max-w-[440px] bg-[#e50914] text-white text-center py-4 rounded font-bold text-xl hover:bg-[#f6121d] transition-colors"
                >
                  Avanti
                </button>
              </div>
            </form>
          </div>
        )}

        {/* --- STEP 3: ACCOUNT SETUP INTRO --- */}
        {currentStep === "accountSetup" && (
          <div className="max-w-[440px] w-full flex flex-col items-center mt-8 mb-12">
            <div className="mb-6 flex justify-center w-full">
              <svg viewBox="0 0 200 60" width="180" height="54" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g stroke="#e50914" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="25" width="44" height="28" rx="2" />
                  <path d="M2 55 L52 55" strokeWidth="3" />
                  <path d="M24 55 L30 55" strokeWidth="3" />
                  <rect x="62" y="10" width="60" height="38" rx="2" />
                  <path d="M92 48 L92 55" />
                  <path d="M82 55 L102 55" />
                  <rect x="135" y="20" width="26" height="35" rx="3" />
                  <circle cx="148" cy="50" r="1" />
                  <rect x="168" y="32" width="16" height="23" rx="2" />
                  <circle cx="176" cy="51" r="0.5" />
                </g>
              </svg>
            </div>
            <div className="w-full text-left px-4">
              <p className="text-[13px] text-gray-800 mb-2">Passaggio <b>2</b> di <b>3</b></p>
              <h1 className="text-[32px] font-bold leading-tight mb-3 text-gray-950 tracking-tight">
                Completa la configurazione dell&apos;account
              </h1>
              <p className="text-[16px] text-[#333] mb-6 leading-relaxed">
                Netflix è su misura per te. Crea una password per guardare quando vuoi, su qualsiasi dispositivo.
              </p>
            </div>
            <div className="w-full flex justify-center mt-2 px-4">
              <button 
                onClick={handleAccountSetupSubmit}
                className="w-full max-w-[340px] bg-[#e50914] text-white text-center py-3.5 rounded font-medium text-[17px] hover:bg-[#f6121d] transition-colors"
              >
                Avanti
              </button>
            </div>
          </div>
        )}

        {/* --- STEP 4: FORM DI REGISTRAZIONE (image_ebac89.png) --- */}
        {currentStep === "regform" && (
          <div className="max-w-[440px] w-full flex flex-col items-center mt-8 mb-12">
            <div className="w-full text-left">
              <p className="text-[13px] text-gray-800 mb-1">Passaggio <b>2</b> di <b>3</b></p>
              
              <h1 className="text-[32px] font-bold leading-tight mb-3 text-gray-950 tracking-tight">
                Crea una password per iniziare l&apos;abbonamento
              </h1>
              
              <div className="text-[18px] text-[#333] mb-6 leading-snug">
                <p>Mancano solo alcuni passaggi!</p>
                <p>Anche noi detestiamo la burocrazia.</p>
              </div>

              <form onSubmit={handleRegistrationSubmit} className="flex flex-col w-full">
                
                {/* Input Email con Bordo Verde per simulare la validazione */}
                <div className="relative w-full mb-4 bg-white rounded border border-[#2b9045] focus-within:ring-1 focus-within:ring-[#2b9045]">
                  <input
                    type="email"
                    id="regEmail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="block px-4 pb-2 pt-6 w-full text-[16px] text-gray-900 bg-transparent appearance-none focus:outline-none focus:ring-0 peer"
                    placeholder=" "
                  />
                  <label
                    htmlFor="regEmail"
                    className="absolute text-[15px] font-medium text-gray-500 duration-200 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:-translate-y-3"
                  >
                    Email
                  </label>
                </div>

                {/* Input Password con Bordo Grigio standard */}
                <div className="relative w-full bg-white rounded border border-gray-400 focus-within:ring-1 focus-within:ring-blue-600 focus-within:border-blue-600">
                  <input
                    type="password"
                    id="regPassword"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="block px-4 pb-2 pt-6 w-full text-[16px] text-gray-900 bg-transparent appearance-none focus:outline-none focus:ring-0 peer"
                    placeholder=" "
                  />
                  <label
                    htmlFor="regPassword"
                    className="absolute text-[15px] font-medium text-gray-500 duration-200 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:-translate-y-3"
                  >
                    Password
                  </label>
                </div>

                {/* Checkbox Offerte */}
                <label className="flex items-start gap-3 mt-4 mb-6 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={specialOffers}
                    onChange={(e) => setSpecialOffers(e.target.checked)}
                    className="w-[28px] h-[28px] border-gray-400 rounded-sm mt-0.5" 
                  />
                  <span className="text-[16px] text-[#333] pt-1">
                    Sì, inviatemi email con le offerte speciali di Netflix
                  </span>
                </label>

                {/* Pulsante Avanti a larghezza piena */}
                <button 
                  type="submit"
                  className="w-full bg-[#e50914] text-white text-center py-4 rounded font-bold text-xl hover:bg-[#f6121d] transition-colors"
                >
                  Avanti
                </button>

              </form>
            </div>
          </div>
        )}

      </main>
      
      {/* FOOTER */}
      <footer className="w-full bg-[#f3f3f3] text-[#737373] pt-12 pb-16 border-t border-[#e5e5e5] flex-shrink-0 mt-8">
        <div className="max-w-[1000px] mx-auto px-4 md:px-8">
          <p className="text-[16px] mb-8">
            Domande? Chiama il numero verde <a href="tel:800931413" className="hover:underline">800 931 413</a>
          </p>
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-y-3 gap-x-4 text-[13px] mb-8">
            <li><Link href="#" className="hover:underline">Domande frequenti</Link></li>
            <li><Link href="#" className="hover:underline">Centro assistenza</Link></li>
            <li><Link href="#" className="hover:underline">Condizioni di utilizzo</Link></li>
            <li><Link href="#" className="hover:underline">Privacy</Link></li>
            <li><Link href="#" className="hover:underline">Preferenze per i cookie</Link></li>
            <li><Link href="#" className="hover:underline">Informazioni sull&apos;azienda</Link></li>
            <li><Link href="#" className="hover:underline">Preferenze per la pubblicità</Link></li>
          </ul>
          <div className="relative inline-block border border-[#737373] rounded px-3 py-2 bg-white">
            <span className="text-sm mr-2">🌐</span>
            <select className="bg-transparent text-sm outline-none cursor-pointer appearance-none pr-4 text-[#333]">
              <option>Italiano</option>
              <option>English</option>
            </select>
          </div>
        </div>
      </footer>
    </div>
  );
}