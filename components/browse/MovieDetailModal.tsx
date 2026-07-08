"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Play, Plus, Check, X, ThumbsUp, Volume2, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { getMediaDetails } from "@/app/actions/media";
import { useProfiles } from "@/context/ProfileContext";

interface MediaDetail {
    title: string;
    description: string;
    year: number;
    maturity: string;
    duration: string;
    cast: string[];
    genres: string[];
    heroImage: string;
    episodes: Array<{ 
        id: string;
        title: string; 
        desc: string; 
        time: string; 
        image: string;
        season?: number;
    }>;
}

export default function MovieDetailModal() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname(); 
    
    const id = searchParams.get("id");
    const type = searchParams.get("type");

    const [isVisible, setIsVisible] = useState(false);
    const { selectedProfile } = useProfiles();
    const [movie, setMovie] = useState<MediaDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedSeason, setSelectedSeason] = useState<number>(1);
    const [resumeTime, setResumeTime] = useState<number | null>(null);
    const [episodeResumeTimes, setEpisodeResumeTimes] = useState<Record<string, number>>({});
    const [isFavorite, setIsFavorite] = useState(false);
    const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 10);
        
        document.body.style.overflow = "hidden";
        
        return () => { 
            clearTimeout(timer);
            document.body.style.overflow = "auto"; 
        };
    }, []);

    useEffect(() => {
        if (!id || !type) return;

        const fetchDetails = async () => {
            setIsLoading(true);
            const data = await getMediaDetails(id, type);
            setMovie(data);
            
            if (data?.episodes && data.episodes.length > 0) {
                const firstSeason = Math.min(...data.episodes.map(ep => ep.season || 1));
                setSelectedSeason(firstSeason);
            }
            
            setIsLoading(false);
        };
        fetchDetails();
    }, [id, type]);

    useEffect(() => {
        let isMounted = true;

        const loadFavoriteStatus = async () => {
            if (!id || !selectedProfile?.id_profilo || !type) {
                if (isMounted) setIsFavorite(false);
                return;
            }

            const normalizedType = type === "film" ? "film" : "serie";

            try {
                const response = await fetch(`/api/favorites?idProfilo=${selectedProfile.id_profilo}&idContenuto=${id}&tipo=${normalizedType}`);
                
                // FIX: Se l'API restituisce 404, il contenuto non è nei preferiti. Non è un errore.
                if (response.status === 404) {
                    if (isMounted) setIsFavorite(false);
                    return;
                }

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                const data = await response.json();
                if (isMounted) {
                    // Controllo resiliente sulla struttura della risposta
                    setIsFavorite(Boolean(data?.data?.isFavorite || data?.isFavorite || data?.data));
                }
            } catch (error) {
                console.warn("Avviso: Impossibile determinare lo stato dei preferiti. Default a false.", error);
                if (isMounted) setIsFavorite(false);
            }
        };

        const loadResumeInfo = async () => {
            if (!id || !selectedProfile?.id_profilo) {
                if (isMounted) {
                    setResumeTime(null);
                    setEpisodeResumeTimes({});
                }
                return;
            }

            try {
                const response = await fetch(`/api/watch/${id}/progress?idProfilo=${selectedProfile.id_profilo}`);
                if (!response.ok) return;

                const data = await response.json();
                const savedTime = typeof data?.data?.durata_visualizzata === "number" ? data.data.durata_visualizzata : null;

                if (isMounted) {
                    setResumeTime(savedTime && savedTime > 5 ? savedTime : null);
                }
            } catch (error) {
                console.error("Errore nel recupero del progresso per il dettaglio:", error);
            }
        };

        const loadEpisodeResumeInfo = async () => {
            if (!selectedProfile?.id_profilo || !movie?.episodes?.length) {
                if (isMounted) setEpisodeResumeTimes({});
                return;
            }

            try {
                const results = await Promise.all(
                    movie.episodes.map(async (ep) => {
                        const response = await fetch(`/api/watch/${ep.id}/progress?idProfilo=${selectedProfile.id_profilo}`);
                        if (!response.ok) return [ep.id, null] as const;

                        const data = await response.json();
                        const savedTime = typeof data?.data?.durata_visualizzata === "number" ? data.data.durata_visualizzata : null;
                        return [ep.id, savedTime && savedTime > 5 ? savedTime : null] as const;
                    })
                );

                if (isMounted) {
                    setEpisodeResumeTimes(Object.fromEntries(results.filter(([, value]) => value !== null)) as Record<string, number>);
                }
            } catch (error) {
                console.error("Errore nel recupero dei progressi degli episodi:", error);
            }
        };

        void loadFavoriteStatus();
        void loadResumeInfo();
        void loadEpisodeResumeInfo();

        return () => {
            isMounted = false;
        };
    }, [id, selectedProfile?.id_profilo, movie?.episodes, type]);

    const closeModal = () => {
        setIsVisible(false);
        setTimeout(() => router.push(pathname, { scroll: false }), 300);
    };

    const availableSeasons = movie 
        ? Array.from(new Set(movie.episodes.map(ep => ep.season || 1))).sort((a, b) => a - b)
        : [];
        
    const displayedEpisodes = movie 
        ? movie.episodes.filter(ep => (ep.season || 1) === selectedSeason)
        : [];

    const formatResumeTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        return `${minutes} min`;
    };

    const handleToggleFavorite = async () => {
        if (!id || !selectedProfile?.id_profilo || !type || isFavoriteLoading) return;

        const normalizedType = type === "film" ? "film" : "serie";
        const nextAction = isFavorite ? "rimuovi" : "aggiungi";

        setIsFavoriteLoading(true);

        try {
            const response = await fetch("/api/favorites", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    idProfilo: selectedProfile.id_profilo,
                    idContenuto: Number(id),
                    tipo: normalizedType,
                    azione: nextAction,
                }),
            });

            if (!response.ok) throw new Error("Errore nel salvataggio dei preferiti");
            setIsFavorite(!isFavorite);
        } catch (error) {
            console.error("Errore nel toggle preferiti:", error);
        } finally {
            setIsFavoriteLoading(false);
        }
    };

    const watchTargetId = Object.keys(episodeResumeTimes)[0] || (movie?.episodes?.length ? movie.episodes[0].id : id);

    return (
        <div className={`fixed inset-0 z-500 flex justify-center bg-black/70 overflow-y-auto transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}>
            <div className="absolute inset-0" onClick={closeModal} />

            <div className={`relative bg-[#181818] w-[95%] max-w-212.5 h-fit min-h-125 my-8 rounded-xl overflow-hidden shadow-2xl transition-transform duration-300 ${isVisible ? "scale-100" : "scale-90"}`}>
                
                {isLoading ? (
                    <div className="flex h-125 items-center justify-center text-white">Caricamento in corso...</div>
                ) : !movie ? (
                    <div className="flex h-125 flex-col items-center justify-center text-white space-y-4">
                        <p>Contenuto non trovato.</p>
                        <button onClick={closeModal} className="px-4 py-2 bg-white text-black rounded font-bold">Chiudi</button>
                    </div>
                ) : (
                    <>
                        <div className="relative aspect-video w-full bg-zinc-900">
                            <Image
                                src={movie.heroImage}
                                className="object-cover"
                                alt={movie.title}
                                fill
                                unoptimized
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-[#181818] via-transparent to-transparent" />

                            <button onClick={closeModal} className="absolute top-4 right-4 p-2 bg-[#181818] rounded-full text-white hover:bg-white/20 transition z-10">
                                <X size={24} />
                            </button>

                            <div className="absolute bottom-10 left-10 right-10 z-10">
                                <h2 className="text-4xl md:text-5xl font-black mb-6 uppercase italic tracking-tighter drop-shadow-lg text-white">
                                    {movie.title}
                                </h2>
                                <div className="flex items-center gap-3">
                                    <Link href={`/watch/${watchTargetId ?? id}`}>
                                        <button className="flex items-center gap-2 bg-white text-black px-8 py-2.5 rounded shadow hover:bg-white/80 transition font-bold">
                                            <Play fill="black" size={20}/>
                                            {resumeTime || Object.keys(episodeResumeTimes).length > 0 ? `Riprendi · ${formatResumeTime(resumeTime ?? Object.values(episodeResumeTimes)[0] ?? 0)}` : "Riproduci"}
                                        </button>
                                    </Link>
                                    <button
                                        onClick={handleToggleFavorite}
                                        disabled={isFavoriteLoading || !selectedProfile?.id_profilo}
                                        className={`p-2 border-2 rounded-full transition ${isFavorite ? "border-emerald-500 bg-emerald-500/20 text-emerald-400" : "border-zinc-500 text-white hover:border-white"} ${isFavoriteLoading ? "opacity-70" : ""}`}
                                    >
                                        {isFavorite ? <Check size={22} /> : <Plus size={22} />}
                                    </button>
                                    <button className="p-2 border-2 border-zinc-500 rounded-full text-white hover:border-white transition"><ThumbsUp size={20} /></button>
                                    <div className="ml-auto"><Volume2 className="text-zinc-500 hover:text-white cursor-pointer" /></div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 md:p-12 flex flex-col md:flex-row gap-8 md:gap-12 text-white">
                            <div className={`${(movie.cast.length > 0 || movie.genres.length > 0) ? 'md:w-[65%]' : 'w-full'} space-y-6`}>
                                <div className="flex items-center gap-2 text-sm font-semibold">
                                    <span className="text-green-500 font-bold text-lg">98% Compatibile</span>
                                    <span className="text-zinc-400">{movie.year}</span>
                                    <span className="border border-zinc-500 px-1.5 py-0.5 text-[12px] rounded-sm">{movie.maturity}</span>
                                    <span className="text-zinc-400">{movie.duration}</span>
                                    <span className="border border-zinc-600 px-1 text-[10px] rounded-sm">HD</span>
                                </div>
                                <p className="text-lg md:text-xl leading-relaxed">
                                    {movie.description}
                                </p>
                            </div>

                            {(movie.cast.length > 0 || movie.genres.length > 0) && (
                                <div className="md:w-[35%] text-[14px] space-y-4 leading-tight">
                                    {movie.cast.length > 0 && (
                                        <p>
                                            <span className="text-zinc-500">Cast:</span>{' '}
                                            <span className="text-zinc-200">{movie.cast.join(", ")}</span>
                                        </p>
                                    )}
                                    {movie.genres.length > 0 && (
                                        <p>
                                            <span className="text-zinc-500">Generi:</span>{' '}
                                            <span className="text-zinc-200">{movie.genres.join(", ")}</span>
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {movie.episodes.length > 0 && (
                            <div className="px-8 md:px-12 pb-16 text-white">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-bold">Episodi</h3>
                                    
                                    {availableSeasons.length > 1 && (
                                        <div className="relative inline-block">
                                            <select 
                                                value={selectedSeason}
                                                onChange={(e) => setSelectedSeason(Number(e.target.value))}
                                                className="bg-[#242424] text-white border border-zinc-700 px-4 py-2 pr-10 rounded font-semibold text-lg outline-none cursor-pointer appearance-none hover:bg-[#333333] transition focus:ring-2 focus:ring-white/30"
                                            >
                                                {availableSeasons.map(seasonNum => (
                                                    <option key={seasonNum} value={seasonNum}>
                                                        Stagione {seasonNum}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white" size={20} />
                                        </div>
                                    )}
                                    {availableSeasons.length === 1 && (
                                        <span className="text-zinc-400 font-semibold text-lg">
                                            Stagione {availableSeasons[0]}
                                        </span>
                                    )}
                                </div>

                                <div className="flex flex-col">
                                    {displayedEpisodes.map((ep, i) => (
                                        <div 
                                            key={i} 
                                            onClick={() => router.push(`/watch/${ep.id}`)}
                                            className="flex items-center gap-6 p-6 rounded-lg hover:bg-[#2f2f2f] transition cursor-pointer group border-b border-zinc-800 last:border-0"
                                        >
                                            <span className="text-2xl font-bold text-zinc-500 w-4">{i + 1}</span>
                                            <div className="w-36 md:w-44 aspect-video bg-zinc-800 rounded-md relative overflow-hidden shrink-0">
                                                <Image 
                                                    src={ep.image} 
                                                    className="object-cover" 
                                                    alt={`Copertina episodio ${i + 1}`}
                                                    fill 
                                                    unoptimized
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition z-10">
                                                    <Play size={30} className="text-white" />
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-bold text-lg leading-tight">{ep.title}</h4>
                                                    <span className={`font-semibold ${episodeResumeTimes[ep.id] ? "text-emerald-400" : "text-zinc-400"}`}>
                                                        {episodeResumeTimes[ep.id] ? `Riprendi · ${formatResumeTime(episodeResumeTimes[ep.id])}` : ep.time}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-zinc-400 line-clamp-2">
                                                    {ep.desc}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}