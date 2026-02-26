"use client";

import React from "react";
import Link from "next/link";

interface QuickLinkProps {
  label: string;
  description?: string;
  icon: React.ReactNode;
  href: string;
  isNew?: boolean;
}

const Panoramica: React.FC = () => {
  // Array di avatar estratti dai tuoi file precedenti
  const profileAvatars = [
    "https://occ-0-2582-2581.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABXh10ggeTTdhZO1JIH_SNQ4gp0vsNnWfE8Mg2ckwzGvUzJMRpPFCujRK3Ex5K9VbkIyvUHQ92LBVdsemkj6zlpquL-qWMCNKeg.png?r=229",
    "https://occ-0-2582-2581.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABZftBwbT4-e5tX3KSxQ-IGpnQvlM5c1ji_i0Y7VyQPCKKGcy54o4NtB0RsuVastMMQZ7BrloEDcRaRmpb0sbilINWmgj6xhMog.png?r=72f",
    "https://occ-0-2582-2581.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABRp8SIY8MrmT39ab3mMLfmQJXbqadfYfBgxgiHOicZRcQiKKGzofuF30ttGIfs16m6IJZESxa4-o-LToGAhonn69QkSRrfh1mg.png?r=558",
    "https://occ-0-2582-2581.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABZfS6J5Q5X1jnVdHwG36aDTG2T0Sb3MATAlNqmBvhEoMYR24UVT8DNuI7NSUJfpqm07Qg7Ma9BYF_eH-YevRSclAJOY2JHVOVQ.png?r=ec4"
  ];

  return (
    <section className="flex-1 min-w-0 pb-20">
      <div className="mb-2">
        <h1 className="text-[32px] font-bold text-black tracking-tight leading-tight">Account</h1>
        <p className="text-[14px] text-gray-600 mt-1 font-medium">Dettagli abbonamento</p>
      </div>

      <div className="flex flex-col gap-8 mt-4">
        {/* CARD 1: Dettagli abbonamento */}
        <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <div className="inline-block bg-linear-to-r from-[#3b49df] to-[#a338f1] text-white text-[12px] font-bold px-4 py-1 rounded-full mb-4 uppercase tracking-wide">
              Inizio abbonamento: gennaio 2026
            </div>
            <h3 className="text-[18px] font-bold text-black">Piano Standard</h3>
            <p className="text-[#737373] text-[14px] mt-1 font-medium">Prossimo pagamento: 28 febbraio 2026</p>
            <div className="flex items-center gap-2 mt-4">
              <img src="https://assets.nflxext.com/siteui/acquisition/payment/ffe/paymentpicker/PAYPAL.png" alt="PayPal" className="w-8 h-auto" />
              <span className="text-[14px] text-black">fa•••@gmail.com</span>
            </div>
          </div>
          <Link href="/account/membership" className="flex justify-between items-center p-5 border-t border-gray-100 hover:bg-gray-50 group transition-colors">
            <span className="text-[16px] font-bold text-black group-hover:underline">Gestisci abbonamento</span>
            <ChevronRightIcon />
          </Link>
        </div>

        {/* CARD 2: Link rapidi */}
        <div>
          <p className="text-[14px] text-gray-600 mb-3 font-medium">Link rapidi</p>
          <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
            <ul className="divide-y divide-gray-100">
              <QuickLink label="Modifica piano" href="/ChangePlan" icon={<MyPlanIcon />} />
              <QuickLink label="Gestisci metodo di pagamento" href="/managepayment" icon={<CreditCardIcon />} />
              <QuickLink 
                label="Acquista uno slot per utente extra" 
                description="Condividi Netflix con qualcuno che non abita con te."
                href="/addextramember" 
                isNew
                icon={<EnvelopeStarIcon />} 
              />
              <QuickLink label="Gestisci accessi e dispositivi" href="/manageaccountaccess" icon={<TvMobileIcon />} />
              <QuickLink label="Aggiorna la password" href="/password" icon={<LockIcon />} />
              <QuickLink label="Trasferisci un profilo" href="/profile/transfer" icon={<ProfileArrowIcon />} />
              <QuickLink label="Modifica filtro famiglia" href="/settings/restrictions" icon={<FamilyFilterIcon />} />
              <QuickLink 
                label="Modifica impostazioni" 
                description="Lingue, sottotitoli, riproduzione automatica, notifiche, privacy e altro"
                href="/settings/preferences" 
                icon={<SettingsIcon />} 
              />
            </ul>
          </div>
        </div>

        {/* CARD 3: Profili */}
        <Link href="/account/profiles" className="bg-white rounded-md shadow-sm border border-gray-200 p-5 flex justify-between items-center hover:bg-gray-50 transition-colors group">
          <div>
            <h3 className="text-[16px] font-bold text-black group-hover:underline">Gestisci i profili</h3>
            <p className="text-[#737373] text-[14px]">4 profili</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-1">
              {profileAvatars.map((src, i) => (
                <div key={i} className="w-8 h-8 rounded-sm overflow-hidden border border-white shadow-sm">
                  <img src={src} alt="avatar" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <ChevronRightIcon />
          </div>
        </Link>
      </div>
    </section>
  );
};

// Sotto-componente QuickLink
const QuickLink: React.FC<QuickLinkProps> = ({ label, description, icon, href, isNew }) => (
  <li>
    <Link href={href} className="flex items-center justify-between p-5 hover:bg-gray-50 group transition-colors">
      <div className="flex items-center gap-4">
        <div className="text-gray-900 w-6 flex justify-center shrink-0">{icon}</div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-bold text-black text-[16px] leading-tight group-hover:underline">{label}</span>
            {isNew && (
              <span className="bg-[#0071eb]/10 text-[#0071eb] text-[10px] px-2 py-0.5 rounded-sm font-bold border border-[#0071eb]/20 uppercase">
                Nuovo
              </span>
            )}
          </div>
          {description && <span className="text-gray-500 text-[13px] mt-1 leading-tight">{description}</span>}
        </div>
      </div>
      <ChevronRightIcon />
    </Link>
  </li>
);

// --- DEFINIZIONE ICONE MANCANTI ---
const ChevronRightIcon = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" className="text-gray-400 shrink-0"><path fill="currentColor" fillRule="evenodd" d="M10.437 8.002 4.97 2.532l1.06-1.06 6 6a.75.75 0 0 1 0 1.06l-6 5.999-1.06-1.06z" clipRule="evenodd" /></svg>
);
const FamilyFilterIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path fillRule="evenodd" d="m2.76 12 4.62 8h9.24l4.62-8-4.62-8H7.38zm-2.02-.5a1 1 0 0 0 0 1l5.2 9c.18.3.5.5.86.5h10.4a1 1 0 0 0 .86-.5l5.2-9a1 1 0 0 0 0-1l-5.2-9a1 1 0 0 0-.86-.5H6.8a1 1 0 0 0-.86.5zm12.76 4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-8.5h-3l.5 6h2z" clipRule="evenodd"/></svg>
);
const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path fillRule="evenodd" d="M10.5 0a2 2 0 0 0-1.98 1.7L8.2 3.84a9 9 0 0 0-1.37.8l-2-.8a2 2 0 0 0-2.47.86L.86 7.3a2 2 0 0 0 .48 2.56l1.7 1.35a9 9 0 0 0 0 1.58l-1.7 1.35a2 2 0 0 0-.48 2.56l1.5 2.6a2 2 0 0 0 2.46.86l2.01-.8a9 9 0 0 0 1.37.8l.32 2.14A2 2 0 0 0 10.5 24h3a2 2 0 0 0 1.98-1.7l.32-2.14q.72-.33 1.37-.8l2 .8a2 2 0 0 0 2.47-.86l1.5-2.6a2 2 0 0 0-.48-2.56l-1.7-1.35a9 9 0 0 0 0-1.58l1.7-1.35a2 2 0 0 0 .48-2.56l-1.5-2.6a2 2 0 0 0-2.46-.86l-2.01.8q-.65-.47-1.37-.8l-.32-2.14A2 2 0 0 0 13.5 0zM7.19 6.92A7 7 0 0 1 10 5.29L10.5 2h3l.5 3.29a7 7 0 0 1 2.81 1.63l3.1-1.22 1.5 2.6-2.6 2.07a7 7 0 0 1 0 3.26l2.6 2.07-1.5 2.6-3.1-1.22A7 7 0 0 1 14 18.71L13.5 22h-3l-.5-3.29a7 7 0 0 1-2.81-1.63l-3.1 1.22-1.5-2.6 2.6-2.07a7 7 0 0 1 0-3.26L2.6 8.3l1.5-2.6zM10 12a2 2 0 1 1 4 0 2 2 0 0 1-4 0m2-4a4 4 0 1 0 0 8 4 4 0 0 0 0-8" clipRule="evenodd"/></svg>
);
const MyPlanIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path fillRule="evenodd" d="M9 3H3v6h2V7c0-1.1.9-2 2-2h2zm-6 8h2v6c0 1.1.9 2 2 2h6v2c0 1.1.9 2 2 2h6a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-2V7a2 2 0 0 0-2-2h-6V3a2 2 0 0 0-2-2H3a2 2 0 0 0-2 2v6c0 1.1.9 2 2 2m12 10v-2h2a2 2 0 0 0 2-2v-2h2v6zm2-14H7v10h10zm-3.99 3.86L12 7.75l-1.01 3.1H7.72l2.65 1.93-1.02 3.11L12 13.97l2.64 1.92-1-3.1 2.64-1.93z" clipRule="evenodd"/></svg>
);
const CreditCardIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path fillRule="evenodd" d="M0 6a3 3 0 0 1 3-3h18a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3zm3-1a1 1 0 0 0-1 1v2h20V6a1 1 0 0 0-1-1zM2 18v-8h20v8a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1m14-2h4v-2h-4z" clipRule="evenodd"/></svg>
);
const EnvelopeStarIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path fillRule="evenodd" d="M0 22a1 1 0 0 0 1 1h22a1 1 0 0 0 1-1V9a1 1 0 0 0-.41-.8L13.18.61a2 2 0 0 0-2.36 0L.42 8.19A1 1 0 0 0 0 9zm2-1.96v-9.22l6.78 4.32zm2.09.96H19.9l-6.5-4.7-.87.54-.54.35-.54-.35-.86-.55zm11.13-5.86 6.78 4.9v-9.22zM12 14.8 2.78 8.94 12 2.24l9.22 6.7zm-1.5-5.46-.74 2.39a.1.1 0 0 0 .14.1l2.1-1.42 2.1 1.42a.1.1 0 0 0 .14-.1l-.74-2.4 1.8-1.32a.1.1 0 0 0-.05-.17q-1.12-.1-2.26-.13l-.9-2.47a.1.1 0 0 0-.18 0L11 7.72q-1.15.03-2.26.13a.1.1 0 0 0-.05.17z" clipRule="evenodd"/></svg>
);
const TvMobileIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path fillRule="evenodd" d="M0 3.73C0 2.77.77 2 1.73 2h18.54c.96 0 1.73.77 1.73 1.73V7h-2V4H2v10h11v2H1.73C.77 16 0 15.23 0 14.27zM13 17.3a73 73 0 0 0-8.07.12l.14 2A70 70 0 0 1 13 19.3zm9-6.3h-5v9h5zm-5-2a2 2 0 0 0-2 2v9c0 1.1.9 2 2 2h5a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2zm2.5 9.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5" clipRule="evenodd"/></svg>
);
const LockIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path fillRule="evenodd" d="M7 6a5 5 0 0 1 10 0v1h2a2 2 0 0 1 2 2v9.653a1.96 1.96 0 0 1-1.719 1.955C18.03 20.759 15.492 21 12 21s-6.029-.24-7.281-.392A1.96 1.96 0 0 1 3 18.653V9a2 2 0 0 1 2-2h2zm8 0v1H9V6a3 3 0 1 1 6 0M5 9v9.627c1.2.144 3.638.373 7 .373s5.8-.23 7-.373V9zm6 3v4h2v-4z" clipRule="evenodd"/></svg>
);
const ProfileArrowIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path fillRule="evenodd" d="M6 1a4 4 0 0 0-4 4v12a4 4 0 0 0 4 4h3.59l-1.3 1.3 1.42 1.4 3-3a1 1 0 0 0 0-1.4l-3-3-1.42 1.4L9.6 19H6a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3v2h3a4 4 0 0 0 4-4V5a4 4 0 0 0-4-4zm1.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M18 8.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m-1.6 3.7a5 5 0 0 1-2.9.8 5 5 0 0 1-2.9-.8l-1.2 1.6a7 7 0 0 0 4.1 1.2c1.58 0 3.07-.43 4.1-1.2z" clipRule="evenodd"/></svg>
);

export default Panoramica;