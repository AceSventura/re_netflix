'use client';

import { useState, useEffect, useRef, use } from 'react';
import Image from 'next/image';
import {
  ArrowLeft, RotateCcw, RotateCw, Play, Pause, SkipForward, Volume2, VolumeX, Maximize, MessageSquare, Copy
} from 'lucide-react';
import { useRouter } from 'next/navigation'; 
import Hls from 'hls.js';
import { getMediaDetails } from "@/app/actions/media";

interface PageProps {
  params: Promise<{ id: string }>;
}

type ContentMetadata = {
  id: string;
  titolo: string;
  descrizione?: string;
  tipo: 'film' | 'serie_tv';
  titoloSerie?: string;
  episodi?: {
    id: string;
    title: string;
    description: string;
    episodeNumber: number;
    seasonNumber: number;
    isCurrent: boolean;
    image?: string;
  }[];
};

interface MediaTrack {
  name?: string;
  language?: string;
  id?: number;
  [key: string]: unknown;
}

export default function WatchPage({ params }: PageProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  
  const resolvedParams = use(params);
  const targetId = resolvedParams.id;

  const [metadata, setMetadata] = useState<ContentMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  
  const [showEpisodes, setShowEpisodes] = useState(false);
  const [showAudioSub, setShowAudioSub] = useState(false);
  
  const [audioTracks, setAudioTracks] = useState<MediaTrack[]>([]);
  const [subtitleTracks, setSubtitleTracks] = useState<MediaTrack[]>([]);
  const [currentAudio, setCurrentAudio] = useState<number>(0);
  const [currentSubtitle, setCurrentSubtitle] = useState<number>(-1);

  const currentEp = metadata?.tipo === 'serie_tv' ? metadata.episodi?.find(ep => ep.isCurrent) : null;
  const currentEpIndex = metadata?.episodi?.findIndex(ep => ep.isCurrent) ?? -1;
  const nextEpisode = (currentEpIndex !== -1 && metadata?.episodi) ? metadata.episodi[currentEpIndex + 1] : null;

  useEffect(() => {
    const fetchUIContent = async () => {
      try {
        const details = await getMediaDetails(targetId, 'serie_tv'); 
        if (details) {
            setMetadata(details as unknown as ContentMetadata);
        }
      } catch (err) {
        console.error("Errore recupero testi interfaccia", err);
      }
    };
    fetchUIContent();
  }, [targetId]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !targetId) return;

    const streamUrl = `/api/watch/${targetId}`;
    let hls: Hls;

    if (Hls.isSupported()) {
        hls = new Hls({
            startLevel: -1, 
            capLevelToPlayerSize: true,
        });

        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        hlsRef.current = hls;

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            setAudioTracks((hls.audioTracks as unknown as MediaTrack[]) || []);
            setSubtitleTracks((hls.subtitleTracks as unknown as MediaTrack[]) || []);
            
            video.play().catch((e) => console.log("Autoplay bloccato.", e));
            setIsPlaying(true);
        });

        hls.on(Hls.Events.AUDIO_TRACKS_UPDATED, (event, data) => {
            setAudioTracks((data.audioTracks as unknown as MediaTrack[]) || (hls.audioTracks as unknown as MediaTrack[]) || []);
        });

        hls.on(Hls.Events.SUBTITLE_TRACKS_UPDATED, (event, data) => {
            setSubtitleTracks((data.subtitleTracks as unknown as MediaTrack[]) || (hls.subtitleTracks as unknown as MediaTrack[]) || []);
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
                console.error("Errore fatale HLS:", data.type, data.details);
                setError("Impossibile caricare il flusso multimediale.");
                hls.destroy();
            }
        });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = streamUrl;
        video.addEventListener("loadedmetadata", () => {
            video.play().catch((e) => console.log("Autoplay bloccato.", e));
            setIsPlaying(true);
        });
    }

    return () => {
        if (hls) hls.destroy();
    };
  }, [targetId]);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => setIsPlaying(false));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.volume = isMuted ? 0 : volume / 100;
  }, [volume, isMuted]);

  useEffect(() => {
    if (!showControls) return;
    const timer = setTimeout(() => setShowControls(false), 4000);
    return () => clearTimeout(timer);
  }, [showControls, showEpisodes, showAudioSub]); 

  const handleAudioChange = (index: number) => {
    if (hlsRef.current) {
        hlsRef.current.audioTrack = index;
        setCurrentAudio(index);
    }
  };

  const handleSubtitleChange = (index: number) => {
    if (hlsRef.current) {
        hlsRef.current.subtitleTrack = index;
        setCurrentSubtitle(index);
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return h > 0 ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}` : `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full h-screen bg-black text-white flex flex-col overflow-hidden" onMouseMove={() => setShowControls(true)}>
      <div className="relative w-full flex-1 bg-black overflow-hidden" onMouseLeave={() => !showEpisodes && !showAudioSub && setShowControls(false)}>
        
        {error && (
            <div className="absolute inset-0 flex items-center justify-center z-40 text-white flex-col gap-4 bg-black">
                <p className="text-xl font-semibold">{error}</p>
                <button onClick={() => router.back()} className="px-6 py-2 bg-white text-black rounded-md font-bold hover:bg-gray-200 transition">
                    Torna indietro
                </button>
            </div>
        )}

        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          playsInline
          onClick={() => { 
            setIsPlaying(!isPlaying); 
            setShowEpisodes(false); 
            setShowAudioSub(false); 
          }}
          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        />

        {showControls && (
          <div className="absolute inset-0 z-10 flex flex-col justify-between">
            <div className="pt-8 px-8 bg-linear-to-b from-black/80 to-transparent pb-16">
                <button onClick={() => router.back()} className="hover:text-gray-300 transition">
                  <ArrowLeft size={40} />
                </button>
            </div>

            <div className="bg-linear-to-t from-black/90 via-black/60 to-transparent px-8 py-8 flex flex-col gap-4">
              
              <div className="relative w-full h-1 bg-white/20 cursor-pointer" onClick={(e) => {
                if (videoRef.current && duration > 0) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pos = (e.clientX - rect.left) / rect.width;
                  videoRef.current.currentTime = pos * duration;
                }
              }}>
                <div className="absolute top-0 left-0 h-full bg-red-600" style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }} />
              </div>

              <div className="flex items-center justify-between mt-2 relative">
                
                {/* SETTORE SINISTRO */}
                <div className="flex items-center gap-6">
                  <button onClick={() => setIsPlaying(!isPlaying)} className="hover:scale-110 transition">
                    {isPlaying ? <Pause size={32} fill="white" /> : <Play size={32} fill="white" />}
                  </button>
                  <button onClick={() => videoRef.current && (videoRef.current.currentTime -= 10)} className="hover:text-gray-300 transition" title="Indietro 10s">
                    <RotateCcw size={32} />
                  </button>
                  <button onClick={() => videoRef.current && (videoRef.current.currentTime += 10)} className="hover:text-gray-300 transition" title="Avanti 10s">
                    <RotateCw size={32} />
                  </button>
                  <div className="flex items-center gap-3 group">
                    <button onClick={() => setIsMuted(!isMuted)} className="hover:text-gray-300 transition">
                      {isMuted || volume === 0 ? <VolumeX size={32} /> : <Volume2 size={32} />}
                    </button>
                    <input type="range" min="0" max="100" value={volume} onChange={(e) => setVolume(parseInt(e.target.value))} className="w-0 opacity-0 group-hover:w-24 group-hover:opacity-100 transition-all duration-300 accent-white h-1 bg-white/30 rounded-lg appearance-none cursor-pointer" />
                  </div>
                  <span className="text-sm font-light ml-2">{formatTime(currentTime)} / {formatTime(duration)}</span>
                </div>

                {/* SETTORE CENTRALE (Titolo Episodio - Centrato Assoluto) */}
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-none">
                  {metadata?.tipo === 'serie_tv' ? (
                    <>
                        <span className="text-lg font-bold">{metadata.titoloSerie}</span>
                        <span className="text-lg text-gray-300 font-light">
                            {currentEp ? `E${currentEp.episodeNumber} ${currentEp.title}` : metadata.titolo}
                        </span>
                    </>
                  ) : (
                    <span className="text-lg font-bold">{metadata?.titolo}</span>
                  )}
                </div>

                {/* SETTORE DESTRO */}
                <div className="flex items-center gap-6 relative">
                  
                  {nextEpisode && (
                    <button onClick={() => router.push(`/watch/${nextEpisode.id}`)} className="hover:text-gray-300 transition" title="Prossimo Episodio">
                        <SkipForward size={32} />
                    </button>
                  )}

                  <div className="relative">
                    <button onClick={() => { setShowAudioSub(!showAudioSub); setShowEpisodes(false); }} className={`transition ${showAudioSub ? 'text-white' : 'text-gray-300 hover:text-white'}`}>
                        <MessageSquare size={32} />
                    </button>
                    
                    {showAudioSub && (
                        <div className="absolute bottom-16 right-0 bg-[#181818] rounded-md p-6 flex gap-12 w-max shadow-2xl border border-zinc-800">
                            <div className="flex flex-col gap-4">
                                <h3 className="text-xl font-bold mb-2">Audio</h3>
                                {audioTracks.length > 0 ? (
                                    audioTracks.map((track, i) => (
                                        <span key={i} onClick={() => handleAudioChange(i)} className={`cursor-pointer hover:underline text-lg ${currentAudio === i ? 'text-white font-bold' : 'text-zinc-400'}`}>
                                            {track.name || `Traccia ${i + 1}`}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-white font-bold text-lg">Audio Originale</span>
                                )}
                            </div>
                            <div className="flex flex-col gap-4">
                                <h3 className="text-xl font-bold mb-2">Sottotitoli</h3>
                                <span onClick={() => handleSubtitleChange(-1)} className={`cursor-pointer hover:underline text-lg ${currentSubtitle === -1 ? 'text-white font-bold' : 'text-zinc-400'}`}>Disattivati</span>
                                {subtitleTracks.map((track, i) => (
                                    <span key={i} onClick={() => handleSubtitleChange(i)} className={`cursor-pointer hover:underline text-lg ${currentSubtitle === i ? 'text-white font-bold' : 'text-zinc-400'}`}>
                                        {track.name || `Traccia ${i + 1}`}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                  </div>

                  {metadata?.tipo === 'serie_tv' && (
                    <button onClick={() => { setShowEpisodes(!showEpisodes); setShowAudioSub(false); }} className={`transition ${showEpisodes ? 'text-white' : 'text-gray-300 hover:text-white'}`}>
                      <Copy size={32} />
                    </button>
                  )}

                  <button onClick={() => videoRef.current?.requestFullscreen()} className="hover:text-gray-300 transition">
                      <Maximize size={32} />
                  </button>

                </div>
              </div>
            </div>
          </div>
        )}

        {showEpisodes && metadata?.tipo === 'serie_tv' && (
          <div className="absolute right-0 top-0 bottom-24 w-[450px] bg-[#181818] z-20 overflow-y-auto shadow-2xl flex flex-col">
            <div className="flex flex-col py-4">
              {metadata.episodi?.map((ep) => {
                if (ep.isCurrent) {
                  return (
                    <div key={ep.id} className="border border-white p-4 mx-4 my-2 bg-[#181818]">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex gap-4 items-center">
                          <span className="text-xl font-bold">{ep.episodeNumber}</span>
                          <span className="text-lg font-bold">{ep.title}</span>
                        </div>
                        <div className="w-24 h-[2px] bg-zinc-700 relative">
                          <div className="absolute top-0 left-0 h-full bg-red-600 w-1/3"></div>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-40 shrink-0 aspect-video bg-zinc-800 relative overflow-hidden rounded">
                          {ep.image && (
                            <Image 
                              src={ep.image} 
                              alt={ep.title} 
                              fill
                              sizes="160px"
                              className="object-cover" 
                            />
                          )}
                        </div>
                        <p className="text-sm text-zinc-300 line-clamp-4 leading-snug">
                          {ep.description}
                        </p>
                      </div>
                    </div>
                  );
                }

                return (
                  <div 
                    key={ep.id} 
                    onClick={() => {
                      setShowEpisodes(false);
                      setIsPlaying(false); 
                      router.push(`/watch/${ep.id}`); 
                    }}
                    className="flex justify-between items-center py-4 mx-8 border-b border-zinc-800 hover:bg-white/5 transition cursor-pointer"
                  >
                    <div className="flex gap-4 items-center">
                      <span className="text-xl font-bold text-zinc-300">{ep.episodeNumber}</span>
                      <span className="text-lg font-medium text-zinc-300">{ep.title}</span>
                    </div>
                    <div className="w-20 h-[2px] bg-zinc-700"></div>
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