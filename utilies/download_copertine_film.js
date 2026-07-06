import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';

const percorsoDB = path.join(process.cwd(), 'prisma', 'netflix.db');
const db = new Database(percorsoDB);

const TMDB_API_KEY = process.env.TMDB_API_KEY;

const BASE_IMAGE_URL = 'https://image.tmdb.org/t/p/original';
// La directory di output rimane invariata per centralizzare gli asset hero
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'images', 'hero');

async function popolaCopertineFilm() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  try {
    // Estrazione dei soli film privi di copertina
    const querySelect = "SELECT id_contenuto, titolo_contenuto FROM contenuti WHERE tipo = 'film' AND (copertina_url IS NULL OR copertina_url = '')";
    const filmDaAggiornare = db.prepare(querySelect).all();

    if (filmDaAggiornare.length === 0) {
      console.log("Nessun record richiede aggiornamento.");
      return;
    }

    console.log(`Trovati ${filmDaAggiornare.length} film da elaborare.`);

    // Preparazione dello statement di update sulla tabella contenuti
    const updateFilm = db.prepare('UPDATE contenuti SET copertina_url = ? WHERE id_contenuto = ?');

    for (const film of filmDaAggiornare) {
      console.log(`\nRicerca TMDB per: ${film.titolo_contenuto}...`);

      const query = encodeURIComponent(film.titolo_contenuto);
      // Utilizzo dell'endpoint specifico per i film (/search/movie)
      const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${query}&language=it-IT&page=1`;
      
      const response = await fetch(searchUrl);
      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        console.log(`[SKIP] Nessun risultato trovato su TMDB per: ${film.titolo_contenuto}`);
        continue;
      }

      const primoRisultato = data.results[0];

      // Utilizzo del backdrop_path per formati landscape (hero)
      if (!primoRisultato.backdrop_path) {
        console.log(`[SKIP] Immagine hero (backdrop) non disponibile per: ${film.titolo_contenuto}`);
        continue;
      }

      const imageUrl = `${BASE_IMAGE_URL}${primoRisultato.backdrop_path}`;
      const nomePulito = film.titolo_contenuto.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      
      // Modifica del prefisso per distinguere i file nel file system
      const fileName = `db_film_${film.id_contenuto}_${nomePulito}.jpg`;
      const filePath = path.join(OUTPUT_DIR, fileName);

      const imageRes = await fetch(imageUrl);
      const arrayBuffer = await imageRes.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      fs.writeFileSync(filePath, buffer);

      const percorsoRelativo = `/images/hero/${fileName}`;
      updateFilm.run(percorsoRelativo, film.id_contenuto);

      console.log(`[OK] Aggiornato record ID ${film.id_contenuto} con immagine: ${fileName}`);
    }

    console.log("\nSincronizzazione completata con successo.");

  } catch (error) {
    console.error("Errore critico durante l'operazione:", error);
  } finally {
    db.close(); 
  }
}

popolaCopertineFilm();