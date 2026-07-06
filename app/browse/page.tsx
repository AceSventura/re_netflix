import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '../../prisma/generated/client';
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";


// 1. Inizializzazione del client Prisma
const adapter = new PrismaBetterSqlite3({ url: "file:./prisma/netflix.db" });
const prisma = new PrismaClient({ adapter });

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const BASE_IMAGE_URL = 'https://image.tmdb.org/t/p/original';
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'images', 'hero');

async function popolaCopertineFilm() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  try {
    // 2. Estrazione tramite Prisma ORM
    const filmDaAggiornare = await prisma.contenuti.findMany({
      where: {
        tipo: 'film',
        OR: [
          { copertina_url: null },
          { copertina_url: '' }
        ]
      },
      select: {
        id_contenuto: true,
        titolo_contenuto: true
      }
    });

    if (filmDaAggiornare.length === 0) {
      console.log("Nessun record richiede aggiornamento.");
      return;
    }

    console.log(`Trovati ${filmDaAggiornare.length} film da elaborare.`);

    for (const film of filmDaAggiornare) {
      console.log(`\nRicerca TMDB per: ${film.titolo_contenuto}...`);

      const query = encodeURIComponent(film.titolo_contenuto);
      const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${query}&language=it-IT&page=1`;
      
      const response = await fetch(searchUrl);
      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        console.log(`[SKIP] Nessun risultato trovato su TMDB per: ${film.titolo_contenuto}`);
        continue;
      }

      const primoRisultato = data.results[0];

      if (!primoRisultato.backdrop_path) {
        console.log(`[SKIP] Immagine hero (backdrop) non disponibile per: ${film.titolo_contenuto}`);
        continue;
      }

      const imageUrl = `${BASE_IMAGE_URL}${primoRisultato.backdrop_path}`;
      const nomePulito = film.titolo_contenuto.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      
      const fileName = `db_film_${film.id_contenuto}_${nomePulito}.jpg`;
      const filePath = path.join(OUTPUT_DIR, fileName);

      const imageRes = await fetch(imageUrl);
      const arrayBuffer = await imageRes.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      fs.writeFileSync(filePath, buffer);

      const percorsoRelativo = `/images/hero/${fileName}`;

      // 3. Esecuzione dell'UPDATE tramite Prisma ORM
      await prisma.contenuti.update({
        where: { id_contenuto: film.id_contenuto },
        data: { copertina_url: percorsoRelativo }
      });

      console.log(`[OK] Aggiornato record ID ${film.id_contenuto} con immagine: ${fileName}`);
    }

    console.log("\nSincronizzazione completata con successo.");

  } catch (error) {
    console.error("Errore critico durante l'operazione:", error);
  } finally {
    // 4. Disconnessione sicura dal database
    await prisma.$disconnect(); 
  }
}

popolaCopertineFilm();