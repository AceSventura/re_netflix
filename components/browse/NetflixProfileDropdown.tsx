"use client";

import { Pencil, UserRoundPlus, User, HelpCircle, LogOut } from 'lucide-react';

import { useProfiles, Profile } from '@/context/ProfileContext';

import Image from 'next/image';

const NetflixProfileDropdown = () => {

  const { profiles, selectProfile } = useProfiles();
  
  return (
    <div className="w-64 bg-black/90 text-white border border-zinc-700 shadow-2xl font-sans text-sm">
      {/* Lista Profili */}
      <div className="p-4 space-y-3">
        {profiles.map((profile, index) => (
          <div key={index} className="flex items-center gap-3 group cursor-pointer">
            <Image 
              src={profile.avatar} 
              alt={profile.name} 
              width={160} 
              height={160}
              className="object-cover"
              priority={true} // Carica subito queste immagini perché sono "above the fold"
          />
            <span className="group-hover:underline">{profile.name}</span>
          </div>
        ))}
      </div>

      <div className="h-[1px] bg-zinc-700 my-1" />

      {/* Menu Azioni */}
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-3 group cursor-pointer">
          <Pencil size={20} className="text-zinc-400" />
          <span className="group-hover:underline">Gestisci i profili</span>
        </div>
        <div className="flex items-center gap-3 group cursor-pointer">
          <UserRoundPlus size={20} className="text-zinc-400" />
          <span className="group-hover:underline">Trasferisci profilo</span>
        </div>
        <div className="flex items-center gap-3 group cursor-pointer">
          <User size={20} className="text-zinc-400" />
          <span className="group-hover:underline">Account</span>
        </div>
        <div className="flex items-center gap-3 group cursor-pointer">
          <HelpCircle size={20} className="text-zinc-400" />
          <span className="group-hover:underline">Centro assistenza</span>
        </div>
      </div>

      <div className="h-[1px] bg-zinc-700" />

      {/* Logout */}
      <div className="p-4 text-center cursor-pointer hover:underline">
        Esci da Netflix
      </div>
    </div>
  );
};

export default NetflixProfileDropdown;