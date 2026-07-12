"use server";

import { prisma } from "@/lib/prisma";
import { MovieDTO, SeriesDTO, ProgressEntryDTO, FormattedMedia, FormattedProgress } from "@/types";
// ============================================================================
// COSTANTI DI FALLBACK
// ============================================================================
const DEFAULT_POSTER_H = "https://picsum.photos/640/360?random=1"; 
const DEFAULT_POSTER_V = "https://picsum.photos/400/600?random=1"; 
const DEFAULT_HERO = "https://picsum.photos/800/450?random=1";     
const DEFAULT_THUMB = "https://picsum.photos/300/200?random=1";    
// ============================================================================
// FUNZIONI MODULARI (DTO Mappers)
// ============================================================================

function formatMovie(m: MovieDTO, posterFallback = DEFAULT_POSTER_H): FormattedMedia {
    return {
        id: m.id_contenuto.toString(),
        title: m.titolo_contenuto,
        poster: m.copertina_url || posterFallback,
        vposter: m.vposter_url || DEFAULT_POSTER_V,
        type: "film"
    };
}

function formatSeries(s: SeriesDTO, posterFallback = DEFAULT_POSTER_H): FormattedMedia {
    return {
        id: s.id_serie_tv.toString(),
        title: s.titolo_serie_tv,
        poster: s.img_hero || posterFallback,
        vposter: s.vposter_url || DEFAULT_POSTER_V,
        type: "serie"
    };
}

function formatProgressEntry(entry: ProgressEntryDTO): FormattedProgress {
    const contenuti = entry.contenuti;
    let resolvedId, resolvedType, resolvedTitle, resolvedPoster, resolvedVPoster;
    
    const isSeriesEpisode = contenuti.tipo !== "film" && contenuti.stagioni?.serie_tv;
    const parentSeries = isSeriesEpisode ? contenuti.stagioni?.serie_tv : null;

    if (isSeriesEpisode && parentSeries) {
        resolvedType = "serie";
        resolvedId = parentSeries.id_serie_tv.toString();
        resolvedTitle = parentSeries.titolo_serie_tv || contenuti.titolo_contenuto;
        resolvedPoster = parentSeries.img_hero || contenuti.copertina_url || DEFAULT_POSTER_H;
        resolvedVPoster = parentSeries.vposter_url || contenuti.vposter_url || DEFAULT_POSTER_V;
    } else {
        resolvedType = "film";
        resolvedId = contenuti.id_contenuto.toString();
        resolvedTitle = contenuti.titolo_contenuto;
        resolvedPoster = contenuti.copertina_url || DEFAULT_POSTER_H;
        resolvedVPoster = contenuti.vposter_url || DEFAULT_POSTER_V;
    }

    return {
        id: resolvedId,
        title: resolvedTitle,
        poster: resolvedPoster,
        vposter: resolvedVPoster,
        type: resolvedType,
        resumeTime: entry.durata_visualizzata ?? 0,
        progress: entry.stato_completamento ?? 0,
    };
}

