"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { AlertTriangle, ArrowLeftRight, ChevronRight } from "lucide-react";
import { getUserProfiles, getActiveProfile, setActiveProfile } from "@/app/actions/profiles";

interface Profile {
  id_profilo: number;
  nome_profilo: string;
  avatar_url: string | null;
  isActive?: boolean;
}

const ListRow = ({
  icon,
  title,
  subtitle,
  badge,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  badge?: string;
  onClick?: () => void;
}) => (
  <li className="border-b border-gray-200 last:border-b-0">
    <button 
      onClick={onClick}
      className="flex w-full items-center gap-4 py-4 px-4 hover:bg-gray-50 transition-colors text-left"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded overflow-hidden">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-base font-bold text-black">{title}</div>
        {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
      </div>
      {badge && <span className="text-sm font-bold text-blue-600">{badge}</span>}
      <ChevronRight size={20} className="text-gray-400" />
    </button>
  </li>
);

export default function Profiles() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [profilesRes, activeRes] = await Promise.all([
          getUserProfiles(),
          getActiveProfile()
        ]);

        if (!profilesRes.success) {
          setError(profilesRes.error || "Errore nel caricamento");
          return;
        }

        const activeId = activeRes.success && activeRes.profile ? activeRes.profile.id_profilo : null;

        const formatted = (profilesRes.profiles || []).map((p) => ({
          ...p,
          isActive: p.id_profilo === activeId,
        }));

        setProfiles(formatted);
      } catch (err) {
        setError("Errore di connessione");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleProfileSelect = async (id_profilo: number) => {
    const res = await setActiveProfile(id_profilo);
    if (res.success) {
      setProfiles((prev) =>
        prev.map((p) => ({
          ...p,
          isActive: p.id_profilo === id_profilo,
        }))
      );
    }
  };

  return (
    <section className="w-full">
      <h1 className="text-3xl font-bold text-black mb-8">Profili</h1>

      <p className="font-semibold mb-3">Filtro famiglia e autorizzazioni</p>
      <div className="mb-8 border border-gray-300 rounded-md overflow-hidden bg-white">
        <ul>
          <ListRow
            icon={<AlertTriangle size={24} className="text-black" />}
            title="Modifica filtro famiglia"
            subtitle="Imposta fasce d'età, blocca titoli"
          />
          <ListRow
            icon={<ArrowLeftRight size={24} className="text-black" />}
            title="Trasferisci un profilo"
            subtitle="Copia un profilo in un altro account"
          />
        </ul>
      </div>

      <p className="font-semibold mb-3">Impostazioni del profilo</p>
      <div className="border border-gray-300 rounded-md overflow-hidden mb-6 bg-white flex flex-col">
        <ul>
          {loading ? (
            <li className="p-4 text-gray-500">Caricamento...</li>
          ) : error ? (
            <li className="p-4 text-red-500">{error}</li>
          ) : profiles.length === 0 ? (
            <li className="p-4 text-gray-500">Nessun profilo trovato.</li>
          ) : (
            profiles.map((p) => (
              <ListRow
                key={p.id_profilo}
                title={p.nome_profilo}
                badge={p.isActive ? "Ora attivo" : undefined}
                onClick={() => handleProfileSelect(p.id_profilo)}
                icon={
                  <Image 
                    src={p.avatar_url || "https://occ-0-2135-2581.1.nflxso.net/dnm/api/v6/SO2HoVCx33X8phZh2pZZmQ4QgNY/AAAABaEZAmr6k9h96-doKWxdUfUcAgUKY18xnhWDruqwhaEbG2bDAYjtd6pcIXvx9NzwJLfLbSJaMkqXp5prdK3PiDPvgtFoz6EMmA.png?r=229"} 
                    alt={p.nome_profilo} 
                    width={40} 
                    height={40} 
                    className="rounded" 
                  />
                }
              />
            ))
          )}
        </ul>
        
        {/* Modifica applicata qui */}
        <div className="px-4 pb-5 pt-2">
          <button 
            disabled={profiles.length >= 5}
            className={`w-full py-3 font-semibold text-[16px] rounded-md transition-colors ${
              profiles.length >= 5 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-[#e6e6e6] hover:bg-[#d6d6d6] text-black'
            }`}
          >
            Aggiungi profilo
          </button>
          <p className="text-[13px] text-gray-600 mt-4 text-center">
            Aggiungi fino a 5 profili per chiunque viva con te.
          </p>
        </div>
      </div>
    </section>
  );
}