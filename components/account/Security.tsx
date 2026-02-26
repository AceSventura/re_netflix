"use client";

import React from "react";
import Link from "next/link";

interface SecurityItemProps {
  label: string;
  value?: string;
  subValue?: string;
  icon: React.ReactNode;
  href: string;
  error?: string;
  isNew?: boolean;
}

const Security: React.FC = () => {
  return (
    <section className="flex-1 min-w-0">
      <div className="mb-2">
        <h1 className="text-[32px] font-bold text-black tracking-tight leading-tight">Sicurezza</h1>
        <p className="text-[14px] text-gray-600 mt-1 font-medium">Dettagli account</p>
      </div>

      <div className="flex flex-col gap-8 mt-4">
        {/* CARD 1: Dettagli account */}
        <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
          <ul className="divide-y divide-gray-100">
            <SecurityItem 
              label="Password" 
              icon={<LockIcon />} 
              href="/password" 
            />
            <SecurityItem 
              label="Email" 
              subValue="fabio0442@gmail.com" 
              error="Verifica necessaria"
              icon={<EmailIcon />} 
              href="#" 
            />
            <SecurityItem 
              label="Cellulare" 
              subValue="331 846 2704" 
              icon={<PhoneIcon />} 
              href="/phonenumber" 
            />
          </ul>
        </div>

        {/* CARD 2: Accesso e privacy */}
        <div>
          <p className="text-[14px] text-gray-600 mb-3 font-medium">Accesso e privacy</p>
          <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
            <ul className="divide-y divide-gray-100">
              <SecurityItem 
                label="Accesso e dispositivi" 
                subValue="Gestisci i dispositivi connessi" 
                icon={<TvMobileIcon />} 
                href="/manageaccountaccess" 
              />
              <SecurityItem 
                label="Trasferimenti di profilo" 
                subValue="On" 
                isNew 
                icon={<ProfileArrowIcon />} 
                href="/settings/profileTransfer/enable" 
              />
              <SecurityItem 
                label="Accesso ai dati personali" 
                subValue="Richiedi una copia dei tuoi dati personali" 
                icon={<ShieldCheckIcon />} 
                href="/account/getmyinfo" 
              />
              <SecurityItem 
                label="Test delle funzionalità" 
                subValue="On" 
                icon={<LabFlaskIcon />} 
                href="/donottest" 
              />
            </ul>
          </div>
        </div>

        {/* Bottone Elimina Account (Stile identico allo screenshot) */}
        <div className="mt-2 w-full">
          <button className="w-full bg-white border border-gray-300 text-[#e50914] py-3 font-semibold rounded hover:bg-gray-50 transition-colors text-[16px] shadow-sm">
            Elimina account
          </button>
        </div>
      </div>
    </section>
  );
};

const SecurityItem: React.FC<SecurityItemProps> = ({ label, subValue, icon, href, error, isNew }) => (
  <li>
    <Link href={href} className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors group">
      <div className="flex items-center gap-4">
        <div className="text-[#333] w-6 flex justify-center shrink-0">{icon}</div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-bold text-black text-[16px] leading-tight group-hover:underline">{label}</span>
            {isNew && (
              <span className="bg-[#0071eb]/10 text-[#0071eb] text-[10px] px-2 py-0.5 rounded-sm font-bold uppercase tracking-wider border border-[#0071eb]/20">
                Nuovo
              </span>
            )}
          </div>
          {subValue && <span className="text-[#737373] text-[14px] mt-0.5">{subValue}</span>}
          {error && (
            <span className="text-[#d93025] text-[13px] mt-1 flex items-center gap-1 font-medium underline decoration-dotted">
              <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
                <path fillRule="evenodd" d="M8 1.5a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0m1.5 3h-3l.833 7h1.334zM8 11a1 1 0 1 1 0 2 1 1 0 0 1 0-2" clipRule="evenodd" />
              </svg>
              {error}
            </span>
          )}
        </div>
      </div>
      <svg viewBox="0 0 16 16" width="16" height="16" className="text-gray-400 group-hover:text-black transition-colors">
        <path fill="currentColor" fillRule="evenodd" d="M10.437 8.002 4.97 2.532l1.06-1.06 6 6a.75.75 0 0 1 0 1.06l-6 5.999-1.06-1.06z" clipRule="evenodd" />
      </svg>
    </Link>
  </li>
);