// ============================================================================
// FUNZIONE PRINCIPALE: getBrowseData
// ============================================================================
export async function getBrowseData(profileId?: number) {
    try {
        // 1. Estrazione cataloghi generali e Top 10
        const [serie, film, topSeries, topMovies] = await Promise.all([
            prisma.serie_tv.findMany(),
            prisma.contenuti.findMany({ where: { tipo: "film" } }),
            prisma.serie_tv.findMany({ take: 10, orderBy: { valutazioni: { _count: 'desc' } } }),
            prisma.contenuti.findMany({ where: { tipo: "film" }, take: 10, orderBy: { guarda: { _count: 'desc' } } })
        ]);

        let myList: Array<FormattedMedia> = [];
        let continueWatching: Array<FormattedProgress> = [];
        
        // 2. Elaborazione dati utente (se loggato con profilo)
        if (profileId) {
            const [savedMovies, savedSeries, progressEntries] = await Promise.all([
                prisma.salva_film.findMany({ where: { id_profilo: profileId }, include: { contenuti: true } }),
                prisma.salva_serie.findMany({ where: { id_profilo: profileId }, include: { serie_tv: true } }),
                prisma.guarda.findMany({
                    where: { id_profilo: profileId, durata_visualizzata: { gt: 5 } },
                    include: { contenuti: { include: { stagioni: { include: { serie_tv: true } } } } },
                    orderBy: { aggiornato_il: 'desc' } // <-- più recenti prima
                })
            ]);

            myList = [
                ...savedMovies.map(sm => formatMovie(sm.contenuti as MovieDTO)),
                ...savedSeries.map(ss => formatSeries(ss.serie_tv as SeriesDTO))
            ];

            // Deduplica: essendo già ordinati dal più recente al meno recente,
            // la PRIMA occorrenza di ogni serie/film è quella cronologicamente più recente
            const seenKeys = new Set<string>();

            for (const entry of progressEntries) {
                if (!entry.contenuti) continue; // Skip orfani

                const formatted = formatProgressEntry(entry as unknown as ProgressEntryDTO);
                const key = `${formatted.type}-${formatted.id}`;

                if (seenKeys.has(key)) continue; // già presente un episodio più recente di questa serie
                seenKeys.add(key);

                continueWatching.push(formatted);
            }

            continueWatching = continueWatching.slice(0, 10);
        }

        // 3. Formattazione DTO finali tramite mappers
        return { 
            series: serie.map(s => formatSeries(s as SeriesDTO)), 
            movies: film.map(m => formatMovie(m as MovieDTO)),
            topSeries: topSeries.map(s => formatSeries(s as SeriesDTO)),
            topMovies: topMovies.map(m => formatMovie(m as MovieDTO)),
            myList,
            continueWatching,
        };

    } catch (error) {
        console.error("Errore nell'estrazione dati:", error);
        return { series: [], movies: [], topSeries: [], topMovies: [], myList: [], continueWatching: [] };
    }
}

// ============================================================================
// FUNZIONE: getMediaDetails
// ============================================================================
export async function getMediaDetails(id: string, type: string) {
    const numericId = parseInt(id, 10); // 10 è la base di rappresentazione
    if (isNaN(numericId)) return null;

    try {
        if (type === "film") {
            const film = await prisma.contenuti.findUnique({
                where: { id_contenuto: numericId },
                include: { 
                    partecipa: { include: { artisti: true } }, 
                    classificato_in: { include: { generi: true } } 
                }
            });
            
            if (!film) return null;

            return {
                title: film.titolo_contenuto,
                description: film.descrizione || "Nessuna descrizione disponibile.",
                year: film.anno_rilascio || 2026,
                maturity: "T", 
                duration: film.durata ? `${film.durata} min` : "N/D",
                cast: film.partecipa.map(p => p.artisti.nome),
                genres: film.classificato_in.map(c => c.generi.nome_genere),
                heroImage: film.copertina_url || DEFAULT_HERO,
                vposter: film.vposter_url || DEFAULT_POSTER_V,
                episodes: [] 
            };
        } 
        
        if (type === "serie" || type === "serie_tv") {
            let seriesId = numericId;

            const contentForSeries = await prisma.contenuti.findUnique({
                where: { id_contenuto: numericId },
                include: { stagioni: true },
            });

            if (contentForSeries?.stagioni?.id_serie_tv) {
                seriesId = contentForSeries.stagioni.id_serie_tv;
            }

            const serie = await prisma.serie_tv.findUnique({
                where: { id_serie_tv: seriesId },
                include: {
                    stagioni: {
                        orderBy: { numero_stagione: 'asc' },
                        include: { contenuti: { orderBy: { id_contenuto: 'asc' } } }
                    }
                }
            });

            if (!serie) return null;

            const episodesList = serie.stagioni.flatMap(stagione => 
                stagione.contenuti.map(ep => ({
                    id: ep.id_contenuto.toString(),
                    title: ep.titolo_contenuto,
                    desc: ep.descrizione || "Nessuna descrizione disponibile.",
                    time: ep.durata ? `${ep.durata} min` : "N/D",
                    image: ep.copertina_url || DEFAULT_THUMB,
                    season: stagione.numero_stagione 
                }))
            );

            return {
                title: serie.titolo_serie_tv,
                description: serie.descrizione || "Nessuna descrizione disponibile.", 
                year: serie.anno_inizio || 2026, 
                maturity: "T",
                duration: "Stagioni multiple",
                cast: [], 
                genres: [], 
                heroImage: serie.img_hero || DEFAULT_HERO,
                vposter: serie.vposter_url || DEFAULT_POSTER_V,
                episodes: episodesList
            };
        }
        
        return null;
    } catch (error) {
        console.error("Errore nell'estrazione dati:", error);
        return null;
    }
}

