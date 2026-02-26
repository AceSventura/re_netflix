import { ChevronLeft, Settings, SkipBack, Play, Pause, SkipForward, Volume2, VolumeX, Maximize } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

interface VideoPlayerProps {
    videoUrl: string;
    title: string;
    isPlaying: boolean;
    setIsPlaying: Dispatch<SetStateAction<boolean>>;
    currentTime: number;
    setCurrentTime: Dispatch<SetStateAction<number>>;
    duration: number;
    setDuration: Dispatch<SetStateAction<number>>;
    volume: number;
    setVolume: Dispatch<SetStateAction<number>>;
    isMuted: boolean;
    setIsMuted: Dispatch<SetStateAction<boolean>>;
    showControls: boolean;
    onBack: () => void;
    subtitles?: Array<{
        language: string;
        url: string;
    }>;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
    videoUrl,
    title,
    isPlaying,
    setIsPlaying,
    currentTime,
    setCurrentTime,
    duration,
    setDuration,
    volume,
    setVolume,
    isMuted,
    setIsMuted,
    showControls,
    onBack,
    subtitles,
}) => {
    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div className="relative w-full h-full bg-black group/player">
            <video
                className="w-full h-full object-cover"
                autoPlay
                onClick={() => setIsPlaying(!isPlaying)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                ref={(video) => {
                    if (video) video.volume = isMuted ? 0 : volume / 100;
                }}
            >
                <source src={videoUrl} type="video/mp4" />
                Il tuo browser non supporta la riproduzione video.
            </video>

            {showControls && (
                <>
                    {/* HEADER */}
                    <div className="absolute top-0 left-0 right-0 h-24 bg-linear-to-b from-black/80 to-transparent flex items-start justify-between p-6">
                        <button
                            onClick={onBack}
                            className="flex items-center gap-2 hover:opacity-80 transition"
                        >
                            <ChevronLeft size={32} />
                            <span className="text-sm">Esci</span>
                        </button>

                        <div className="text-center flex-1">
                            <h2 className="text-xl font-bold">{title}</h2>
                        </div>

                        <button className="hover:opacity-80 transition p-2">
                            <Settings size={24} />
                        </button>
                    </div>

                    {/* BOTTOM CONTROLS */}
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                        {/* PROGRESS BAR */}
                        <div className="mb-4 group/progress">
                            <div
                                className="w-full h-1 bg-gray-600 rounded-full cursor-pointer hover:h-1.5 transition-all"
                                onClick={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const x = e.clientX - rect.left;
                                    const percentage = x / rect.width;
                                    setCurrentTime(percentage * duration);
                                }}
                            >
                                <div
                                    className="h-full bg-red-600 rounded-full transition-all"
                                    style={{ width: `${progressPercentage}%` }}
                                />
                            </div>
                        </div>

                        {/* CONTROLS */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    className="p-2 hover:scale-110 transition"
                                >
                                    {isPlaying ? (
                                        <Pause size={28} fill="white" />
                                    ) : (
                                        <Play size={28} fill="white" />
                                    )}
                                </button>

                                <button
                                    onClick={() => {
                                        setCurrentTime(Math.max(0, currentTime - 10));
                                    }}
                                    className="p-2 hover:scale-110 transition"
                                >
                                    <SkipBack size={24} />
                                </button>

                                <button
                                    onClick={() => {
                                        setCurrentTime(Math.min(duration, currentTime + 10));
                                    }}
                                    className="p-2 hover:scale-110 transition"
                                >
                                    <SkipForward size={24} />
                                </button>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setIsMuted(!isMuted)}
                                        className="p-2 hover:scale-110 transition"
                                    >
                                        {isMuted ? (
                                            <VolumeX size={24} />
                                        ) : (
                                            <Volume2 size={24} />
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

                                <span className="text-sm font-bold ml-4">
                                    {formatTime(currentTime)} / {formatTime(duration)}
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                {subtitles && subtitles.length > 0 && (
                                    <select className="px-3 py-1 bg-gray-800 text-white rounded text-sm">
                                        <option value="">Senza sottotitoli</option>
                                        {subtitles.map((sub) => (
                                            <option key={sub.language} value={sub.url}>
                                                {sub.language}
                                            </option>
                                        ))}
                                    </select>
                                )}

                                <select className="px-3 py-1 bg-gray-800 text-white rounded text-sm">
                                    <option value="720p">720p</option>
                                    <option value="1080p">1080p</option>
                                    <option value="4K">4K</option>
                                </select>

                                <button className="p-2 hover:scale-110 transition">
                                    <Maximize size={24} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {!isPlaying && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <button
                                onClick={() => setIsPlaying(true)}
                                className="p-6 bg-white/20 hover:bg-white/30 rounded-full transition pointer-events-auto"
                            >
                                <Play size={48} fill="white" />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
