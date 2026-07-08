"use server";

import { prisma } from "@/lib/prisma";

export async function getBrowseData(profileId?: number) {
    try {
        // 1. Estrazione catalogo generale
        const serie = await prisma.serie_tv.findMany();
        const film = await prisma.contenuti.findMany({
            where: { tipo: "film" }
        });
        
        // 2. Estrazione Top 10 (Ottimizzata tramite interazioni)
        // Calcolo della top 10 delle Serie TV basata sul numero di valutazioni ricevute
        const topSeries = await prisma.serie_tv.findMany({
            take: 10,
            orderBy: { valutazioni: { _count: 'desc' } }
        });
        
        // Calcolo della top 10 dei Film basata sul numero effettivo di visualizzazioni (tabella 'guarda')
        const topMovies = await prisma.contenuti.findMany({
            where: { tipo: "film" },
            take: 10,
            orderBy: { guarda: { _count: 'desc' } }
        });

        // 3. Estrazione "La mia lista" e "Continua a guardare" per lo specifico profilo
        let myList: Array<{ id: string; title: string; poster: string; vposter: string; type: string }> = [];
        let continueWatching: Array<{ id: string; title: string; poster: string; vposter: string; type: string; resumeTime: number; progress: number }> = [];
        
        if (profileId) {
            const savedMovies = await prisma.salva_film.findMany({
                where: { id_profilo: profileId },
                include: { contenuti: true }
            });
            
            const savedSeries = await prisma.salva_serie.findMany({
                where: { id_profilo: profileId },
                include: { serie_tv: true }
            });

            const formattedSavedMovies = savedMovies.map(sm => ({
                id: sm.contenuti.id_contenuto.toString(),
                title: sm.contenuti.titolo_contenuto,
                poster: sm.contenuti.copertina_url || "https://picsum.photos/640/360?random=3",
                vposter: sm.contenuti.vposter_url || "https://picsum.photos/400/600?random=3",
                type: "film"
            }));

            const formattedSavedSeries = savedSeries.map(ss => ({
                id: ss.serie_tv.id_serie_tv.toString(),
                title: ss.serie_tv.titolo_serie_tv,
                poster: ss.serie_tv.img_hero || "https://picsum.photos/640/360?random=4",
                vposter: ss.serie_tv.vposter_url || "https://picsum.photos/400/600?random=4",
                type: "serie"
            }));

            myList = [...formattedSavedMovies, ...formattedSavedSeries];

            // Recuperiamo i contenuti con un progresso salvato
            const progressEntries = await prisma.guarda.findMany({
                where: {
                    id_profilo: profileId,
                    durata_visualizzata: { gt: 5 },
                },
                include: {
                    contenuti: {
                        include: {
                            stagioni: {
                                include: { serie_tv: true },
                            },
                        },
                    },
                },
            });

            continueWatching = progressEntries
                .filter((entry) => entry.contenuti)
                .map((entry) => {
                    const parentSeriesId = entry.contenuti.stagioni?.id_serie_tv;
                    const isSeriesEpisode = entry.contenuti.tipo !== "film" && parentSeriesId !== null && parentSeriesId !== undefined;
                    const resolvedId = isSeriesEpisode ? parentSeriesId.toString() : entry.contenuti.id_contenuto.toString();
                    const resolvedType = isSeriesEpisode ? "serie" : "film";
                    const resolvedTitle = isSeriesEpisode
                        ? entry.contenuti.stagioni?.serie_tv?.titolo_serie_tv ?? entry.contenuti.titolo_contenuto
                        : entry.contenuti.titolo_contenuto;
                    const resolvedPoster = isSeriesEpisode
                        ? entry.contenuti.stagioni?.serie_tv?.img_hero || entry.contenuti.copertina_url || "https://picsum.photos/640/360?random=7"
                        : entry.contenuti.copertina_url || "https://picsum.photos/640/360?random=7";
                    const resolvedVPoster = isSeriesEpisode
                        ? entry.contenuti.stagioni?.serie_tv?.vposter_url || entry.contenuti.vposter_url || "https://picsum.photos/400/600?random=7"
                        : entry.contenuti.vposter_url || "https://picsum.photos/400/600?random=7";

                    return {
                        id: resolvedId,
                        title: resolvedTitle,
                        poster: resolvedPoster,
                        vposter: resolvedVPoster,
                        type: resolvedType,
                        resumeTime: entry.durata_visualizzata ?? 0,
                        progress: entry.stato_completamento ?? 0, 
                    };
                })
                .sort((a, b) => (b.resumeTime ?? 0) - (a.resumeTime ?? 0))
                .slice(0, 10);
        }

        const formattedSeries = serie.map(s => ({
            id: s.id_serie_tv.toString(),
            title: s.titolo_serie_tv,
            poster: s.img_hero || "https://picsum.photos/640/360?random=1",
            vposter: s.vposter_url || "https://picsum.photos/400/600?random=1",
            type: "serie"
        }));

        const formattedMovies = film.map(f => ({
            id: f.id_contenuto.toString(),
            title: f.titolo_contenuto,
            poster: f.copertina_url || "https://picsum.photos/640/360?random=2",
            vposter: f.vposter_url || "https://picsum.photos/400/600?random=2",
            type: "film"
        }));

        const formattedTopSeries = topSeries.map(s => ({
            id: s.id_serie_tv.toString(),
            title: s.titolo_serie_tv,
            poster: s.img_hero || "https://picsum.photos/640/360?random=5",
            vposter: s.vposter_url || "https://picsum.photos/400/600?random=5",
            type: "serie"
        }));

        const formattedTopMovies = topMovies.map(f => ({
            id: f.id_contenuto.toString(),
            title: f.titolo_contenuto,
            poster: f.copertina_url || "https://picsum.photos/640/360?random=6",
            vposter: f.vposter_url || "https://picsum.photos/400/600?random=6",
            type: "film"
        }));

        return { 
            series: formattedSeries, 
            movies: formattedMovies,
            topSeries: formattedTopSeries,
            topMovies: formattedTopMovies,
            myList: myList,
            continueWatching: continueWatching,
        };

    } catch (error) {
        console.error("Errore nell'estrazione dati:", error);
        return { series: [], movies: [], topSeries: [], topMovies: [], myList: [], continueWatching: [] };
    }
}

