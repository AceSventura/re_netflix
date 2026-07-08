// app/actions/search.ts
import { prisma } from "@/lib/prisma";

export interface SearchResult {
    id: number;
    tipo: string;
    titolo: string | null;
    poster: string | null;
}

export async function fetchSearchResults(query: string): Promise<SearchResult[]> {
    if (!query) return [];

    // 1. Estrazione dati navigando la relazione tramite "stagioni"
    const results = await prisma.contenuti.findMany({
        where: {
            OR: [
                {
                    // Match sul titolo del film o episodio
                    titolo_contenuto: {
                        contains: query,
                    },
                },
                {
                    // Match sul titolo della serie TV (navigando stagioni -> serie_tv)
                    stagioni: {
                        serie_tv: {
                            titolo_serie_tv: {
                                contains: query,
                            },
                        },
                    },
                },
                {
                    // Match sul nome dell'artista
                    partecipa: {
                        some: {
                            artisti: {
                                nome: {
                                    contains: query,
                                },
                            },
                        },
                    },
                },
            ],
        },
        // Inclusione a cascata per recuperare i dati della serie madre
        include: {
            stagioni: {
                include: {
                    serie_tv: true,
                },
            },
        },
    });

    // 2. Normalizzazione e Deduplicazione
    const normalizedResults: SearchResult[] = [];
    const seenSeries = new Set<number>();

    for (const item of results) {
        if (item.tipo === "film") {
            // Mappatura per i Film
            normalizedResults.push({
                id: item.id_contenuto,
                tipo: "film",
                titolo: item.titolo_contenuto,
                poster: item.copertina_url,
            });
        } else if (item.stagioni?.serie_tv) {
            // Mappatura per le Serie TV (partendo dall'episodio trovato)
            const idSerie = item.stagioni.serie_tv.id_serie_tv;

            // Il Set evita di restituire la stessa serie più volte
            if (!seenSeries.has(idSerie)) {
                seenSeries.add(idSerie);
                normalizedResults.push({
                    id: idSerie,
                    tipo: "serie",
                    titolo: item.stagioni.serie_tv.titolo_serie_tv,
                    poster: item.stagioni.serie_tv.img_hero,
                });
            }
        }
    }

    return normalizedResults;
}