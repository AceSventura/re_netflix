"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getUserProfiles, getActiveProfile } from "@/app/actions/profiles";
import type { profili } from "@prisma/client";

export type Profile = profili;

interface ProfileContextType {
    profiles: Profile[];
    selectedProfile: Profile | null;
    selectProfile: (profile: Profile | null) => void;
    refreshProfiles: () => Promise<void>;
    isLoading: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchAll = useCallback(async () => {
        setIsLoading(true);
        try {
            const [profilesRes, activeRes] = await Promise.all([
                getUserProfiles(),
                getActiveProfile(),
            ]);

            setProfiles(profilesRes.success && profilesRes.profiles ? profilesRes.profiles : []);
            setSelectedProfile(activeRes.success ? activeRes.profile ?? null : null);
        } catch (error) {
            console.error("Errore nel caricamento profili:", error);
            setProfiles([]);
            setSelectedProfile(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    const selectProfile = (profile: Profile | null) => {
        setSelectedProfile(profile);
    };

    return (
        <ProfileContext.Provider
            value={{ profiles, selectedProfile, selectProfile, refreshProfiles: fetchAll, isLoading }}
        >
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfiles = () => {
    const context = useContext(ProfileContext);
    if (!context) throw new Error("useProfiles deve essere usato dentro ProfileProvider");
    return context;
};