"use client";

import React from "react";
import Link from "next/link";

interface DeviceItemProps {
  label: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

const Devices: React.FC = () => {
  return (
    <section className="flex-1 min-w-0 pb-20">
      {/* Intestazione */}
      <div className="mb-2">
        <h1 className="text-[32px] font-bold text-black tracking-tight leading-tight">Dispositivi</h1>
        <p className="text-[14px] text-gray-600 mt-1 font-medium">Accesso all&apos;account</p>
      </div>

      <div className="flex flex-col gap-8 mt-4">
        {/* CARD 1: Accesso all'account */}
        <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
          <ul className="divide-y divide-gray-100">
            <DeviceAction 
              label="Accesso e dispositivi" 
              description="Gestisci i dispositivi connessi"
              icon={<TvMobileIcon />}
              href="/manageaccountaccess"
            />
          </ul>
        </div>

        {/* CARD 2: Download su dispositivi mobili */}
        <div>
          <p className="text-[14px] text-gray-600 mb-3 font-medium">Download su dispositivi mobili</p>
          <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
            <ul className="divide-y divide-gray-100">
              <DeviceAction 
                label="Dispositivi abilitati al download" 
                description="0 dispositivi per il download in uso su 2 disponibili"
                icon={<DownloadIcon />}
                href="/settings/download-devices"
              />
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

// Sotto-componente per le azioni dei dispositivi
const DeviceAction: React.FC<DeviceItemProps> = ({ label, description, icon, href }) => (
  <li>
    <Link href={href} className="flex items-center justify-between p-6 hover:bg-gray-50 group transition-colors">
      <div className="flex items-center gap-5">
        <div className="text-gray-900 w-6 flex justify-center shrink-0">
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-black text-[16px] leading-tight group-hover:underline">
            {label}
          </span>
          <span className="text-gray-500 text-[13px] mt-1 leading-tight">
            {description}
          </span>
        </div>
      </div>
      {/* Freccia Chevron originale */}
      <svg viewBox="0 0 16 16" width="16" height="16" className="text-gray-400 shrink-0 ml-4 group-hover:text-black transition-colors">
        <path fill="currentColor" fillRule="evenodd" d="M10.437 8.002 4.97 2.532l1.06-1.06 6 6a.75.75 0 0 1 0 1.06l-6 5.999-1.06-1.06z" clipRule="evenodd" />
      </svg>
    </Link>
  </li>
);

// --- ICONE SVG ORIGINALI ---
const TvMobileIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path fillRule="evenodd" d="M0 3.73C0 2.77.77 2 1.73 2h18.54c.96 0 1.73.77 1.73 1.73V7h-2V4H2v10h11v2H1.73C.77 16 0 15.23 0 14.27zM13 17.3a73 73 0 0 0-8.07.12l.14 2A70 70 0 0 1 13 19.3zm9-6.3h-5v9h5zm-5-2a2 2 0 0 0-2 2v9c0 1.1.9 2 2 2h5a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2zm2.5 9.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5" clipRule="evenodd"/></svg>
);

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path fillRule="evenodd" d="M13 3h-2v11.586l-4.293-4.293-1.414 1.414L12 18.414l6.707-6.707-1.414-1.414L13 14.586zM4 21h16v-2H4z" clipRule="evenodd"/></svg>
);

export default Devices;