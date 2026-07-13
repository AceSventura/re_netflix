'use client';

import { useState, useEffect, useRef, use, useCallback } from 'react';
import Image from 'next/image';
import {
  ArrowLeft, RotateCcw, RotateCw, Play, Pause, SkipForward, Volume2, VolumeX, Maximize, MessageSquare, Copy, Check
} from 'lucide-react';
import { useRouter } from 'next/navigation'; 
import Hls from 'hls.js';
import { getMediaDetails } from "@/app/actions/media";
import { useProfiles } from '@/context/ProfileContext';

// --- INTERFACCE E TIPI ---
interface PageProps {
  params: Promise<{ id: string }>;
}

// Allineato alla forma REALE restituita da getMediaDetails (vedi app/actions/media.ts).
// Nota: l'API non fornisce `isCurrent`, `episodeNumber` né `seasonNumber` — questi
// vengono derivati lato client qui sotto, confrontando ep.id con l'id della pagina
// corrente e calcolando la posizione all'interno della stagione filtrata.
type EpisodeApiShape = {
  id: string;
  title: string;
  desc: string;
  time: string;
  image?: string;
  season: number;
};

type ContentMetadata = {
  title: string;
  description?: string;
  heroImage?: string;
  tipo: 'film' | 'serie_tv';
  titoloSerie?: string;
  episodi?: EpisodeApiShape[];
};

interface MediaTrack {
  name?: string;
  language?: string;
  id?: number;
  [key: string]: unknown;
}

