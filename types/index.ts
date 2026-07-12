// ============================================================================
// INTERFACCE DTO (Data Transfer Objects)
// ============================================================================

export interface MovieDTO {
    id_contenuto: number | string;
    titolo_contenuto: string;
    copertina_url: string | null;
    vposter_url: string | null;
}

export interface SeriesDTO {
    id_serie_tv: number | string;
    titolo_serie_tv: string;
    img_hero: string | null;
    vposter_url: string | null;
}

export interface ProgressEntryDTO {
    durata_visualizzata: number | null;
    stato_completamento: number | null;
    contenuti: {
        tipo: string;
        id_contenuto: number | string;
        titolo_contenuto: string;
        copertina_url: string | null;
        vposter_url: string | null;
        stagioni?: {
            id_serie_tv: number | string;
            serie_tv?: SeriesDTO | null;
        } | null;
    };
}

export interface FormattedMedia {
    id: string;
    title: string;
    poster: string;
    vposter: string;
    type: string;
}

export interface FormattedProgress extends FormattedMedia {
    resumeTime: number;
    progress: number;
}

export interface MediaItem {
    id: string;
    title: string;
    description?: string;
    poster: string;
    vposter?: string;   // opzionale, il fallback in MediaCard lo gestisce
    type: string;
    progress?: number;
    resumeTime?: number;
}