// ============================================================================
// ENDPOINT AUSILIARI
// ============================================================================

export async function getAllMovies() {
    try {
        const movies = await prisma.contenuti.findMany({
            where: { id_stagione: null },
            select: { id_contenuto: true, titolo_contenuto: true, copertina_url: true, vposter_url: true }
        });
        
        return movies.map(m => formatMovie(m as MovieDTO, DEFAULT_THUMB));
    } catch (error) {
        console.error("Errore recupero film:", error);
        return [];
    }
}

export async function getAllSeries() {
    try {
        const series = await prisma.serie_tv.findMany({
            select: { id_serie_tv: true, titolo_serie_tv: true, img_hero: true, vposter_url: true }
        });
        return series.map(s => formatSeries(s as unknown as SeriesDTO, DEFAULT_THUMB));
    } catch (error) {
        console.error("Errore recupero serie tv:", error);
        return [];
    }
}

export async function getMyListFromId(profileId?: number) {
    const [savedMovies, savedSeries] = await Promise.all([
        prisma.salva_film.findMany({ where: { id_profilo: profileId }, include: { contenuti: true } }),
        prisma.salva_serie.findMany({ where: { id_profilo: profileId }, include: { serie_tv: true } })
    ]);

    return [
        ...savedMovies.map(sm => formatMovie(sm.contenuti as MovieDTO)),
        ...savedSeries.map(ss => formatSeries(ss.serie_tv as SeriesDTO))
    ];
}

export async function getNewAndPopularData() {
    try {
        const currentYear = new Date().getFullYear();

        const [recentMovies, recentSeries, popularMovies, popularSeries] = await Promise.all([
            prisma.contenuti.findMany({ where: { tipo: "film", anno_rilascio: { gte: currentYear - 1 } }, orderBy: { anno_rilascio: "desc" }, take: 10 }),
            prisma.serie_tv.findMany({ where: { anno_inizio: { gte: currentYear - 1 } }, orderBy: { anno_inizio: "desc" }, take: 10 }),
            prisma.contenuti.findMany({ where: { tipo: "film" }, orderBy: { guarda: { _count: "desc" } }, take: 10 }),
            prisma.serie_tv.findMany({ orderBy: { valutazioni: { _count: "desc" } }, take: 10 })
        ]);

        return {
            success: true,
            newReleases: [...recentMovies.map(m => formatMovie(m as MovieDTO)), ...recentSeries.map(s => formatSeries(s as SeriesDTO))],
            popularNow: [...popularMovies.map(m => formatMovie(m as MovieDTO)), ...popularSeries.map(s => formatSeries(s as SeriesDTO))]
        };

    } catch (error) {
        console.error("Errore nell'estrazione dei dati nuovi e popolari:", error);
        return { success: false, newReleases: [], popularNow: [], error: "Errore durante il recupero dei contenuti." };
    }
}