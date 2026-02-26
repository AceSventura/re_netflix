'use client';

import { useState, useEffect, useRef } from 'react'; // Aggiunto useRef
import { ChevronLeft, Settings, SkipBack, Play, Pause, SkipForward, Volume2, VolumeX, Maximize } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { StreamingContent } from '@/lib/types/streaming';

interface PageProps {
    params: Promise<{ id: string }>;
}

type ContentMetadata = StreamingContent;

export default function WatchPage({ params }: PageProps) {
    const router = useRouter();
    const videoRef = useRef<HTMLVideoElement>(null); // Riferimento al video

    const [metadata, setMetadata] = useState<ContentMetadata | null>(null);
    const [loading, setLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false); // Meglio partire da false o gestire l'autoplay
    const [volume, setVolume] = useState(100);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showControls, setShowControls] = useState(true);

    // 1. Caricamento Metadati
    useEffect(() => {
        const unwrapParams = async () => {
            const { id: contentId } = await params;
            await fetchContentMetadata(contentId);
        };
        unwrapParams();
    }, [params]);

    // 2. SINCRONIZZAZIONE PLAY/PAUSE
    useEffect(() => {
        if (!videoRef.current) return;

        if (isPlaying) {
            // play() restituisce una promise, gestiamo il possibile blocco del browser
            videoRef.current.play().catch(error => {
                console.error("Autoplay bloccato:", error);
                setIsPlaying(false);
            });
        } else {
            videoRef.current.pause();
        }
    }, [isPlaying]);

    // 3. SINCRONIZZAZIONE VOLUME
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.volume = isMuted ? 0 : volume / 100;
        }
    }, [volume, isMuted]);

    // Timer per nascondere i controlli
    useEffect(() => {
        if (!showControls) return;
        const timer = setTimeout(() => setShowControls(false), 3000);
        return () => clearTimeout(timer);
    }, [showControls]);

    const fetchContentMetadata = async (contentId: string) => {
        try {
            const response = await fetch(`/api/watch/${contentId}`);
            const result = await response.json();
            if (result.success && result.data) {
                setMetadata(result.data);
            }
            setLoading(false);
        } catch (error) {
            console.error('Errore:', error);
            setLoading(false);
        }
    };

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        return h > 0 
            ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
            : `${m}:${s.toString().padStart(2, '0')}`;
    };

    if (loading) return <div className="w-full h-screen bg-black flex items-center justify-center text-white text-2xl">Caricamento...</div>;
    if (!metadata) return <div className="w-full h-screen bg-black flex items-center justify-center text-white">Contenuto non trovato</div>;

    return (
        <div className="w-full h-screen bg-black text-white flex flex-col group/player overflow-hidden" onMouseMove={() => setShowControls(true)}>
            <div className="relative w-full flex-1 bg-black overflow-hidden" onMouseLeave={() => setShowControls(false)}>
                
                <video
                    ref={videoRef} // Collegamento del ref
                    className="w-full h-full object-contain" // object-contain è meglio per i film
                    playsInline
                    onClick={() => setIsPlaying(!isPlaying)}
                    onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                    onLoadedMetadata={(e) => {
                        setDuration(e.currentTarget.duration);
                        // Se vuoi l'autoplay all'inizio:
                        setIsPlaying(true);
                    }}
                >
                    <source src={metadata.streaming.videoUrl} type="video/mp4" />
                </video>

                {showControls && (
                    <>
                        {/* HEADER */}
                        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/80 to-transparent px-8 flex items-center justify-between">
                            <button onClick={() => router.back()} className="p-2 hover:bg-white/20 rounded-full transition">
                                <ChevronLeft size={32} />
                            </button>
                            <h2 className="text-xl font-medium">{metadata.titolo}</h2>
                            <button className="p-2 hover:bg-white/20 rounded-full"><Settings size={28} /></button>
                        </div>

                        {/* BOTTOM CONTROLS */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent px-8 py-10">
                            
                            {/* PROGRESS BAR */}
                            <div className="mb-6 flex items-center gap-4 group/progress">
                                <div 
                                    className="relative w-full h-1.5 bg-white/30 rounded-full cursor-pointer"
                                    onClick={(e) => {
                                        if (videoRef.current) {
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            const pos = (e.clientX - rect.left) / rect.width;
                                            videoRef.current.currentTime = pos * duration;
                                        }
                                    }}
                                >
                                    <div 
                                        className="absolute top-0 left-0 h-full bg-red-600 rounded-full"
                                        style={{ width: `${(currentTime / duration) * 100}%` }}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <button onClick={() => setIsPlaying(!isPlaying)}>
                                        {isPlaying ? <Pause size={30} fill="white" /> : <Play size={30} fill="white" />}
                                    </button>

                                    <button onClick={() => videoRef.current && (videoRef.current.currentTime -= 10)}>
                                        <SkipBack size={26} />
                                    </button>

                                    <button onClick={() => videoRef.current && (videoRef.current.currentTime += 10)}>
                                        <SkipForward size={26} />
                                    </button>

                                    <div className="flex items-center gap-2 group/volume">
                                        <button onClick={() => setIsMuted(!isMuted)}>
                                            {isMuted || volume === 0 ? <VolumeX size={26} /> : <Volume2 size={26} />}
                                        </button>
                                        <input 
                                            type="range" min="0" max="100" value={volume} 
                                            onChange={(e) => setVolume(parseInt(e.target.value))}
                                            className="w-24 accent-red-600"
                                        />
                                    </div>

                                    <span className="text-sm font-light">
                                        {formatTime(currentTime)} / {formatTime(duration)}
                                    </span>
                                </div>

                                <button onClick={() => videoRef.current?.requestFullscreen()}>
                                    <Maximize size={26} />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}