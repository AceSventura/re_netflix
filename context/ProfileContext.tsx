"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Tipi allineati allo schema Prisma
export interface Profile {
  id_profilo: number;
  nome_profilo: string;
  avatar_url: string | null;
}

interface ProfileContextType {
  profiles: Profile[];
  currentProfile: Profile | null;
  isLoading: boolean;
  error: string | null;
  selectProfile: (profile: Profile) => void;
  fetchProfiles: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchProfiles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/profiles");
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      
      const data = await res.json();
      if (data.success) {
        setProfiles(data.profiles);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Errore di rete durante il caricamento dei profili: " + (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const selectProfile = (profile: Profile) => {
    setCurrentProfile(profile);
    sessionStorage.setItem("active_profile_id", profile.id_profilo.toString());
    router.push("/browse");
  };

  return (
    <ProfileContext.Provider value={{ profiles, currentProfile, isLoading, error, selectProfile, fetchProfiles }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfiles = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfiles deve essere usato dentro un ProfileProvider");
  }
  return context;
};