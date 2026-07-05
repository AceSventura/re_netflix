"use server";
 
import { PrismaClient } from "../../prisma/generated/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: "file:./prisma/netflix.db" });
const prisma = new PrismaClient({ adapter });

export async function getBrowseData() {
    try {
        // Estrazione Serie TV
        const serie = await prisma.serie_tv.findMany();
        
        // Estrazione Film
        const film = await prisma.contenuti.findMany({
            where: { tipo: "film" }
        });

        // Normalizzazione dei dati per adattarli alla prop `movies` del componente MovieRow
        const formattedSeries = serie.map(s => ({
            id: s.id_serie_tv.toString(),
            title: s.titolo_serie_tv,
            poster: s.img_hero || "https://picsum.photos/640/360?random=1", // Fallback per asset mancanti
            type: "serie"
        }));

        const formattedMovies = film.map(f => ({
            id: f.id_contenuto.toString(),
            title: f.titolo_contenuto,
            // I film non hanno ancora copertina, viene assegnato un placeholder automatico
            poster: f.copertina_url || "https://picsum.photos/640/360?random=2", 
            type: "film"
        }));

        return { series: formattedSeries, movies: formattedMovies };
    } catch (error) {
        console.error("Errore nell'estrazione dati:", error);
        return { series: [], movies: [] };
    }
}



export async function getMediaDetails(id: string, type: string) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) return null;

    try {
        if (type === "film") {
            const film = await prisma.contenuti.findUnique({
                where: { id_contenuto: numericId },
                include: { partecipa: { include: { artisti: true } }, classificato_in: { include: { generi: true } } }
            });
            
            if (!film) return null;
            const cast = film.partecipa.map(p => p.artisti.nome);
            const genres = film.classificato_in.map(c => c.generi.nome_genere);

            return {
                title: film.titolo_contenuto,
                description: film.descrizione || "Nessuna descrizione disponibile.",
                year: film.anno_rilascio || 2024,
                maturity: "T", // Non presente nello schema, valore statico
                duration: film.durata ? `${film.durata} min` : "N/D",
                cast: cast,
                genres: genres,
                heroImage: film.copertina_url || "https://picsum.photos/800/450?random=1",
                episodes: [] // I film non hanno episodi
            };
        } 
        
        if (type === "serie") {
            const serie = await prisma.serie_tv.findUnique({
                where: { id_serie_tv: numericId }
            });

            if (!serie) return null;
            return {
                title: serie.titolo_serie_tv,
                description: serie.descrizione || "Nessuna descrizione disponibile.", // Colonna assente in serie_tv
                year: serie.anno_inizio || 2026, // Colonna assente in serie_tv
                maturity: "T",
                duration: "Stagioni multiple",
                cast: [], // Relazione assente in serie_tv
                genres: [], // Relazione assente in serie_tv
                heroImage: serie.img_hero || "https://picsum.photos/800/450?random=2", // L'attributo è img_hero
                
                // Placeholder per gli episodi, poiché la tabella episodi/stagioni richiede logiche più complesse
                episodes: [
                    { title: "Episodio 1", desc: "Descrizione episodio 1", time: "45m", image: "https://picsum.photos/300/200?random=3" }
                ]
            };
        }
        
        return null;
    } catch (error) {
        console.error("Errore nell'estrazione dati:", error);
        return null;
    }
}