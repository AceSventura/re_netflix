import React from 'react';
import { Pencil, UserRoundPlus, User, HelpCircle, LogOut } from 'lucide-react';

const NetflixProfileDropdown = () => {
  const profiles = [
    { name: 'Papà', avatar: 'https://placeholder.com/profile1.jpg', color: 'bg-yellow-600' },
    { name: 'Mamma', avatar: 'https://placeholder.com/profile2.jpg', color: 'bg-purple-600' },
    { name: 'Bambini', avatar: 'https://placeholder.com/profile3.jpg', color: 'bg-blue-400' },
  ];

  return (
    <div className="w-64 bg-black/90 text-white border border-zinc-700 shadow-2xl font-sans text-sm">
      {/* Lista Profili */}
      <div className="p-4 space-y-3">
        {profiles.map((profile, index) => (
          <div key={index} className="flex items-center gap-3 group cursor-pointer">
            <div className={`w-8 h-8 rounded-sm ${profile.color} overflow-hidden`}>
              {/* Qui andrebbe l'immagine vera del profilo */}
            </div>
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