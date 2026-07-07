"use server";
 
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: "file:./prisma/netflix.db" });
const prisma = new PrismaClient({ adapter });

export async function getBrowseData(profileId?: number) {
    try {
        // 1. Estrazione catalogo generale
        const serie = await prisma.serie_tv.findMany();
        const film = await prisma.contenuti.findMany({
            where: { tipo: "film" }
        });

        // 2. Estrazione Top 10
        const topSeries = await prisma.serie_tv.findMany({
            take: 10,
            orderBy: { id_serie_tv: 'desc' }
        });
        const topMovies = await prisma.contenuti.findMany({
            where: { tipo: "film" },
            take: 10,
            orderBy: { id_contenuto: 'desc' }
        });

        // 3. Estrazione "La mia lista" per lo specifico profilo
        let myList: Array<{ id: string; title: string; poster: string; vposter: string; type: string }> = [];
        
        if (profileId) {
            // Recupera i film salvati dal profilo
            const savedMovies = await prisma.salva_film.findMany({
                where: { id_profilo: profileId },
                include: { contenuti: true }
            });
            
            // Recupera le serie salvate dal profilo
            const savedSeries = await prisma.salva_serie.findMany({
                where: { id_profilo: profileId },
                include: { serie_tv: true }
            });

            // Normalizza i film salvati
            const formattedSavedMovies = savedMovies.map(sm => ({
                id: sm.contenuti.id_contenuto.toString(),
                title: sm.contenuti.titolo_contenuto,
                poster: sm.contenuti.copertina_url || "https://picsum.photos/640/360?random=3",
                vposter: sm.contenuti.vposter_url || "https://picsum.photos/400/600?random=3",
                type: "film"
            }));

            // Normalizza le serie salvate
            const formattedSavedSeries = savedSeries.map(ss => ({
                id: ss.serie_tv.id_serie_tv.toString(),
                title: ss.serie_tv.titolo_serie_tv,
                poster: ss.serie_tv.img_hero || "https://picsum.photos/640/360?random=4",
                vposter: ss.serie_tv.vposter_url || "https://picsum.photos/400/600?random=4",
                type: "serie"
            }));

            // Unifica i contenuti salvati in un unico carosello
            myList = [...formattedSavedMovies, ...formattedSavedSeries];
        }

        // 4. Normalizzazione del resto del catalogo
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
            myList: myList // Restituisce l'array unificato
        };

    } catch (error) {
        console.error("Errore nell'estrazione dati:", error);
        return { series: [], movies: [], topSeries: [], topMovies: [], myList: [] };
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
            const serie = await prisma.serie_tv.findUnique({
                where: { id_serie_tv: numericId },
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
                    // Aggiunta del parametro mancante per il raggruppamento nel frontend
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
        // Estrae solo i film (contenuti senza legami con stagioni)
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
            thumbnail: m.copertina_url || "https://picsum.photos/300/200?random=1",
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
            thumbnail: s.img_hero || "https://picsum.photos/300/200?random=2",
            vposter: s.vposter_url || "https://picsum.photos/400/600?random=2",
            type: "serie_tv"
        }));
    } catch (error) {
        console.error("Errore recupero serie tv:", error);
        return [];
    }
}

export async function getMyListFromIds(items: { id: string; type: string }[]) {
    if (!items || items.length === 0) return [];

    try {
        // Separazione degli ID per tipologia
        const filmIds = items
            .filter(i => i.type === 'film')
            .map(i => parseInt(i.id, 10))
            .filter(id => !isNaN(id));

        const serieIds = items
            .filter(i => i.type === 'serie_tv' || i.type === 'serie')
            .map(i => parseInt(i.id, 10))
            .filter(id => !isNaN(id));

        // Esecuzione parallela delle query
        const [films, series] = await Promise.all([
            filmIds.length > 0 
                ? prisma.contenuti.findMany({
                    where: { id_contenuto: { in: filmIds } },
                    select: { id_contenuto: true, titolo_contenuto: true, copertina_url: true, vposter_url: true }
                  }) 
                : Promise.resolve([]),
            
            serieIds.length > 0 
                ? prisma.serie_tv.findMany({
                    where: { id_serie_tv: { in: serieIds } },
                    select: { id_serie_tv: true, titolo_serie_tv: true, img_hero: true, vposter_url: true }
                  }) 
                : Promise.resolve([])
        ]);

        // Normalizzazione dei dati
        const formattedFilms = films.map(f => ({
            id: f.id_contenuto.toString(),
            title: f.titolo_contenuto,
            thumbnail: f.copertina_url || "https://picsum.photos/300/200?random=1",
            vposter: f.vposter_url || "https://picsum.photos/400/600?random=1",
            type: "film"
        }));

        const formattedSeries = series.map(s => ({
            id: s.id_serie_tv.toString(),
            title: s.titolo_serie_tv,
            thumbnail: s.img_hero || "https://picsum.photos/300/200?random=2",
            vposter: s.vposter_url || "https://picsum.photos/400/600?random=2",
            type: "serie_tv"
        }));

        return [...formattedFilms, ...formattedSeries];
    } catch (error) {
        console.error("Errore recupero dati lista:", error);
        return [];
    }
}