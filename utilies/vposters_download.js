import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';

// 1. Connessione al database
const percorsoDB = path.join(process.cwd(), 'prisma', 'netflix.db');
const db = new Database(percorsoDB);

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const BASE_IMAGE_URL = 'https://image.tmdb.org/t/p/original'; 
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'images', 'vposters');

async function popolaPosterVerticali() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  try {
    // ==========================================
    // FASE 1: ELABORAZIONE SERIE TV
    // ==========================================
    console.log("--- INIZIO SINCRONIZZAZIONE POSTER SERIE TV ---");
    const serieDaAggiornare = db.prepare('SELECT id_serie_tv, titolo_serie_tv FROM Serie_tv WHERE vposter_url IS NULL').all();

    if (serieDaAggiornare.length > 0) {
      console.log(`Trovate ${serieDaAggiornare.length} serie TV da elaborare.`);
      const updateSerie = db.prepare('UPDATE Serie_tv SET vposter_url = ? WHERE id_serie_tv = ?');

      for (const serie of serieDaAggiornare) {
        console.log(`Ricerca TMDB (Serie) per: ${serie.titolo_serie_tv}...`);
        const query = encodeURIComponent(serie.titolo_serie_tv);
        const searchUrl = `https://api.themoviedb.org/3/search/tv?api_key=${TMDB_API_KEY}&query=${query}&page=1`;
        
        const response = await fetch(searchUrl);
        const data = await response.json();

        if (!data.results || data.results.length === 0 || !data.results[0].poster_path) {
          console.log(`[SKIP] Poster non disponibile per: ${serie.titolo_serie_tv}`);
          continue;
        }

        const imageUrl = `${BASE_IMAGE_URL}${data.results[0].poster_path}`;
        const nomePulito = serie.titolo_serie_tv.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        
        const fileName = `tv_${serie.id_serie_tv}_${nomePulito}.jpg`;
        const filePath = path.join(OUTPUT_DIR, fileName);

        const imageRes = await fetch(imageUrl);
        const buffer = Buffer.from(await imageRes.arrayBuffer());
        fs.writeFileSync(filePath, buffer);

        const percorsoRelativo = `/images/vposters/${fileName}`;
        updateSerie.run(percorsoRelativo, serie.id_serie_tv);

        console.log(`[OK] Aggiornato record Serie ID ${serie.id_serie_tv}`);
      }
    } else {
      console.log("Nessuna serie TV richiede l'aggiornamento del poster.");
    }

    // ==========================================
    // FASE 2: ELABORAZIONE FILM
    // ==========================================
    console.log("\n--- INIZIO SINCRONIZZAZIONE POSTER FILM ---");
    // ERRORE CORRETTO: Uso apici singoli per la stringa 'film'. Visto che la stringa JS usa già apici singoli, usiamo i backtick o facciamo escaping.
    const filmDaAggiornare = db.prepare(`SELECT id_contenuto, titolo_contenuto FROM contenuti WHERE tipo='film' AND vposter_url IS NULL`).all();

    if (filmDaAggiornare.length > 0) {
      console.log(`Trovati ${filmDaAggiornare.length} film da elaborare.`);
      
      const updateFilm = db.prepare('UPDATE contenuti SET vposter_url = ? WHERE id_contenuto = ?');

      for (const film of filmDaAggiornare) {
        // ERRORE CORRETTO: Modificato da film.titolo a film.titolo_contenuto per allinearsi alla SELECT
        console.log(`Ricerca TMDB (Film) per: ${film.titolo_contenuto}...`);
        const query = encodeURIComponent(film.titolo_contenuto);
        const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${query}&page=1`;
        
        const response = await fetch(searchUrl);
        const data = await response.json();

        if (!data.results || data.results.length === 0 || !data.results[0].poster_path) {
          console.log(`[SKIP] Poster non disponibile per: ${film.titolo_contenuto}`);
          continue;
        }

        const imageUrl = `${BASE_IMAGE_URL}${data.results[0].poster_path}`;
        const nomePulito = film.titolo_contenuto.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        
        const fileName = `movie_${film.id_contenuto}_${nomePulito}.jpg`;
        const filePath = path.join(OUTPUT_DIR, fileName);

        const imageRes = await fetch(imageUrl);
        const buffer = Buffer.from(await imageRes.arrayBuffer());
        fs.writeFileSync(filePath, buffer);

        const percorsoRelativo = `/images/vposters/${fileName}`;
        updateFilm.run(percorsoRelativo, film.id_contenuto);

        console.log(`[OK] Aggiornato record Film ID ${film.id_contenuto}`);
      }
    } else {
      console.log("Nessun film richiede l'aggiornamento del poster.");
    }

    console.log("\nSincronizzazione globale completata con successo.");

  } catch (error) {
    console.error("Errore critico durante l'operazione:", error);
  } finally {
    db.close(); 
  }
}

popolaPosterVerticali();