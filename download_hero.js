import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3'; // Utilizzo diretto del driver nativo

// 1. Connessione diretta al database (bypassa Prisma per questo script CLI)
const percorsoDB = path.join(process.cwd(), 'prisma', 'netflix.db');
const db = new Database(percorsoDB);

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const BASE_IMAGE_URL = 'https://image.tmdb.org/t/p/original';
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'images', 'hero');

async function popolaCopertine() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  try {
    // 2. Query SQL nativa: Estrazione delle serie senza immagine
    const serieDaAggiornare = db.prepare('SELECT id_serie_tv, titolo_serie_tv FROM Serie_tv WHERE img_hero IS NULL').all();

    if (serieDaAggiornare.length === 0) {
      console.log("Nessun record richiede aggiornamento.");
      return;
    }

    console.log(`Trovate ${serieDaAggiornare.length} serie da elaborare.`);

    // Compilazione della query di aggiornamento per massimizzare le performance
    const updateSerie = db.prepare('UPDATE Serie_tv SET img_hero = ? WHERE id_serie_tv = ?');

    for (const serie of serieDaAggiornare) {
      console.log(`\nRicerca TMDB per: ${serie.titolo_serie_tv}...`);

      const query = encodeURIComponent(serie.titolo_serie_tv);
      const searchUrl = `https://api.themoviedb.org/3/search/tv?api_key=${TMDB_API_KEY}&query=${query}&page=1`;
      
      const response = await fetch(searchUrl);
      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        console.log(`[SKIP] Nessun risultato trovato su TMDB per: ${serie.titolo_serie_tv}`);
        continue;
      }

      const primoRisultato = data.results[0];

      if (!primoRisultato.backdrop_path) {
        console.log(`[SKIP] Immagine hero (backdrop) non disponibile per: ${serie.titolo_serie_tv}`);
        continue;
      }

      const imageUrl = `${BASE_IMAGE_URL}${primoRisultato.backdrop_path}`;
      const nomePulito = serie.titolo_serie_tv.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      
      const fileName = `db_${serie.id_serie_tv}_${nomePulito}.jpg`;
      const filePath = path.join(OUTPUT_DIR, fileName);

      const imageRes = await fetch(imageUrl);
      const arrayBuffer = await imageRes.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      fs.writeFileSync(filePath, buffer);

      // 3. Esecuzione nativa dell'UPDATE nel database
      const percorsoRelativo = `/images/hero/${fileName}`;
      updateSerie.run(percorsoRelativo, serie.id_serie_tv);

      console.log(`[OK] Aggiornato record ID ${serie.id_serie_tv} con immagine: ${fileName}`);
    }

    console.log("\nSincronizzazione completata con successo.");

  } catch (error) {
    console.error("Errore critico durante l'operazione:", error);
  } finally {
    // Chiusura sicura della connessione al database
    db.close(); 
  }
}

popolaCopertine();