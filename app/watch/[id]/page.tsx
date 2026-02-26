'use client';

import { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  Settings,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Hls from 'hls.js';
import { StreamingContent } from '@/lib/types/streaming';

interface PageProps {
  params: Promise<{ id: string }>;
}

type ContentMetadata = StreamingContent;

export default function WatchPage({ params }: PageProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [metadata, setMetadata] = useState<ContentMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);

  // Carica i metadati del contenuto
  useEffect(() => {
    const unwrapParams = async () => {
      const { id: contentId } = await params;
      await fetchContentMetadata(contentId);
    };
    unwrapParams();
  }, [params]);

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

  // Inizializza HLS
  useEffect(() => {
    if (!metadata?.streaming.videoUrl || !videoRef.current) return;

    const video = videoRef.current;
    const videoUrl = metadata.streaming.videoUrl;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(videoUrl);
      hls.attachMedia(video);
      hlsRef.current = hls;
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = videoUrl;
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [metadata]);

  // Play/Pause sync
  useEffect(() => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.play().catch(() => setIsPlaying(false));
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying]);

  // Volume sync
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  // Nasconde controlli dopo 3s
  useEffect(() => {
    if (!showControls) return;
    const timer = setTimeout(() => setShowControls(false), 3000);
    return () => clearTimeout(timer);
  }, [showControls]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return h > 0
      ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
      : `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (loading)
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center text-white text-2xl">
        Caricamento...
      </div>
    );

  if (!metadata)
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center text-white">
        Contenuto non trovato
      </div>
    );

  return (
    <div
      className="w-full h-screen bg-black text-white flex flex-col overflow-hidden"
      onMouseMove={() => setShowControls(true)}
    >
      <div
        className="relative w-full flex-1 bg-black overflow-hidden"
        onMouseLeave={() => setShowControls(false)}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          playsInline
          onClick={() => setIsPlaying(!isPlaying)}
          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => {
            setDuration(e.currentTarget.duration);
            setIsPlaying(true);
          }}
        />

        {showControls && (
          <>
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/80 to-transparent px-8 flex items-center justify-between">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-white/20 rounded-full transition"
              >
                <ChevronLeft size={32} />
              </button>
              <h2 className="text-xl font-medium">{metadata.titolo}</h2>
              <button className="p-2 hover:bg-white/20 rounded-full">
                <Settings size={28} />
              </button>
            </div>

            {/* Bottom controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent px-8 py-10">
              <div className="mb-6 flex items-center gap-4">
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
                    {isPlaying ? (
                      <Pause size={30} fill="white" />
                    ) : (
                      <Play size={30} fill="white" />
                    )}
                  </button>

                  <button
                    onClick={() =>
                      videoRef.current &&
                      (videoRef.current.currentTime -= 10)
                    }
                  >
                    <SkipBack size={26} />
                  </button>

                  <button
                    onClick={() =>
                      videoRef.current &&
                      (videoRef.current.currentTime += 10)
                    }
                  >
                    <SkipForward size={26} />
                  </button>

                  <div className="flex items-center gap-2">
                    <button onClick={() => setIsMuted(!isMuted)}>
                      {isMuted || volume === 0 ? (
                        <VolumeX size={26} />
                      ) : (
                        <Volume2 size={26} />
                      )}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
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