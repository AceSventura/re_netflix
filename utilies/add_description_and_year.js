import 'dotenv/config';
import path from 'path';
import Database from 'better-sqlite3';

const percorsoDB = path.join(process.cwd(), 'prisma', 'netflix.db');
const db = new Database(percorsoDB);

const TMDB_API_KEY = process.env.TMDB_API_KEY;

async function popolaDescrizioniEAnno() {
  try {
    // 1. Estrazione: seleziona le serie senza descrizione o senza anno
    const serieDaAggiornare = db.prepare("SELECT id_serie_tv, titolo_serie_tv FROM serie_tv WHERE descrizione IS NULL OR descrizione = '' OR anno_inizio IS NULL").all();

    if (serieDaAggiornare.length === 0) {
      console.log("Nessun record richiede aggiornamento.");
      return;
    }

    console.log(`Trovate ${serieDaAggiornare.length} serie da elaborare.`);

    // 2. Query di aggiornamento multiplo
    const updateSerie = db.prepare('UPDATE serie_tv SET descrizione = ?, anno_inizio = ? WHERE id_serie_tv = ?');

    for (const serie of serieDaAggiornare) {
      console.log(`\nRicerca TMDB per: ${serie.titolo_serie_tv}...`);

      const query = encodeURIComponent(serie.titolo_serie_tv);
      const searchUrl = `https://api.themoviedb.org/3/search/tv?api_key=${TMDB_API_KEY}&query=${query}&language=it-IT&page=1`;
      
      const response = await fetch(searchUrl);
      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        console.log(`[SKIP] Nessun risultato trovato su TMDB per: ${serie.titolo_serie_tv}`);
        continue;
      }

      const primoRisultato = data.results[0];
      const overview = primoRisultato.overview || null;
      
      // 3. Estrazione e conversione dell'anno
      let annoInizio = null;
      if (primoRisultato.first_air_date) {
        // Taglia i primi 4 caratteri della stringa YYYY-MM-DD e converte in intero
        annoInizio = parseInt(primoRisultato.first_air_date.substring(0, 4), 10);
      }

      if (!overview && !annoInizio) {
        console.log(`[SKIP] Dati insufficienti su TMDB per: ${serie.titolo_serie_tv}`);
        continue;
      }

      // 4. Esecuzione dell'UPDATE
      updateSerie.run(overview, annoInizio, serie.id_serie_tv);

      console.log(`[OK] Aggiornati descrizione e anno (${annoInizio}) per ID ${serie.id_serie_tv}`);
    }

    console.log("\nSincronizzazione completata con successo.");

  } catch (error) {
    console.error("Errore critico durante l'operazione:", error);
  } finally {
    db.close(); 
  }
}

popolaDescrizioniEAnno();