export async function getMediaDetails(id: string, type: string) {
    const numericId = parseInt(id, 10);
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
            
            const cast = film.partecipa.map(p => p.artisti.nome);
            const genres = film.classificato_in.map(c => c.generi.nome_genere);

            return {
                title: film.titolo_contenuto,
                description: film.descrizione || "Nessuna descrizione disponibile.",
                year: film.anno_rilascio || 2026,
                maturity: "T", 
                duration: film.durata ? `${film.durata} min` : "N/D",
                cast: cast,
                genres: genres,
                heroImage: film.copertina_url || "https://picsum.photos/800/450?random=1",
                vposter: film.vposter_url || "https://picsum.photos/400/600?random=1",
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
                        include: {
                            contenuti: {
                                orderBy: { id_contenuto: 'asc' }
                            }
                        }
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
                    image: ep.copertina_url || "https://picsum.photos/300/200?random=3",
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
                heroImage: serie.img_hero || "https://picsum.photos/800/450?random=2",
                vposter: serie.vposter_url || "https://picsum.photos/400/600?random=2",
                episodes: episodesList
            };
        }
        
        return null;
    } catch (error) {
        console.error("Errore nell'estrazione dati:", error);
        return null;
    }
}

export async function getAllMovies() {
    try {
        const movies = await prisma.contenuti.findMany({
            where: { id_stagione: null },
            select: {
                id_contenuto: true,
                titolo_contenuto: true,
                copertina_url: true,
                vposter_url: true,
            }
        });

        return movies.map(m => ({
            id: m.id_contenuto.toString(),
            title: m.titolo_contenuto,
            poster: m.copertina_url || "https://picsum.photos/300/200?random=1",
            vposter: m.vposter_url || "https://picsum.photos/400/600?random=1",
            type: "film"
        }));
    } catch (error) {
        console.error("Errore recupero film:", error);
        return [];
    }
}

export async function getAllSeries() {
    try {
        const series = await prisma.serie_tv.findMany({
            select: {
                id_serie_tv: true,
                titolo_serie_tv: true,
                img_hero: true, 
                vposter_url: true,
            }
        });

        return series.map(s => ({
            id: s.id_serie_tv.toString(),
            title: s.titolo_serie_tv,
            poster: s.img_hero || "https://picsum.photos/300/200?random=2",
            vposter: s.vposter_url || "https://picsum.photos/400/600?random=2",
            type: "serie" // Allineato con il resto del sistema (rimosso "serie_tv")
        }));
    } catch (error) {
        console.error("Errore recupero serie tv:", error);
        return [];
    }
}

