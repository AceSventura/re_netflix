"use server";

import { prisma } from "@/lib/prisma";
import { FormattedMedia } from "@/types";

// Variabili globali di fallback per mantenere la coerenza visiva
const DEFAULT_POSTER_H = "https://picsum.photos/640/360?random=1";
const DEFAULT_POSTER_V = "https://picsum.photos/400/600?random=1";

export async function fetchSearchResults(query: string): Promise<FormattedMedia[]> {
    if (!query) return [];

    // 1. Estrazione dati navigando la relazione tramite "stagioni"
    const results = await prisma.contenuti.findMany({
        where: {
            OR: [
                {
                    titolo_contenuto: {
                        contains: query,
                    },
                },
                {
                    stagioni: {
                        serie_tv: {
                            titolo_serie_tv: {
                                contains: query,
                            },
                        },
                    },
                },
                {
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
        include: {
            stagioni: {
                include: {
                    serie_tv: true,
                },
            },
        },
    });

    // 2. Normalizzazione e Deduplicazione secondo il DTO unificato
    const normalizedResults: FormattedMedia[] = [];
    const seenSeries = new Set<number>();

    for (const item of results) {
        if (item.tipo === "film") {
            normalizedResults.push({
                id: item.id_contenuto.toString(),
                title: item.titolo_contenuto || "Titolo sconosciuto",
                poster: item.copertina_url || DEFAULT_POSTER_H,
                vposter: item.vposter_url || DEFAULT_POSTER_V,
                type: "film",
            });
        } else if (item.stagioni?.serie_tv) {
            const idSerie = item.stagioni.serie_tv.id_serie_tv;

            if (!seenSeries.has(idSerie)) {
                seenSeries.add(idSerie);
                normalizedResults.push({
                    id: idSerie.toString(),
                    title: item.stagioni.serie_tv.titolo_serie_tv || "Titolo sconosciuto",
                    poster: item.stagioni.serie_tv.img_hero || DEFAULT_POSTER_H,
                    vposter: item.stagioni.serie_tv.vposter_url || DEFAULT_POSTER_V,
                    type: "serie",
                });
            }
        }
    }

    return normalizedResults;
}