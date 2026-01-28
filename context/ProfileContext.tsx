"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

// Definiamo il tipo per il Profilo
export interface Profile {
    id: string;
    name: string;
    avatar: string;
}

interface ProfileContextType {
    profiles: Profile[];
    selectedProfile: Profile | null;
    selectProfile: (profile: Profile | null ) => void;
    isLoading: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // FASE MOCK: Carichiamo i dati statici
    const mockProfiles: Profile[] = [
      {
      id: "1",
      name: "Fabio",
      avatar: "https://occ-0-2135-2581.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABfjwXqIYd3kCEU6KWsiHSHvkft8VhZg0yyD50a_pHXku4dz9VgxWwfA2ontwogStpj1NE9NJMt7sCpSKFEY2zmgqqQfcw1FMWwB9.png?r=229",
    },
    {
      id: "2",
      name: "Alex",
      avatar: "https://occ-0-2135-2581.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABZjbRLteCwz9qUBoQNDcTgnpeLdHcABGonefvlkK1imOp0HtuoNJGTArMuo58MryPP6kIpVmeuQFZoTiRyDmpV7qjxgqUnMbLfCE.png?r=72f",
    },
    {
      id: "3",
      name: "Michele",
      avatar: "https://occ-0-2135-2581.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABbHuAP6AwsPJ8qFBs6GRLRjPnViP_Q1d-QL2M_Rq7YdGyi8RcwZgLFbuAtuRJtjSd2liw0G8_c0nWUG3HD9J7Eeu2cxbZVTiMOFw.png?r=558",
    },
    {
      id: "4",
      name: "Bambini",
      avatar: "https://occ-0-2135-2581.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABTNwb8Mp0j03TGOFdsXEkloZ6qJLSL92elJ3Q6rq4F3YQWMU7T79UaCZJq6tc8CEb0Xp-mB7pMflY34Me0mhoHs3Kqqd6Lsx17bi.png?r=ec4",
    }
    ];
    
    setProfiles(mockProfiles);
    setIsLoading(false);

    /* FUTURO: Quando avrai l'API, sostituirai il codice sopra con:
       fetch('/api/profiles')
         .then(res => res.json())
         .then(data => {
            setProfiles(data);
            setIsLoading(false);
         });
    */
  }, []);

    const selectProfile = (profile: Profile | null) => {
        setSelectedProfile(profile);

        if (profile) {
            // Se seleziono un profilo, lo salvo
            localStorage.setItem('netflix-profile', JSON.stringify(profile));
        } else {
            // Se passo null (Logout), lo rimuovo
            localStorage.removeItem('netflix-profile');
        }
    };

    return (
        <ProfileContext.Provider value={{ profiles, selectedProfile, selectProfile, isLoading }}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfiles = () => {
    const context = useContext(ProfileContext);
    if (!context) throw new Error("useProfiles deve essere usato dentro ProfileProvider");
    return context;
};