// --- ICONE ESTRATTE ---
const LockIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path fillRule="evenodd" d="M7 6a5 5 0 0 1 10 0v1h2a2 2 0 0 1 2 2v9.653a1.96 1.96 0 0 1-1.719 1.955C18.03 20.759 15.492 21 12 21s-6.029-.24-7.281-.392A1.96 1.96 0 0 1 3 18.653V9a2 2 0 0 1 2-2h2zm8 0v1H9V6a3 3 0 1 1 6 0M5 9v9.627c1.2.144 3.638.373 7 .373s5.8-.23 7-.373V9zm6 3v4h2v-4z" clipRule="evenodd"/></svg>
);
const EmailIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path fillRule="evenodd" d="M2 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 3.221V19h20V6.221q-.106.135-.241.259L20.413 5H3.587L12 12.649 20.413 5l1.346 1.48-9.086 8.26-.673.611-.673-.611-9.086-8.26A2 2 0 0 1 2 6.22" clipRule="evenodd"/></svg>
);
const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path fillRule="evenodd" d="M6 0a2 2 0 0 0-2 2v20c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 2h12v20H6zm7.5 16.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0" clipRule="evenodd"/></svg>
);
const TvMobileIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path fillRule="evenodd" d="M0 3.73C0 2.77.77 2 1.73 2h18.54c.96 0 1.73.77 1.73 1.73V7h-2V4H2v10h11v2H1.73C.77 16 0 15.23 0 14.27zM13 17.3a73 73 0 0 0-8.07.12l.14 2A70 70 0 0 1 13 19.3zm9-6.3h-5v9h5zm-5-2a2 2 0 0 0-2 2v9c0 1.1.9 2 2 2h5a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2zm2.5 9.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5" clipRule="evenodd"/></svg>
);
const ProfileArrowIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path fillRule="evenodd" d="M6 1a4 4 0 0 0-4 4v12a4 4 0 0 0 4 4h3.59l-1.3 1.3 1.42 1.4 3-3a1 1 0 0 0 0-1.4l-3-3-1.42 1.4L9.6 19H6a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3v2h3a4 4 0 0 0 4-4V5a4 4 0 0 0-4-4zm1.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M18 8.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m-1.6 3.7a5 5 0 0 1-2.9.8 5 5 0 0 1-2.9-.8l-1.2 1.6a7 7 0 0 0 4.1 1.2c1.58 0 3.07-.43 4.1-1.2z" clipRule="evenodd"/></svg>
);
const ShieldCheckIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path fillRule="evenodd" d="M12.4 1.09a1 1 0 0 0-.8 0l-10 4.44a1 1 0 0 0-.6.95c.11 2.78.36 6.3 1.8 9.41 1.47 3.18 4.15 5.9 8.96 7.08a1 1 0 0 0 .48 0c4.8-1.19 7.5-3.9 8.96-7.08 1.44-3.11 1.69-6.63 1.8-9.4a1 1 0 0 0-.6-.96zM4.63 15.05c-1.16-2.5-1.46-5.37-1.6-7.97L12 3.1l8.97 4c-.13 2.6-.43 5.46-1.59 7.96-1.2 2.6-3.34 4.86-7.38 5.92-4.04-1.06-6.18-3.31-7.38-5.92m7.09.66 6-6-1.42-1.42L11 13.6l-2.3-2.3-1.4 1.42 3 3 .7.7z" clip-rule="evenodd"/></svg>
);
const LabFlaskIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path fillRule="evenodd" d="m10 12.19-.38.52L7.97 15h8.06l-1.65-2.29-.38-.52V10h-2V8h2V6h-2V4h2V2h-4zM17.48 17H6.52l-2.46 3.41a1 1 0 0 0 .8 1.59h14.27a1 1 0 0 0 .81-1.59zM16 11.54V2h1V0H7v2h1v9.54l-5.56 7.7A3 3 0 0 0 4.87 24h14.26a3 3 0 0 0 2.43-4.76z" clipRule="evenodd"/></svg>
);

export default Security;