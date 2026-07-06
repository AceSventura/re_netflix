'use client';

import { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft, Settings, SkipBack, Play, Pause, SkipForward, Volume2, VolumeX, Maximize, List, ArrowLeft
} from 'lucide-react';
import { useRouter } from 'next/navigation'; 
import Hls from 'hls.js';

interface PageProps {
  params: Promise<{ id: string }>;
}

// Interfaccia allineata al nuovo payload dell'API
type ContentMetadata = {
  id: string;
  titolo: string;
  descrizione?: string;
  tipo: 'film' | 'serie_tv';
  titoloSerie?: string;
  stagioneCorrente?: number;
  streaming?: { videoUrl: string };
  episodi?: {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
    episodeNumber: number;
    seasonNumber: number;
    isCurrent: boolean;
    image?: string; // Aggiunto per renderizzare la miniatura dell'episodio espanso
  }[];
};

export default function WatchPage({ params }: PageProps) {
  const router = useRouter();

  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [metadata, setMetadata] = useState<ContentMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Stati del player
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  
  // Stati Menu Serie TV
  const [showEpisodes, setShowEpisodes] = useState(false);

  // Derivazione dinamica basata interamente sui dati dell'API
  const activeVideoUrl = metadata?.streaming?.videoUrl;
  const currentEp = metadata?.tipo === 'serie_tv' ? metadata.episodi?.find(ep => ep.isCurrent) : null;
  
  const activeTitle = metadata?.tipo === 'serie_tv' && currentEp
    ? `${metadata.titoloSerie} - S${currentEp.seasonNumber} E${currentEp.episodeNumber}: ${metadata.titolo}` 
    : metadata?.titolo;

  // Fetching dati pulito
  useEffect(() => {
    const fetchContent = async () => {
      const { id: contentId } = await params;
      try {
        const response = await fetch(`/api/watch/${contentId}`);
        const result = await response.json();
        if (result.success) setMetadata(result.data);
      } catch (error) {
        console.error('Errore API:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [params]);

  // Inizializzazione HLS
  useEffect(() => {
    if (!activeVideoUrl || !videoRef.current) return;

    const video = videoRef.current;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(activeVideoUrl);
      hls.attachMedia(video);
      hlsRef.current = hls;
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = activeVideoUrl;
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [activeVideoUrl]); 

  // Sincronizzazione Play/Pause
  useEffect(() => {
    if (videoRef.current) {
      isPlaying ? videoRef.current.play().catch(() => setIsPlaying(false)) : videoRef.current.pause();
    }
  }, [isPlaying]);

  // Sincronizzazione Volume
  useEffect(() => {
    if (videoRef.current) videoRef.current.volume = isMuted ? 0 : volume / 100;
  }, [volume, isMuted]);

  // Autohide Controlli
  useEffect(() => {
    if (!showControls) return;
    const timer = setTimeout(() => setShowControls(false), 3500);
    return () => clearTimeout(timer);
  }, [showControls, showEpisodes]); 

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return h > 0 ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}` : `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) return <div className="w-full h-screen bg-black flex items-center justify-center text-white text-2xl">Caricamento...</div>;
  if (!metadata || !activeVideoUrl) return <div className="w-full h-screen bg-black flex items-center justify-center text-white">Video non disponibile</div>;

  return (
    <div className="w-full h-screen bg-black text-white flex flex-col overflow-hidden" onMouseMove={() => setShowControls(true)}>
      <div className="relative w-full flex-1 bg-black overflow-hidden" onMouseLeave={() => !showEpisodes && setShowControls(false)}>
        
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          playsInline
          onClick={() => { setIsPlaying(!isPlaying); setShowEpisodes(false); }}
          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => {
            setDuration(e.currentTarget.duration);
            setIsPlaying(true);
          }}
        />

        {showControls && (
          <>
            <div className="absolute top-0 left-0 right-0 pt-8 pb-16 bg-gradient-to-b from-black/90 to-transparent px-8 flex items-start justify-between z-10">
              <div className="flex gap-6 items-start">
                <button onClick={() => router.back()} className="p-2 hover:bg-white/20 rounded-full transition">
                  <ChevronLeft size={32} />
                </button>
                <div>
                  <h2 className="text-xl font-medium">{activeTitle}</h2>
                  <p className="text-sm text-gray-300 mt-2 max-w-2xl line-clamp-2">{metadata.descrizione}</p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent px-8 py-10 z-10">
              <div className="mb-6 flex items-center gap-4">
                <div className="relative w-full h-1.5 bg-white/30 rounded-full cursor-pointer" onClick={(e) => {
                  if (videoRef.current) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const pos = (e.clientX - rect.left) / rect.width;
                    videoRef.current.currentTime = pos * duration;
                  }
                }}>
                  <div className="absolute top-0 left-0 h-full bg-red-600 rounded-full" style={{ width: `${(currentTime / duration) * 100}%` }} />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <button onClick={() => setIsPlaying(!isPlaying)}>
                    {isPlaying ? <Pause size={30} fill="white" /> : <Play size={30} fill="white" />}
                  </button>
                  <button onClick={() => videoRef.current && (videoRef.current.currentTime -= 10)}><SkipBack size={26} /></button>
                  <button onClick={() => videoRef.current && (videoRef.current.currentTime += 10)}><SkipForward size={26} /></button>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setIsMuted(!isMuted)}>
                      {isMuted || volume === 0 ? <VolumeX size={26} /> : <Volume2 size={26} />}
                    </button>
                    <input type="range" min="0" max="100" value={volume} onChange={(e) => setVolume(parseInt(e.target.value))} className="w-24 accent-red-600" />
                  </div>
                  <span className="text-sm font-light">{formatTime(currentTime)} / {formatTime(duration)}</span>
                </div>

                <div className="flex items-center gap-6">
                  {metadata.tipo === 'serie_tv' && (
                    <button onClick={() => setShowEpisodes(!showEpisodes)} className={`hover:text-gray-300 transition ${showEpisodes ? 'text-red-500' : 'text-white'}`}>
                      <List size={26} />
                    </button>
                  )}
                  <button onClick={() => videoRef.current?.requestFullscreen()}><Maximize size={26} /></button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Pannello Laterale Episodi - Stile espanso/compresso come da immagine */}
        {showEpisodes && metadata.tipo === 'serie_tv' && (
          <div className="absolute right-0 top-0 bottom-24 w-[420px] bg-[#181818] z-20 overflow-y-auto shadow-2xl flex flex-col">
            
            {/* Intestazione fissa del pannello */}
            <div className="sticky top-0 bg-[#181818] z-10 flex items-center gap-4 p-6 border-b border-zinc-800">
              <button 
                onClick={() => setShowEpisodes(false)} 
                className="hover:text-gray-300 transition"
              >
                <ArrowLeft size={28} />
              </button>
              <h2 className="text-2xl font-bold">{metadata.titoloSerie}</h2>
            </div>

            {/* Lista Episodi Dinamica */}
            <div className="flex flex-col">
              {metadata.episodi?.map((ep) => {
                
                // Layout Espanso per l'episodio attualmente in visione
                if (ep.isCurrent) {
                  return (
                    <div key={ep.id} className="bg-[#242424] border-y border-white p-6 flex flex-col gap-4">
                      <div className="flex items-start gap-4">
                        <span className="text-xl font-bold w-6">{ep.episodeNumber}</span>
                        <h3 className="font-bold text-lg flex-1 leading-tight">{ep.title}</h3>
                        {/* Placeholder barra di progresso dell'episodio corrente */}
                        <div className="w-20 h-1 bg-zinc-600 mt-2">
                          <div className="h-full bg-red-600 w-1/3"></div>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-36 shrink-0 aspect-video bg-zinc-800 relative overflow-hidden rounded">
                          {/* Se l'immagine non è presente nell'API, verrà mostrato un fallback (o uno spazio grigio vuoto) */}
                          {ep.image && (
                            <img 
                              src={ep.image} 
                              alt={ep.title} 
                              className="object-cover w-full h-full" 
                            />
                          )}
                        </div>
                        <p className="text-sm text-gray-300 line-clamp-4 leading-snug">
                          {ep.description}
                        </p>
                      </div>
                    </div>
                  );
                }

                // Layout Compresso per tutti gli altri episodi (Cliccabili per navigare)
                return (
                  <div 
                    key={ep.id} 
                    onClick={() => {
                      setShowEpisodes(false);
                      setIsPlaying(false); 
                      router.push(`/watch/${ep.id}`); 
                    }}
                    className="flex items-center gap-4 p-6 hover:bg-white/5 transition cursor-pointer border-b border-zinc-800"
                  >
                    <span className="text-xl font-bold text-zinc-400 w-6">{ep.episodeNumber}</span>
                    <h3 className="font-bold text-zinc-300 flex-1 truncate">{ep.title}</h3>
                    {/* Placeholder barra di progresso episodi inattivi */}
                    <div className="w-20 h-1 bg-zinc-700"></div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}