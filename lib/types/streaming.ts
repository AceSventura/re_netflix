/**
 * Tipi per lo streaming video
 */

export interface AudioTrack {
  id: number;
  lingua: string;
  codec: string | null;
  url: string;
}

export interface SubtitleTrack {
  id: number;
  lingua: string;
  formato: string | null;
  tipo: "forzata" | "completa" | null;
  url: string;
}

export interface StreamingMetadata {
  generi: string[];
  cast: Array<{
    id: number;
    nome: string;
  }>;
}

export interface WatchProgress {
  durata_visualizzata: number | null;
  stato_completamento: boolean | null;
}

export interface StreamingContent {
  // Identificativi
  id: number;
  titolo: string;
  descrizione: string | null;
  anno_rilascio: number | null;
  durata: number | null;
  tipo: "film" | "episodio";

  // Streaming URLs
  streaming: {
    videoUrl: string; // HLS manifest
    audioTracks: AudioTrack[];
    subtitles: SubtitleTrack[];
  };

  // Metadata aggiuntivi
  metadata: StreamingMetadata;

  // Watch history
  watchProgress?: WatchProgress;

  // Per serie TV
  episodeInfo?: {
    titolo_stagione?: string;
    numero_stagione: number;
    numero_episodio?: number;
  };
}

export interface StreamingResponse {
  success: boolean;
  data?: StreamingContent;
  error?: string;
  statusCode: number;
}
