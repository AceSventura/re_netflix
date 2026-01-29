"use client";

import Image from "next/image";

const Panoramica = () => {
  return (
    <div className="flex flex-col gap-8">
      {/* Titolo Principale */}
      <h1 className="text-[32px] font-bold text-black tracking-tight">Account</h1>

      {/* CARD 1: Dettagli abbonamento */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <h2 className="px-6 py-4 text-[16px] font-bold text-[#737373] border-b border-gray-100">
          Dettagli abbonamento
        </h2>
        
        <div className="p-6">
          {/* Banner con Gradiente Netflix */}
          <div className="inline-block bg-gradient-to-r from-[#3b49df] to-[#a338f1] text-white text-[12px] font-bold px-4 py-1 rounded-full mb-4">
            Inizio abbonamento: gennaio 2026
          </div>
          
          <div className="mb-6">
            <h3 className="text-[20px] font-bold text-black">Piano Standard</h3>
            <p className="text-[#737373] text-[14px]">Prossimo pagamento: 28 febbraio 2026</p>
            
            {/* Metodo di Pagamento */}
            <div className="flex items-center gap-2 mt-4">
              <img
                src="https://assets.nflxext.com/siteui/acquisition/payment/ffe/paymentpicker/PAYPAL.png" 
                alt="PayPal" 
                className="w-8 h-5 object-contain"
              />
              <span className="text-[14px] text-black">fa•••@gmail.com</span>
            </div>
          </div>

          {/* Bottone Gestione */}
          <button className="w-full flex justify-between items-center py-4 border-t border-gray-100 hover:bg-gray-50 transition-colors group">
            <span className="text-[16px] font-medium text-black">Gestisci abbonamento</span>
            <ChevronRightIcon />
          </button>
        </div>
      </div>

      {/* CARD 2: Link Rapidi */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <h2 className="px-6 py-4 text-[16px] font-bold text-[#737373] border-b border-gray-100">
          Link rapidi
        </h2>
        <ul className="divide-y divide-gray-100">
          <QuickLinkItem label="Modifica piano" icon={<MyPlanIcon />} />
          <QuickLinkItem label="Gestisci metodo di pagamento" icon={<CreditCardIcon />} />
          <QuickLinkItem label="Acquista uno slot per utente extra" icon={<EnvelopeStarIcon />} isNew />
          <QuickLinkItem label="Gestisci accessi e dispositivi" icon={<TvMobileIcon />} />
        </ul>
      </div>

      {/* CARD 3: Gestione Profili */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex justify-between items-center hover:bg-gray-50 cursor-pointer transition-colors group">
        <div>
          <h3 className="text-[18px] font-bold text-black">Gestisci i profili</h3>
          <p className="text-[#737373] text-[14px]">4 profili</p>
        </div>
        
        {/* Lista Avatar Sovrapposti */}
        <div className="flex items-center">
          <div className="flex -space-x-1 mr-4">
            <ProfileAvatar src="https://occ-0-2582-2581.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABXh10ggeTTdhZO1JIH_SNQ4gp0vsNnWfE8Mg2ckwzGvUzJMRpPFCujRK3Ex5K9VbkIyvUHQ92LBVdsemkj6zlpquL-qWMCNKeg.png?r=229" />
            <ProfileAvatar src="https://occ-0-2582-2581.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABZftBwbT4-e5tX3KSxQ-IGpnQvlM5c1ji_i0Y7VyQPCKKGcy54o4NtB0RsuVastMMQZ7BrloEDcRaRmpb0sbilINWmgj6xhMog.png?r=72f" />
            <ProfileAvatar src="https://occ-0-2582-2581.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABRp8SIY8MrmT39ab3mMLfmQJXbqadfYfBgxgiHOicZRcQiKKGzofuF30ttGIfs16m6IJZESxa4-o-LToGAhonn69QkSRrfh1mg.png?r=558" />
            <ProfileAvatar src="https://occ-0-2582-2581.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABZfS6J5Q5X1jnVdHwG36aDTG2T0Sb3MATAlNqmBvhEoMYR24UVT8DNuI7NSUJfpqm07Qg7Ma9BYF_eH-YevRSclAJOY2JHVOVQ.png?r=ec4" />
          </div>
          <ChevronRightIcon />
        </div>
      </div>
    </div>
  );
};

// --- SOTTO-COMPONENTI ---

const QuickLinkItem = ({ label, icon, isNew }: { label: string; icon: React.ReactNode; isNew?: boolean }) => (
  <li className="flex justify-between items-center p-5 hover:bg-gray-50 cursor-pointer transition-colors group">
    <div className="flex items-center gap-4">
      <div className="text-gray-900">{icon}</div>
      <span className="text-[16px] font-medium text-black">{label}</span>
      {isNew && (
        <span className="bg-[#0071eb] text-white text-[10px] px-2 py-0.5 rounded-sm font-bold uppercase tracking-wider ml-1">
          Nuovo
        </span>
      )}
    </div>
    <ChevronRightIcon />
  </li>
);

const ProfileAvatar = ({ src }: { src: string }) => (
  <div className="w-8 h-8 relative rounded-sm overflow-hidden border border-gray-100 shadow-sm">
    <img src={src} alt="Profile" className="object-cover" />
  </div>
);

const ChevronRightIcon = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" className="text-gray-400 group-hover:text-black transition-colors">
    <path fill="currentColor" fillRule="evenodd" d="M10.437 8.002 4.97 2.532l1.06-1.06 6 6a.75.75 0 0 1 0 1.06l-6 5.999-1.06-1.06z" clipRule="evenodd" />
  </svg>
);

// Icone originali estratte dal tuo HTML
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

export default Panoramica;