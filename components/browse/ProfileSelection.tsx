"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    getUserProfiles,
    createNewProfile,
    setActiveProfile,
    deleteProfile,
} from "@/app/actions/profiles";
import { useProfiles } from "@/context/ProfileContext";

import { Trash2, X } from "lucide-react";
import type { profili } from "@prisma/client";

const AVATAR_OPTIONS = [
    "/avatars/1.jpg",
    "/avatars/2.jpg",
    "/avatars/3.jpg",
    "/avatars/4.jpg",
];

export default function ProfileSelection() {
    const router = useRouter();
    const [profiles, setProfiles] = useState<profili[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isCreating, setIsCreating] = useState(false);
    const [isManaging, setIsManaging] = useState(false);

    const [newProfileName, setNewProfileName] = useState("");
    const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [actionError, setActionError] = useState("");

    const [profileToDelete, setProfileToDelete] = useState<profili | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const res = await getUserProfiles();

                if (res.success && res.profiles) {
                    setProfiles(res.profiles);
                    if (res.profiles.length === 0) {
                        setIsCreating(true);
                    }
                } else {
                    console.error("Errore recupero profili:", res.error);
                    router.push("/login");
                }
            } catch (error) {
                console.error("Errore di esecuzione interno:", error);
                router.push("/login");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfiles();
    }, [router]);

    const handleProfileClick = (profile: profili) => {
        if (isManaging) {
            // In modalità gestione, il click chiede conferma di eliminazione
            setActionError("");
            setProfileToDelete(profile);
            return;
        }
        selectAndGo(profile.id_profilo);
    };


    const { selectProfile } = useProfiles();

    const selectAndGo = async (profileId: number) => {
        setActionError("");
        try {
            const res = await setActiveProfile(profileId);
            if (res.success) {
                const profiloScelto = profiles.find((p) => p.id_profilo === profileId) ?? null;
                selectProfile(profiloScelto); // aggiorna subito il Context client-side
                router.push("/browse");
                router.refresh();
            } else {
                setActionError(res.error || "Errore nel selezionare il profilo.");
            }
        } catch (error) {
            console.error("Errore nell'impostazione del profilo", error);
            setActionError("Errore di connessione al server.");
        }
    };

    const confirmDeleteProfile = async () => {
        if (!profileToDelete) return;

        setIsDeleting(true);
        setActionError("");
        try {
            const res = await deleteProfile(profileToDelete.id_profilo);
            if (res.success) {
                setProfiles((prev) =>
                    prev.filter((p) => p.id_profilo !== profileToDelete.id_profilo)
                );
                setProfileToDelete(null);
            } else {
                setActionError(res.error || "Impossibile eliminare il profilo.");
                setProfileToDelete(null);
            }
        } catch (error) {
            setActionError("Errore di connessione al server: " + error);
            setProfileToDelete(null);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCreateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setActionError("");

        if (!newProfileName.trim()) return;

        setIsSubmitting(true);
        try {
            const res = await createNewProfile(newProfileName, selectedAvatar);

            if (res.success && res.profile) {
                setProfiles([...profiles, res.profile]);
                setIsCreating(false);
                setIsManaging(false);
                setNewProfileName("");
                setSelectedAvatar(AVATAR_OPTIONS[0]);
            } else {
                setActionError(res.error || "Impossibile creare il profilo.");
            }
        } catch (error) {
            setActionError("Errore di connessione al server: " + error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#141414] flex items-center justify-center text-white text-xl">
                Caricamento...
            </div>
        );
    }

    if (isCreating) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#141414] text-white font-sans">
                <div className="max-w-2xl w-full px-8 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-medium mb-8 text-center">
                        {profiles.length === 0 ? "Crea il tuo primo profilo" : "Aggiungi Profilo"}
                    </h1>

                    {actionError && (
                        <div className="bg-red-600/80 border border-red-500 text-white p-4 rounded-md mb-6 font-medium">
                            {actionError}
                        </div>
                    )}

                    <form onSubmit={handleCreateProfile} className="flex flex-col gap-8">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <Image
                                src={selectedAvatar}
                                alt="Avatar selezionato"
                                width={120}
                                height={120}
                                className="rounded-md object-cover"
                            />
                            <input
                                type="text"
                                placeholder="Nome"
                                value={newProfileName}
                                onChange={(e) => setNewProfileName(e.target.value)}
                                className="bg-[#666] text-white px-4 py-3 rounded-sm text-xl w-full focus:outline-none focus:ring-2 focus:ring-white"
                                required
                                maxLength={30}
                            />
                        </div>

                        <div>
                            <h3 className="text-xl mb-4 text-gray-300">Scegli un avatar:</h3>
                            <div className="flex gap-4 flex-wrap">
                                {AVATAR_OPTIONS.map((avatar) => (
                                    <div
                                        key={avatar}
                                        onClick={() => setSelectedAvatar(avatar)}
                                        className={`cursor-pointer rounded-md overflow-hidden border-4 transition-all ${
                                            selectedAvatar === avatar
                                                ? "border-white scale-110"
                                                : "border-transparent opacity-60 hover:opacity-100"
                                        }`}
                                    >
                                        <Image src={avatar} alt="Avatar" width={80} height={80} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-4 mt-8 border-t border-gray-700 pt-8">
                            <button
                                type="submit"
                                disabled={isSubmitting || !newProfileName.trim()}
                                className="bg-white text-black px-8 py-2 font-bold hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50"
                            >
                                {isSubmitting ? "Salvataggio..." : "Continua"}
                            </button>
                            {profiles.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsCreating(false);
                                        setActionError("");
                                        setNewProfileName("");
                                    }}
                                    className="border border-gray-500 text-gray-400 px-8 py-2 hover:border-white hover:text-white transition-colors"
                                >
                                    Annulla
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#141414] text-white font-sans relative">
            <div className="flex flex-col items-center max-w-6xl px-8 animate-fade-in">
                <h1 className="text-3xl md:text-5xl font-medium mb-10 tracking-wide text-center">
                    {isManaging ? "Gestisci i profili" : "Chi vuole guardare Netflix?"}
                </h1>

                {actionError && (
                    <div className="bg-red-600/80 border border-red-500 text-white p-3 rounded-md mb-6">
                        {actionError}
                    </div>
                )}

                <ul className="flex flex-wrap justify-center gap-6 md:gap-8 text-center">
                    {profiles.map((profile) => (
                        <li key={profile.id_profilo} className="group cursor-pointer">
                            <div onClick={() => handleProfileClick(profile)}>
                                <div className="relative w-28 h-28 md:w-40 md:h-40 rounded-md overflow-hidden border-[3px] border-transparent group-hover:border-white transition-all duration-300 mx-auto">
                                    <Image
                                        src={profile.avatar_url || AVATAR_OPTIONS[0]}
                                        alt={profile.nome_profilo}
                                        width={160}
                                        height={160}
                                        className={`object-cover ${
                                            isManaging ? "opacity-50" : "opacity-100"
                                        }`}
                                        priority
                                    />
                                    {isManaging && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                            <Trash2 size={36} className="text-white drop-shadow-md" />
                                        </div>
                                    )}
                                </div>
                                <span className="block mt-4 text-gray-400 group-hover:text-white text-lg md:text-xl transition-colors duration-300">
                                    {profile.nome_profilo}
                                </span>
                            </div>
                        </li>
                    ))}

                    {profiles.length < 5 && !isManaging && (
                        <li className="group cursor-pointer">
                            <div
                                onClick={() => setIsCreating(true)}
                                className="flex flex-col items-center"
                            >
                                <div className="w-28 h-28 md:w-40 md:h-40 rounded-md flex items-center justify-center bg-transparent border-transparent transition-all duration-300 group-hover:bg-gray-200">
                                    <div className="text-gray-500 text-6xl group-hover:text-black font-light mb-2">
                                        +
                                    </div>
                                </div>
                                <span className="block mt-4 text-gray-400 group-hover:text-white text-lg md:text-xl transition-colors duration-300 text-center">
                                    Aggiungi profilo
                                </span>
                            </div>
                        </li>
                    )}
                </ul>

                <button
                    onClick={() => {
                        setIsManaging(!isManaging);
                        setActionError("");
                    }}
                    className="mt-16 px-6 py-2 border border-gray-500 text-gray-500 hover:text-white hover:border-white text-sm md:text-lg uppercase tracking-widest transition-all duration-300 bg-transparent"
                >
                    {isManaging ? "Fine" : "Gestisci i profili"}
                </button>
            </div>

            {/* Modale di conferma eliminazione */}
            {profileToDelete && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
                    <div className="bg-[#1a1a1a] border border-gray-700 rounded-md p-8 max-w-md w-full relative">
                        <button
                            onClick={() => setProfileToDelete(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                            aria-label="Chiudi"
                        >
                            <X size={20} />
                        </button>
                        <h2 className="text-2xl font-medium mb-4">
                            Eliminare &quot;{profileToDelete.nome_profilo}&quot;?
                        </h2>
                        <p className="text-gray-400 mb-8">
                            Questa azione è irreversibile. Tutti i dati associati a questo profilo
                            andranno persi.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={confirmDeleteProfile}
                                disabled={isDeleting}
                                className="bg-red-600 text-white px-6 py-2 font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                {isDeleting ? "Eliminazione..." : "Elimina"}
                            </button>
                            <button
                                onClick={() => setProfileToDelete(null)}
                                disabled={isDeleting}
                                className="border border-gray-500 text-gray-400 px-6 py-2 hover:border-white hover:text-white transition-colors"
                            >
                                Annulla
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}