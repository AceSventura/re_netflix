"use client";

import React from "react";
import Link from "next/link";

// Definiamo l'interfaccia per le props delle azioni (i link nelle card)
interface MembershipActionProps {
  label: string;
  description?: string;
  href: string;
  isNew?: boolean;
}

const Membership: React.FC = () => {
  return (
    <section className="flex-1 min-w-0">
      {/* Intestazione */}
      <div className="mb-2">
        <h1 className="text-[32px] font-bold text-black tracking-tight">Abbonamento</h1>
        <p className="text-[14px] text-gray-600 mt-1 font-medium">Dettagli piano</p>
      </div>

      <div className="flex flex-col gap-8 mt-4">
        {/* CARD 1: Dettagli piano con linea viola superiore */}
        <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden relative">
          {/* Linea di accento viola come da screenshot */}
          <div className="absolute top-0 left-0 right-0 h-1[4px] bg-[#a338f1]" />
          
          <div className="p-6 pb-4">
            <h3 className="text-[16px] font-bold text-black">Piano Standard</h3>
            <p className="text-[#737373] text-[14px] mt-1">
              Risoluzione video 1080p, visione senza pubblicità e molto altro.
            </p>
          </div>

          <ul className="divide-y divide-gray-100 border-t border-gray-100">
            <MembershipAction label="Modifica piano" href="/account/change-plan" />
            <MembershipAction 
              label="Acquista uno slot per utente extra" 
              description="Condividi Netflix con qualcuno che non abita con te."
              isNew
              href="/account/add-extra-member" 
            />
          </ul>
        </div>

        {/* CARD 2: Dati di pagamento */}
        <div>
          <p className="text-[14px] text-gray-600 mb-3 font-medium">Dati di pagamento</p>
          <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <h3 className="text-[16px] font-bold text-black">Prossimo pagamento</h3>
              <p className="text-black text-[14px] mt-1 font-medium">28 febbraio 2026</p>
              
              <div className="flex items-center gap-2 mt-3">
                <img 
                  src="https://assets.nflxext.com/siteui/acquisition/payment/ffe/paymentpicker/PAYPAL.png" 
                  alt="PayPal" 
                  className="w-8 h-auto object-contain"
                />
                <span className="text-[14px] text-black">fa•••@gmail.com</span>
              </div>
            </div>

            <ul className="divide-y divide-gray-100 border-t border-gray-100">
              <MembershipAction label="Gestisci metodo di pagamento" href="/account/manage-payment" />
              <MembershipAction label="Riscatta codice regalo o promozionale" href="/redeem" />
              <MembershipAction label="Visualizza cronologia dei pagamenti" href="/account/billing-activity" />
            </ul>
          </div>
        </div>

        {/* Bottone Disdici Abbonamento */}
        <div className="mt-2 w-full">
          <button className="w-full bg-white border border-gray-300 text-[#e50914] py-3 font-semibold rounded hover:bg-gray-50 transition-all text-[16px] shadow-sm active:scale-[0.98]">
            Disdici abbonamento
          </button>
        </div>
      </div>
    </section>
  );
};

// Componente per le righe d'azione tipizzato correttamente
const MembershipAction: React.FC<MembershipActionProps> = ({ 
  label, 
  description, 
  href, 
  isNew 
}) => (
  <li>
    <Link 
      href={href} 
      className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors group"
    >
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="font-bold text-black text-[16px] leading-tight group-hover:underline">
            {label}
          </span>
          {isNew && (
            <span className="bg-[#0071eb]/10 text-[#0071eb] text-[10px] px-2 py-0.5 rounded-sm font-bold uppercase tracking-wider border border-[#0071eb]/20">
              Nuovo
            </span>
          )}
        </div>
        {description && (
          <span className="text-gray-500 text-[13px] mt-1 leading-normal">
            {description}
          </span>
        )}
      </div>
      
      {/* Icona Chevron originale estratta dal tuo codice */}
      <svg 
        viewBox="0 0 16 16" 
        width="16" 
        height="16" 
        className="text-gray-400 group-hover:text-black transition-colors"
      >
        <path 
          fill="currentColor" 
          fillRule="evenodd" 
          d="M10.437 8.002 4.97 2.532l1.06-1.06 6 6a.75.75 0 0 1 0 1.06l-6 5.999-1.06-1.06z" 
          clipRule="evenodd" 
        />
      </svg>
    </Link>
  </li>
);

export default Membership;