export default function WatchPage({ params }: PageProps) {
  // --- INIZIALIZZAZIONE E REFERENZE ---
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null); // Puntatore diretto all'elemento DOM del video
  const hlsRef = useRef<Hls | null>(null); // Istanza del motore HLS.js
  const { selectedProfile } = useProfiles();
  const progressLastSavedRef = useRef<number | null>(null); // Memoria per evitare salvataggi API ridondanti
  
  // Risoluzione asincrona dei parametri URL (pattern React 19 / Next.js App Router)
  const resolvedParams = use(params);
  const targetId = resolvedParams.id;
  const profileId = selectedProfile?.id_profilo;

  // --- STATI: METADATI E UI ---
  const [metadata, setMetadata] = useState<ContentMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // --- STATI: MOTORE DI RIPRODUZIONE ---
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  
  // --- STATI: CONTROLLI SECONDARI ---
  const [showEpisodes, setShowEpisodes] = useState(false);
  const [showAudioSub, setShowAudioSub] = useState(false);
  // Vista attiva dentro la sidebar episodi: elenco episodi, oppure elenco stagioni
  // (schermo intero, stile Netflix) raggiunto cliccando sull'intestazione "Stagione N".
  const [sidebarView, setSidebarView] = useState<'episodes' | 'seasons'>('episodes');
  // Stagione mostrata nella sidebar episodi (indipendente dalla stagione dell'episodio in riproduzione).
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);

  // --- TRACCIAMENTO ID PER RESET DELLO STATO ---
  const [prevTargetId, setPrevTargetId] = useState(targetId);

  // --- RESET DI STATO QUANDO CAMBIA L'EPISODIO ---
  // Pattern React per aggiornare lo stato durante il render senza ricorrere a useEffect,
  // evitando re-render a cascata e avvisi sulle prestazioni.
  if (targetId !== prevTargetId) {
    setPrevTargetId(targetId);
    setSelectedSeason(null);
    setSidebarView('episodes');
  }
  
  const [audioTracks, setAudioTracks] = useState<MediaTrack[]>([]);
  const [subtitleTracks, setSubtitleTracks] = useState<MediaTrack[]>([]);
  const [currentAudio, setCurrentAudio] = useState<number>(0);
  const [currentSubtitle, setCurrentSubtitle] = useState<number>(-1);
  const [resumeTime, setResumeTime] = useState<number | null>(null);

  // --- CALCOLI DERIVATI: STAGIONI ED EPISODI ---
  // L'episodio "corrente" è determinato confrontando l'id con targetId (l'unica fonte
  // affidabile, dato che l'API non restituisce un flag isCurrent).
  const allEpisodes = metadata?.episodi ?? [];
  const currentEp = allEpisodes.find(ep => ep.id === targetId) ?? null;
  const currentEpIndexGlobal = allEpisodes.findIndex(ep => ep.id === targetId);
  const nextEpisode = currentEpIndexGlobal !== -1 ? allEpisodes[currentEpIndexGlobal + 1] ?? null : null;

  const availableSeasons = Array.from(new Set(allEpisodes.map(ep => ep.season))).sort((a, b) => a - b);
  const activeSeason = selectedSeason ?? currentEp?.season ?? availableSeasons[0] ?? 1;
  const episodesInSeason = allEpisodes.filter(ep => ep.season === activeSeason);

  // --- EFFETTO 1: RECUPERO METADATI ---
  // Carica i dati dell'interfaccia (titoli, liste episodi) per l'overlay del player.
  // Prova prima come serie TV; se il contenuto è un film (o l'id non corrisponde a
  // nessuna serie), ripiega su 'film'. In precedenza veniva chiamato solo con
  // 'serie_tv', quindi per i film i metadati non venivano mai caricati.
  useEffect(() => {
    const fetchUIContent = async () => {
      try {
        let details = await getMediaDetails(targetId, 'serie_tv');
        let tipo: 'film' | 'serie_tv' = 'serie_tv';

        if (!details) {
          details = await getMediaDetails(targetId, 'film');
          tipo = 'film';
        }

        if (details) {
          const episodi = (details.episodes ?? []) as EpisodeApiShape[];
          setMetadata({
            title: details.title,
            description: details.description,
            heroImage: details.heroImage,
            tipo: episodi.length > 0 ? 'serie_tv' : tipo,
            titoloSerie: episodi.length > 0 ? details.title : undefined,
            episodi,
          });
        }
      } catch (err) {
        console.error("Errore recupero testi interfaccia", err);
      }
    };
    fetchUIContent();
  }, [targetId]);

  // --- EFFETTO 2: INIZIALIZZAZIONE PROGRESSO STORICO ---
  // Interroga il database per verificare se l'utente ha una sessione di visione precedente da ripristinare.
  useEffect(() => {
    const loadProgress = async () => {
      if (!profileId || !targetId) {
        setResumeTime(null);
        progressLastSavedRef.current = null;
        return;
      }

      try {
        const response = await fetch(`/api/watch/${targetId}/progress?idProfilo=${profileId}`);
        if (!response.ok) return;

        const data = await response.json();
        const savedTime = data?.data?.durata_visualizzata;

        // Soglia di sicurezza: ignora salvataggi inferiori a 5 secondi.
        if (typeof savedTime === 'number' && savedTime > 5) {
          setResumeTime(savedTime);
          setCurrentTime(savedTime);
        } else {
          setResumeTime(null);
        }
      } catch (error) {
        console.error('Errore nel recupero del progresso:', error);
      }
    };

    loadProgress();
  }, [profileId, targetId]);

  // --- FUNZIONE: TELEMETRIA DI SALVATAGGIO ---
  // Memoizzata per evitare la ricreazione ad ogni render. Esegue la chiamata POST per aggiornare il DB.
  const saveProgress = useCallback(async (seconds: number, percentage: number) => {
    if (!profileId || !targetId || !Number.isFinite(seconds) || seconds < 5) return;

    try {
      await fetch(`/api/watch/${targetId}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idProfilo: profileId,
          durataVisualizzata: Math.floor(seconds),
          statoCompletamento: percentage,
        }),
      });
    } catch (error) {
      console.error('Errore nel salvataggio del progresso:', error);
    }
  }, [profileId, targetId]);

  // --- EFFETTO 3: APPLICAZIONE RIPRESA VISIONE ---
  // Sposta il cursore del player al tempo salvato non appena il video è caricato.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || resumeTime === null || duration <= 0) return;

    // Evita di superare la durata totale del video.
    const safeResumeTime = Math.min(Math.max(0, resumeTime), Math.max(0, duration - 1));
    video.currentTime = safeResumeTime;
  }, [resumeTime, duration]);

  // --- EFFETTO 4: POLLING SALVATAGGIO PROGRESSO (PERIODICO) ---
  // Salva automaticamente i progressi di visione ogni 10 secondi.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !profileId || !targetId) return;

    const interval = window.setInterval(() => {
      const current = Math.floor(video.currentTime);
      // Evita richieste API se il video non avanza.
      if (!Number.isFinite(current) || current < 5 || current === progressLastSavedRef.current) return;

      progressLastSavedRef.current = current;
      const percentage = duration > 0 ? Math.floor((current / duration) * 100) : 0;
      void saveProgress(current, percentage);
    }, 10000);

    return () => window.clearInterval(interval);
  }, [profileId, targetId, duration, saveProgress]);

  // --- EFFETTO 5: SALVATAGGIO PROGRESSO (ON UNMOUNT) ---
  // Garantisce il salvataggio esatto del minuto di abbandono quando il componente viene smontato (chiusura/navigazione).
  useEffect(() => {
    const video = videoRef.current;

    return () => {
      if (!video || !profileId || !targetId) return;

      const current = Math.floor(video.currentTime);
      if (!Number.isFinite(current) || current < 5 || current === progressLastSavedRef.current) return;

      progressLastSavedRef.current = current;
      const percentage = duration > 0 ? Math.floor((current / duration) * 100) : 0;
      void saveProgress(current, percentage);
    };
  }, [profileId, targetId, duration, saveProgress]);

  // --- EFFETTO 6: INIZIALIZZAZIONE HLS.JS ---
  // Cuore del sistema di streaming: converte il manifest m3u8 in un flusso video decodificabile.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !targetId) return;

    const streamUrl = `/api/watch/${targetId}`;
    let hls: Hls;

    // Controllo supporto estensione Media Source Extensions (MSE) standard nei browser desktop.
    if (Hls.isSupported()) {
        hls = new Hls({
            startLevel: -1, // Selezione automatica bitrate basata su banda.
            capLevelToPlayerSize: true, // Ottimizza la risoluzione scaricata in base alla dimensione della finestra.
        });

        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        hlsRef.current = hls;

        // Estrazione tracce audio e sottotitoli a parsing del manifest completato.
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            setAudioTracks((hls.audioTracks as unknown as MediaTrack[]) || []);
            setSubtitleTracks((hls.subtitleTracks as unknown as MediaTrack[]) || []);
            
            video.play().catch((e) => console.log("Autoplay bloccato dal browser.", e));
            setIsPlaying(true);
        });

        // Listener dinamici per aggiornamenti del manifesto (es. flussi live o segmenti aggiuntivi).
        hls.on(Hls.Events.AUDIO_TRACKS_UPDATED, (event, data) => {
            setAudioTracks((data.audioTracks as unknown as MediaTrack[]) || (hls.audioTracks as unknown as MediaTrack[]) || []);
        });

        hls.on(Hls.Events.SUBTITLE_TRACKS_UPDATED, (event, data) => {
            setSubtitleTracks((data.subtitleTracks as unknown as MediaTrack[]) || (hls.subtitleTracks as unknown as MediaTrack[]) || []);
        });

        // Gestione errori di rete o decodifica.
        hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
                console.error("Errore fatale HLS:", data.type, data.details);
                setError("Impossibile caricare il flusso multimediale.");
                hls.destroy();
            }
        });
    } 
    // Fallback per browser con supporto nativo HLS (principalmente Safari su iOS/macOS).
    else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = streamUrl;
        video.addEventListener("loadedmetadata", () => {
            video.play().catch((e) => console.log("Autoplay bloccato.", e));
            setIsPlaying(true);
        });
    }

    return () => {
        if (hls) hls.destroy(); // Previene memory leak alla distruzione del player.
    };
  }, [targetId]);

  // --- SINCRONIZZAZIONE STATO REACT -> DOM ---
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

  // --- GESTIONE INTERFACCIA: AUTO-HIDE CONTROLLI ---
  useEffect(() => {
    if (!showControls) return;
    const timer = setTimeout(() => setShowControls(false), 4000);
    return () => clearTimeout(timer);
  }, [showControls, showEpisodes, showAudioSub, sidebarView]); 

  // --- HANDLER SELEZIONI UTENTE ---
  const handleAudioChange = (index: number) => {
    if (hlsRef.current) {
        hlsRef.current.audioTrack = index;
        setCurrentAudio(index);
    }
  };

  const handleSubtitleChange = (index: number) => {
    if (hlsRef.current) {
        hlsRef.current.subtitleTrack = index; // Impostare a -1 disattiva i sottotitoli in HLS.js.
        setCurrentSubtitle(index);
    }
  };

  // Utility conversione secondi -> formato HH:MM:SS o MM:SS
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return h > 0 ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}` : `${m}:${s.toString().padStart(2, '0')}`;
  };

  // --- RENDER ---
  return (
    <div className="w-full h-screen bg-black text-white flex flex-col overflow-hidden" onMouseMove={() => setShowControls(true)}>
      <div className="relative w-full flex-1 bg-black overflow-hidden" onMouseLeave={() => !showEpisodes && !showAudioSub && setShowControls(false)}>
        
        {/* Overlay Errore Fatale */}
        {error && (
            <div className="absolute inset-0 flex items-center justify-center z-40 text-white flex-col gap-4 bg-black">
                <p className="text-xl font-semibold">{error}</p>
                <button onClick={() => router.back()} className="px-6 py-2 bg-white text-black rounded-md font-bold hover:bg-gray-200 transition">
                    Torna indietro
                </button>
            </div>
        )}

        {/* Livello Base: Elemento Video DOM */}
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

        {/* Livello Superiore: Controlli Overlay */}
        {showControls && (
          <div className="absolute inset-0 z-10 flex flex-col justify-between">
            {/* Barra Superiore (Navigazione) */}
            <div className="pt-8 px-8 bg-linear-to-b from-black/80 to-transparent pb-16">
                <button onClick={() => router.back()} className="hover:text-gray-300 transition">
                  <ArrowLeft size={40} />
                </button>
            </div>

            {/* Barra Inferiore (Player e Strumenti) */}
            <div className="bg-linear-to-t from-black/90 via-black/60 to-transparent px-8 py-8 flex flex-col gap-4">
              
              {/* Barra di Scorrimento (Seek Bar) */}
              <div className="relative w-full h-1 bg-white/20 cursor-pointer" onClick={(e) => {
                if (videoRef.current && duration > 0) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pos = (e.clientX - rect.left) / rect.width;
                  videoRef.current.currentTime = pos * duration; // Calcolo della posizione target
                }
              }}>
                <div className="absolute top-0 left-0 h-full bg-red-600" style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }} />
              </div>

              <div className="flex items-center justify-between mt-2 relative">
                
                {/* SETTORE SINISTRO: Controlli Riproduzione e Volume */}
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
                    {/* Range input espandibile on hover per il controllo volume */}
                    <input type="range" min="0" max="100" value={volume} onChange={(e) => setVolume(parseInt(e.target.value))} className="w-0 opacity-0 group-hover:w-24 group-hover:opacity-100 transition-all duration-300 accent-white h-1 bg-white/30 rounded-lg appearance-none cursor-pointer" />
                  </div>
                  <span className="text-sm font-light ml-2">{formatTime(currentTime)} / {formatTime(duration)}</span>
                </div>

                {/* SETTORE CENTRALE: Informazioni Titolo (Centrato in modo assoluto per stabilità layout) */}
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-none">
                  {metadata?.tipo === 'serie_tv' ? (
                    <>
                        <span className="text-lg font-bold">{metadata.titoloSerie}</span>
                        <span className="text-lg text-gray-300 font-light">
                            {currentEp ? currentEp.title : metadata.title}
                        </span>
                    </>
                  ) : (
                    <span className="text-lg font-bold">{metadata?.title}</span>
                  )}
                </div>

                {/* SETTORE DESTRO: Strumenti Avanzati (Audio, Sottotitoli, Schermo Intero) */}
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
                    
                    {/* Modale Pop-up Audio e Sottotitoli */}
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

        {/* Sidebar Episodi (visibile solo per serie TV) */}
        {showEpisodes && metadata?.tipo === 'serie_tv' && (
          <div className="absolute right-0 top-0 bottom-24 w-md bg-[#181818] z-20 overflow-y-auto shadow-2xl flex flex-col">

            {sidebarView === 'seasons' ? (
              /* VISTA STAGIONI: schermo intero dentro la sidebar, stile Netflix.
                 La freccia indietro qui riporta alla lista episodi, non chiude la sidebar. */
              <>
                <div className="flex items-center gap-4 px-6 py-6 sticky top-0 bg-[#181818] z-10 border-b border-zinc-800">
                  <button onClick={() => setSidebarView('episodes')} className="hover:text-gray-300 transition">
                    <ArrowLeft size={28} />
                  </button>
                  <span className="text-2xl font-bold">{metadata.titoloSerie ?? metadata.title}</span>
                </div>

                <div className="flex flex-col py-2">
                  {availableSeasons.map(seasonNum => {
                    const isActive = seasonNum === activeSeason;
                    return (
                      <button
                        key={seasonNum}
                        onClick={() => {
                          setSelectedSeason(seasonNum);
                          setSidebarView('episodes');
                        }}
                        className={`flex items-center gap-4 px-6 py-4 mx-4 my-1 text-left transition ${isActive ? 'border border-white' : 'hover:bg-white/5'}`}
                      >
                        <span className="w-6 flex justify-center">
                          {isActive && <Check size={20} />}
                        </span>
                        <span className="text-lg font-bold">Stagione {seasonNum}</span>
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              /* VISTA EPISODI: header con freccia (chiude la sidebar) + selettore stagione cliccabile. */
              <>
                <div className="flex items-center gap-4 px-6 py-6 sticky top-0 bg-[#181818] z-10 border-b border-zinc-800">
                  <button onClick={() => setShowEpisodes(false)} className="hover:text-gray-300 transition">
                    <ArrowLeft size={28} />
                  </button>

                  {availableSeasons.length > 1 ? (
                    <button
                      onClick={() => setSidebarView('seasons')}
                      className="flex items-center gap-2 text-2xl font-bold hover:text-gray-300 transition"
                    >
                      Stagione {activeSeason}
                    </button>
                  ) : (
                    <span className="text-2xl font-bold">Stagione {activeSeason}</span>
                  )}
                </div>

                <div className="flex flex-col py-4">
                  {episodesInSeason.map((ep, i) => {
                    const isCurrent = ep.id === targetId;

                    // Layout differenziato per l'episodio attualmente in riproduzione
                    if (isCurrent) {
                      return (
                        <div key={ep.id} className="border border-white p-4 mx-4 my-2 bg-[#181818]">
                          <div className="flex justify-between items-center mb-4">
                            <div className="flex gap-4 items-center">
                              <span className="text-xl font-bold">{i + 1}</span>
                              <span className="text-lg font-bold">{ep.title}</span>
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
                              {/* Badge "In riproduzione", stile Netflix */}
                              <div className="absolute inset-0 bg-black/40 flex items-end p-2">
                                <span className="flex items-center gap-1.5 text-sm font-semibold text-white">
                                  <Volume2 size={14} />
                                  In riproduzione
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-zinc-300 line-clamp-4 leading-snug">
                              {ep.desc}
                            </p>
                          </div>
                        </div>
                      );
                    }

                    // Layout compatto per gli altri episodi della lista
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
                          <span className="text-xl font-bold text-zinc-300">{i + 1}</span>
                          <span className="text-lg font-medium text-zinc-300">{ep.title}</span>
                        </div>
                        <div className="w-20 h-0.5 bg-zinc-700"></div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
}