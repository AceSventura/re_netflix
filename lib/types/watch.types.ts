export interface ContentMetadata {
    id: string;
    title: string;
    description: string;
    releaseYear: number;
    rating: string;
    duration: number;
    posterUrl: string;
    type: 'movie' | 'series';
    director?: string;
    cast: string[];
    genres: string[];
    videoUrl: string;
    subtitles?: Subtitle[];
}

export interface Subtitle {
    language: string;
    url: string;
}

export interface WatchHistoryEntry {
    idProfilo: number;
    idContenuto: number;
    tempoGuardo: number; // in secondi
    dataGuardo: Date;
}

export interface WatchProgressData {
    contentId: string;
    currentTime: number;
    duration: number;
    isWatching: boolean;
    lastWatchedAt: Date;
}

export interface VideoQuality {
    quality: '720p' | '1080p' | '4K';
    bitrate: number; // in Kbps
    resolution: string;
}

export const VIDEO_QUALITIES: Record<string, VideoQuality> = {
    '720p': {
        quality: '720p',
        bitrate: 2500,
        resolution: '1280x720'
    },
    '1080p': {
        quality: '1080p',
        bitrate: 5000,
        resolution: '1920x1080'
    },
    '4K': {
        quality: '4K',
        bitrate: 15000,
        resolution: '3840x2160'
    }
};

export interface VideoPlayerState {
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    isMuted: boolean;
    isFullscreen: boolean;
    selectedQuality: VideoQuality;
    selectedSubtitle: Subtitle | null;
    showControls: boolean;
}

export const DEFAULT_VIDEO_PLAYER_STATE: VideoPlayerState = {
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 100,
    isMuted: false,
    isFullscreen: false,
    selectedQuality: VIDEO_QUALITIES['1080p'],
    selectedSubtitle: null,
    showControls: true
};