export async function getMyListFromId(profileId?: number) {
    const savedMovies = await prisma.salva_film.findMany({
        where: { id_profilo: profileId },
        include: { contenuti: true }
    });
    
    const savedSeries = await prisma.salva_serie.findMany({
        where: { id_profilo: profileId },
        include: { serie_tv: true }
    });

    const formattedSavedMovies = savedMovies.map(sm => ({
        id: sm.contenuti.id_contenuto.toString(),
        title: sm.contenuti.titolo_contenuto,
        poster: sm.contenuti.copertina_url || "https://picsum.photos/640/360?random=3",
        vposter: sm.contenuti.vposter_url || "https://picsum.photos/400/600?random=3",
        type: "film"
    }));

    const formattedSavedSeries = savedSeries.map(ss => ({
        id: ss.serie_tv.id_serie_tv.toString(),
        title: ss.serie_tv.titolo_serie_tv,
        poster: ss.serie_tv.img_hero || "https://picsum.photos/640/360?random=4",
        vposter: ss.serie_tv.vposter_url || "https://picsum.photos/400/600?random=4",
        type: "serie"
    }));

    return [...formattedSavedMovies, ...formattedSavedSeries];
}

export async function getNewAndPopularData() {
    try {
        const currentYear = new Date().getFullYear();

        const [recentMovies, recentSeries, popularMovies, popularSeries] = await Promise.all([
            // 1. Film recenti
            prisma.contenuti.findMany({
                where: { 
                    tipo: "film",
                    anno_rilascio: { gte: currentYear - 1 }
                },
                orderBy: { anno_rilascio: "desc" },
                take: 10
            }),
            // 2. Serie recenti
            prisma.serie_tv.findMany({
                where: {
                    anno_inizio: { gte: currentYear - 1 }
                },
                orderBy: { anno_inizio: "desc" },
                take: 10
            }),
            // 3. Film popolari
            prisma.contenuti.findMany({
                where: { tipo: "film" },
                orderBy: { guarda: { _count: "desc" } },
                take: 10
            }),
            // 4. Serie popolari
            prisma.serie_tv.findMany({
                orderBy: { valutazioni: { _count: "desc" } },
                take: 10
            })
        ]);

        const formattedRecentMovies = recentMovies.map(m => ({
            id: m.id_contenuto.toString(),
            title: m.titolo_contenuto,
            poster: m.copertina_url || "https://picsum.photos/640/360?random=8",
            vposter: m.vposter_url || "https://picsum.photos/400/600?random=8",
            type: "film"
        }));

        const formattedRecentSeries = recentSeries.map(s => ({
            id: s.id_serie_tv.toString(),
            title: s.titolo_serie_tv,
            poster: s.img_hero || "https://picsum.photos/640/360?random=9",
            vposter: s.vposter_url || "https://picsum.photos/400/600?random=9",
            type: "serie"
        }));

        const formattedPopularMovies = popularMovies.map(m => ({
            id: m.id_contenuto.toString(),
            title: m.titolo_contenuto,
            poster: m.copertina_url || "https://picsum.photos/640/360?random=10",
            vposter: m.vposter_url || "https://picsum.photos/400/600?random=10",
            type: "film"
        }));

        const formattedPopularSeries = popularSeries.map(s => ({
            id: s.id_serie_tv.toString(),
            title: s.titolo_serie_tv,
            poster: s.img_hero || "https://picsum.photos/640/360?random=11",
            vposter: s.vposter_url || "https://picsum.photos/400/600?random=11",
            type: "serie"
        }));

        return {
            success: true,
            newReleases: [...formattedRecentMovies, ...formattedRecentSeries],
            popularNow: [...formattedPopularMovies, ...formattedPopularSeries]
        };

    } catch (error) {
        console.error("Errore nell'estrazione dei dati nuovi e popolari:", error);
        return {
            success: false,
            newReleases: [],
            popularNow: [],
            error: "Errore durante il recupero dei contenuti."
        };
    }
}