"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Hls from "hls.js";
import { getMediaDetails } from "@/app/actions/media";
import { VolumeX, Volume2, Play, Info, Loader2 } from "lucide-react";

interface HeroProps {
    item: {
        id: string;
        title: string;
        description?: string;
        poster: string;
        type: string;
    };
}

export default function Hero({ item }: HeroProps) {
    const router = useRouter();
    const videoRef = useRef<HTMLVideoElement>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [streamUrl, setStreamUrl] = useState<string | null>(null);

    // 1. Risoluzione asincrona dell'URL
    useEffect(() => {
        const resolveStreamUrl = async () => {
            try {
                let targetId = item.id;
                
                const isSerie = item.type?.toLowerCase().includes("serie");

                if (isSerie) {
                    const details = await getMediaDetails(item.id, item.type);
                    if (details?.episodes && details.episodes.length > 0) {
                        targetId = details.episodes[0].id;
                    } else {
                        return; 
                    }
                }

                const url = `/api/watch/${targetId}`;
                console.log("Stream URL impostato su:", url);
                setStreamUrl(url);

            } catch (error) {
                console.error("Errore nella risoluzione dell'ID per la Hero:", error);
            }
        };

        resolveStreamUrl();
    }, [item.id, item.type]);

    // 2. Inizializzazione di hls.js
    useEffect(() => {
        const video = videoRef.current;
        if (!video || !streamUrl) return;

        let hls: Hls;

        if (Hls.isSupported()) {
            hls = new Hls({
                startLevel: -1,
                capLevelToPlayerSize: true
            });
            
            hls.loadSource(streamUrl);
            hls.attachMedia(video);
            
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video.play().catch((e) => console.error("Autoplay bloccato:", e));
            });

            hls.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) {
                    console.warn(`[Hero] Video in background non disponibile: ${data.type} - ${data.details}`);
                    hls.destroy();
                }
            });
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = streamUrl;
            video.addEventListener("loadedmetadata", () => {
                video.play().catch((e) => console.error("Autoplay bloccato (Nativo):", e));
            });
        }

        return () => {
            if (hls) {
                hls.stopLoad();
                hls.detachMedia();
                hls.destroy();
            }
            if (video) {
                video.removeAttribute('src');
                video.load();
            }
        };
    }, [streamUrl]);

    // Instradamento manuale per il player a schermo intero
    const handlePlay = async () => {
        if (isLoading) return;
        setIsLoading(true);

        try {
            const isSerie = item.type?.toLowerCase().includes("serie");

            if (!isSerie) {
                router.push(`/watch/${item.id}?type=${item.type}`);
            } else {
                const details = await getMediaDetails(item.id, item.type);
                if (details?.episodes && details.episodes.length > 0) {
                    const firstEpisodeId = details.episodes[0].id; 
                    router.push(`/watch/${firstEpisodeId}?type=serie_tv`);
                }
            }
        } catch (error) {
            console.error("Errore durante l'instradamento:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMute = () => {
        setIsMuted((prev) => !prev);
    };

    return (
        <section className="relative w-full h-[70vh] mb-12 bg-[#141414]">
            {/* BACKGROUND IMAGE FALLBACK */}
            {!streamUrl && (
                <Image 
                    src={item.poster} 
                    alt={item.title} 
                    fill
                    priority
                    className="object-cover opacity-60"
                />
            )}

            {/* VIDEO BACKGROUND */}
            {streamUrl && (
                <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    loop
                    playsInline
                    muted={isMuted} // Legame imperativo con lo stato React
                />
            )}

            {/* OVERLAY OSCURANTE */}
            <div className="absolute inset-0 bg-linear-to-t from-[#141414] via-[#141414]/20 to-transparent"></div>
            <div className="absolute inset-0 bg-linear-to-r from-[#141414] via-[#141414]/40 to-transparent w-2/3"></div>

            {/* CONTENUTO TESTO */}
            <div className="absolute bottom-20 left-10 text-white max-w-xl z-10">
                <h1 className="text-5xl font-bold mb-4 drop-shadow-lg uppercase tracking-tight">
                    {item.title}
                </h1>
                
                <p className="text-lg mb-6 max-w-lg drop-shadow-md line-clamp-3">
                    {item.description}
                </p>

                <div className="flex gap-4">
                    <button 
                        onClick={handlePlay}
                        disabled={isLoading}
                        className="bg-white text-black px-6 py-3 rounded-md font-semibold hover:bg-gray-300 transition disabled:opacity-50 flex items-center justify-center min-w-37.5 gap-2"
                    >
                        {isLoading ? <Loader2 className="animate-spin text-black" size={24} /> : <Play fill="black" size={24} />}
                        {isLoading ? "Caricamento" : "Riproduci"}
                    </button>

                    <Link href={`?id=${item.id}&type=${item.type}`} scroll={false}>
                        <button className="bg-gray-700/70 text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-600 transition flex items-center justify-center gap-2">
                            <Info size={24} />
                            Altre info
                        </button>
                    </Link>
                </div>
            </div>

            {/* PULSANTE GESTIONE AUDIO */}
            {streamUrl && (
                <div className="absolute bottom-20 right-10 z-10 flex items-center gap-4">
                    <button 
                        onClick={toggleMute}
                        className="p-3 rounded-full border border-gray-400 bg-black/20 text-white hover:bg-white/10 transition flex items-center justify-center"
                        aria-label={isMuted ? "Attiva audio" : "Disattiva audio"}
                    >
                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                    <div className="border-l-4 border-white/80 bg-black/40 text-white text-lg py-1 px-4 rounded-l-md shadow-md backdrop-blur-sm select-none hidden md:block">
                        T
                    </div>
                </div>
            )}
        </section>
    );
}