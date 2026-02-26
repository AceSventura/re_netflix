/**
 * Configurazione del Video Player
 * Impostazioni globali per il comportamento del player
 */

export const VIDEO_PLAYER_CONFIG = {
    // Auto-play settings
    autoPlay: true,
    autoPlayOnResume: true,
    resumeThreshold: 30, // secondi da fine/inizio per considerare se riprendere
    
    // Save settings
    saveProgressInterval: 10000, // millisecondi - salva ogni 10 secondi
    minProgressToSave: 5, // secondi minimi guardati per salvare
    
    // UI settings
    controlsHideDelay: 3000, // millisecondi - nasconde i controlli dopo 3 sec
    showProgressOnHover: true,
    
    // Quality settings
    defaultQuality: '1080p' as const,
    adaptiveQuality: true, // auto-switch basato su connessione
    
    // Subtitle settings
    defaultSubtitle: null, // null = no subtitles
    subtitleFontSize: 'medium', // small | medium | large
    subtitleBackground: true,
    
    // Language
    audioLanguage: 'it', // Italiano di default
    
    // Playback speed
    defaultPlaybackSpeed: 1.0,
    allowedSpeeds: [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0],
    
    // Buffer settings
    minBufferTime: 3, // secondi
    maxBufferTime: 20, // secondi
    
    // Analytics
    trackPlayback: true,
    trackQualityChanges: true,
    trackErrors: true,
} as const;

export const VIDEO_PLAYER_HOTKEYS = {
    play: ' ', // Space
    backward: 'ArrowLeft',
    forward: 'ArrowRight',
    volumeUp: 'ArrowUp',
    volumeDown: 'ArrowDown',
    mute: 'm',
    fullscreen: 'f',
    subtitles: 'c',
    settings: 's',
    exit: 'Escape',
} as const;

export const VIDEO_PRELOAD_CONFIG = {
    // Precarica il video prima della riproduzione
    preload: 'metadata' as const, // none | metadata | auto
    
    // Buffering strategy
    bufferStrategy: 'progressive' as const, // progressive | full
    
    // Network priorities
    preferredNetwork: 'auto' as const, // auto | ethernet | wifi | 4g | 5g
} as const;
