"use client";

import React from "react";
import Link from "next/link";

interface ProfileItemProps {
  name: string;
  avatarSrc: string;
  isMain?: boolean;
}

interface ActionItemProps {
  label: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

const Profiles: React.FC = () => {
  const users: ProfileItemProps[] = [
    { name: "Fabio", avatarSrc: "https://occ-0-2582-2581.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABXh10ggeTTdhZO1JIH_SNQ4gp0vsNnWfE8Mg2ckwzGvUzJMRpPFCujRK3Ex5K9VbkIyvUHQ92LBVdsemkj6zlpquL-qWMCNKeg.png?r=229", isMain: true },
    { name: "Papà", avatarSrc: "https://occ-0-2582-2581.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABZftBwbT4-e5tX3KSxQ-IGpnQvlM5c1ji_i0Y7VyQPCKKGcy54o4NtB0RsuVastMMQZ7BrloEDcRaRmpb0sbilINWmgj6xhMog.png?r=72f" },
    { name: "Grazia", avatarSrc: "https://occ-0-2582-2581.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABRp8SIY8MrmT39ab3mMLfmQJXbqadfYfBgxgiHOicZRcQiKKGzofuF30ttGIfs16m6IJZESxa4-o-LToGAhonn69QkSRrfh1mg.png?r=558" },
    { name: "Bambini", avatarSrc: "https://occ-0-2582-2581.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABZfS6J5Q5X1jnVdHwG36aDTG2T0Sb3MATAlNqmBvhEoMYR24UVT8DNuI7NSUJfpqm07Qg7Ma9BYF_eH-YevRSclAJOY2JHVOVQ.png?r=ec4" },
  ];

  return (
    <section className="flex-1 min-w-0 pb-20">
      <div className="mb-2">
        <h1 className="text-[32px] font-bold text-black tracking-tight leading-tight">Profili</h1>
        <p className="text-[14px] text-gray-600 mt-1 font-medium">Filtro famiglia e autorizzazioni</p>
      </div>

      <div className="flex flex-col gap-8 mt-4">
        {/* Sezione 1: Azioni Generali */}
        <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
          <ul className="divide-y divide-gray-100">
            <ActionItem 
              label="Modifica filtro famiglia" 
              description="Imposta fasce d'età, blocca titoli"
              icon={<HexagonIcon />}
              href="/settings/restrictions"
            />
            <ActionItem 
              label="Trasferisci un profilo" 
              description="Copia un profilo in un altro account"
              icon={<ProfileArrowIcon />}
              href="/account/profile/transfer"
            />
          </ul>
        </div>

        {/* Sezione 2: Impostazioni del profilo */}
        <div>
          <p className="text-[14px] text-gray-600 mb-3 font-medium">Impostazioni del profilo</p>
          <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
            <ul className="divide-y divide-gray-100">
              {users.map((user) => (
                <li key={user.name}>
                  <Link href={`/account/profiles/${user.name.toLowerCase()}`} className="flex items-center justify-between p-5 hover:bg-gray-50 group transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-sm overflow-hidden shrink-0">
                        <img src={user.avatarSrc} alt={user.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-bold text-black text-[16px] group-hover:underline">{user.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {user.isMain && (
                        <span className="bg-[#0071eb]/10 text-[#0071eb] text-[10px] px-2 py-0.5 rounded-sm font-bold border border-[#0071eb]/20 uppercase">
                          Il tuo profilo
                        </span>
                      )}
                      <ChevronRightIcon />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            
            {/* Tasto Aggiungi Profilo */}
            <div className="p-4 border-t border-gray-100">
              <button className="w-full bg-gray-200 text-black py-3 font-bold rounded hover:bg-gray-300 transition-colors text-[16px]">
                Aggiungi profilo
              </button>
              <p className="text-center text-[12px] text-gray-500 mt-3 italic">
                Aggiungi fino a 5 profili per chiunque viva con te.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Sotto-componenti
const ActionItem: React.FC<ActionItemProps> = ({ label, description, icon, href }) => (
  <li>
    <Link href={href} className="flex items-center justify-between p-5 hover:bg-gray-50 group transition-colors">
      <div className="flex items-center gap-4">
        <div className="text-gray-900 w-6 flex justify-center shrink-0">{icon}</div>
        <div className="flex flex-col">
          <span className="font-bold text-black text-[16px] group-hover:underline">{label}</span>
          <span className="text-gray-500 text-[13px] mt-0.5">{description}</span>
        </div>
      </div>
      <ChevronRightIcon />
    </Link>
  </li>
);

const ChevronRightIcon = () => (
  <svg viewBox="0 0 16 16" width="16" height="16" className="text-gray-400 shrink-0">
    <path fill="currentColor" fillRule="evenodd" d="M10.437 8.002 4.97 2.532l1.06-1.06 6 6a.75.75 0 0 1 0 1.06l-6 5.999-1.06-1.06z" clipRule="evenodd" />
  </svg>
);

const HexagonIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path fillRule="evenodd" d="m2.76 12 4.62 8h9.24l4.62-8-4.62-8H7.38zm-2.02-.5a1 1 0 0 0 0 1l5.2 9c.18.3.5.5.86.5h10.4a1 1 0 0 0 .86-.5l5.2-9a1 1 0 0 0 0-1l-5.2-9a1 1 0 0 0-.86-.5H6.8a1 1 0 0 0-.86.5zm12.76 4a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-8.5h-3l.5 6h2z" clipRule="evenodd"/></svg>
);

const ProfileArrowIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path fillRule="evenodd" d="M6 1a4 4 0 0 0-4 4v12a4 4 0 0 0 4 4h3.59l-1.3 1.3 1.42 1.4 3-3a1 1 0 0 0 0-1.4l-3-3-1.42 1.4L9.6 19H6a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3v2h3a4 4 0 0 0 4-4V5a4 4 0 0 0-4-4zm1.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M18 8.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m-1.6 3.7a5 5 0 0 1-2.9.8 5 5 0 0 1-2.9-.8l-1.2 1.6a7 7 0 0 0 4.1 1.2c1.58 0 3.07-.43 4.1-1.2z" clipRule="evenodd"/></svg>
);

export default Profiles;