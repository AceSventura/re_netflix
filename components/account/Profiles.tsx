"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { AlertTriangle, ArrowLeftRight, ChevronRight } from "lucide-react";

interface Profile {
  id: string;
  name: string;
  avatarUrl: string | null;
  isActive?: boolean;
}

const ListRow = ({
  icon,
  title,
  subtitle,
  badge,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  badge?: string;
}) => (
  <li className="border-b border-gray-200 last:border-b-0">
    <button className="flex w-full items-center gap-4 py-4 px-4 hover:bg-gray-50 transition-colors text-left">
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

  useEffect(() => {
    fetch('/api/account/profiles')
      .then(res => res.json())
      .then(data => {
        setProfiles(data.profiles || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="w-full">
      <h1 className="text-3xl font-bold text-black mb-8">Profili</h1>

      {/* Sezione Filtri */}
      <p className="font-semibold mb-3">Filtro famiglia e autorizzazioni</p>
      <div className="mb-8 border border-gray-300 rounded-md overflow-hidden">
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

      {/* Sezione Profili */}
      <p className="font-semibold mb-3">Impostazioni del profilo</p>
      <div className="border border-gray-300 rounded-md overflow-hidden mb-6">
        <ul>
          {loading ? <li className="p-4">Caricamento...</li> : profiles.map((p) => (
            <ListRow
              key={p.id}
              title={p.name}
              badge={p.isActive ? "Ora attivo" : undefined}
              icon={
                <Image src={p.avatarUrl || "/default-avatar.png"} alt={p.name} width={40} height={40} className="rounded" />
              }
            />
          ))}
        </ul>
        <div className="p-4 bg-gray-50 border-t border-gray-300">
          <button className="bg-gray-200 hover:bg-gray-300 px-4 py-2 font-bold text-sm rounded">Aggiungi profilo</button>
          <p className="text-sm text-gray-600 mt-3">Aggiungi fino a 5 profili per chiunque viva con te.</p>
        </div>
      </div>
    </section>
  );
}