"use client";

// Carico i profilo dal localStorage
import { useProfiles, Profile } from '@/context/ProfileContext';

import Image from "next/image";

const ProfileSelection = () => {
    const { profiles, selectProfile, isLoading } = useProfiles();

    if (isLoading) return <div className="text-white text-center">Caricamento...</div>;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#141414] text-white font-sans">
        <div className="flex flex-col items-center max-w-6xl px-8">
            <h1 className="text-3xl md:text-5xl font-medium mb-10 tracking-wide text-center">
            Chi vuole guardare Netflix?
            </h1>

            <ul className="flex flex-wrap justify-center gap-6 md:gap-8">
            {profiles.map((profile) => (
                <li key={profile.id} className="group cursor-pointer">
                    <div
                        key={profile.name}    
                        onClick={() => selectProfile(profile)}
                    >
                    <div className="w-28 h-28 md:w-40 md:h-40 rounded overflow-hidden border-[3px] border-transparent group-hover:border-white transition-all duration-300">
                    <Image 
                        src={profile.avatar} 
                        alt={profile.name} 
                        width={160} 
                        height={160}
                        className="object-cover"
                        priority={true} // Carica subito queste immagini perché sono "above the fold"
                    />
                    </div>
                    <span className="mt-4 text-gray-400 group-hover:text-white text-lg md:text-xl transition-colors duration-300">
                    {profile.name}
                    </span>
                </div>
                </li>
            ))}

            {/* Bottone Aggiungi Profilo */}
            <li className="group cursor-pointer">
                <a href="#" className="flex flex-col items-center">
                <div className="w-28 h-28 md:w-40 md:h-40 rounded flex items-center justify-center bg-transparent border-transparent transition-all duration-300 group-hover:bg-gray-200">
                    <div className="text-gray-500 text-6xl group-hover:text-black">
                    <svg viewBox="0 0 24 24" className="w-16 h-16 fill-current">
                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                    </svg>
                    </div>
                </div>
                <span className="mt-4 text-gray-400 group-hover:text-white text-lg md:text-xl transition-colors duration-300 text-center">
                    Aggiungi un profilo
                </span>
                </a>
            </li>
            </ul>

            <button className="mt-16 px-6 py-2 border border-gray-500 text-gray-500 hover:text-white hover:border-white text-sm md:text-lg uppercase tracking-widest transition-all duration-300">
            Gestisci i profili
            </button>
        </div>
        </div>
    );
};

export default ProfileSelection;