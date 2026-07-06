"use client";

import { useEffect, useRef, useState, use } from "react";
import { useRouter } from "next/navigation";
import Hls from "hls.js";

interface WatchPageProps {
    params: Promise<{ id: string }>;
}

export default function WatchPage({ params }: WatchPageProps) {
    const router = useRouter();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [error, setError] = useState<string | null>(null);
    
    // Risoluzione asincrona dei parametri (Standard Next.js 15+)
    const resolvedParams = use(params);
    const targetId = resolvedParams.id;

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !targetId) return;

        // L'URL dello stream corrisponde ESATTAMENTE alla nostra nuova API
        const streamUrl = `/api/watch/${targetId}`;
        let hls: Hls;

        if (Hls.isSupported()) {
            hls = new Hls({
                startLevel: -1, 
                capLevelToPlayerSize: true,
            });

            hls.loadSource(streamUrl);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video.play().catch((e) => {
                    console.log("Autoplay bloccato. Richiesta interazione utente.", e);
                });
            });

            hls.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) {
                    console.error("Errore fatale player HLS:", data);
                    setError("Impossibile caricare il flusso multimediale.");
                    hls.destroy();
                }
            });
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            // Fallback per Safari
            video.src = streamUrl;
            video.addEventListener("loadedmetadata", () => {
                video.play().catch((e) => console.log("Autoplay bloccato.", e));
            });
            video.addEventListener("error", () => {
                setError("Errore nel caricamento del video nativo.");
            });
        }

        return () => {
            if (hls) {
                hls.destroy();
            }
        };
    }, [targetId]);

    return (
        <div className="relative w-full h-screen bg-black flex items-center justify-center">
            {/* Pulsante Indietro */}
            <button 
                onClick={() => router.back()}
                className="absolute top-6 left-6 z-50 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition"
                aria-label="Torna indietro"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
            </button>

            {/* Messaggio di Errore */}
            {error && (
                <div className="absolute inset-0 flex items-center justify-center z-40 text-white flex-col gap-4">
                    <p className="text-xl font-semibold">{error}</p>
                    <button onClick={() => router.back()} className="px-6 py-2 bg-white text-black rounded-md font-bold">
                        Torna alla Home
                    </button>
                </div>
            )}

            {/* Player Video */}
            <video
                ref={videoRef}
                className="w-full h-full object-contain"
                controls
                autoPlay
                playsInline
            />
        </div>
    );
}