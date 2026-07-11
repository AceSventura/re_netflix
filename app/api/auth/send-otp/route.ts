// interazione con il database
import { PrismaClient } from "@prisma/client";
// libreria esterna di node.js
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
// oggetto di risposta standard di next.js
import { NextResponse } from "next/server";

// indica a prisma di utlizzare better-sqlite3 e lo collega al mio db
const adapter = new PrismaBetterSqlite3({ url: "file:./prisma/netflix.db" }); 
// crea l'oggetto prisma passandogli l'adapter appena creato
const prisma = new PrismaClient({ adapter });

// Definire un'interfaccia esplicita per il payload di risposta 
interface OtpResponsePayload {
  success: boolean; 
  message: string;
  devOtpCode?: string; // Il "?" indica che questo campo è facoltativo (apparirà solo in dev)
}

// Il nome della funzione (POST) definisce strettamente il metodo HTTP accettato
export async function POST(request: Request) {
  try {
    //ESTRAZIONE DATI: Parsing asincrono del corpo della richiesta JSON.
    const { email } = await request.json(); 

    // Verifica subito i requisiti minimi. Se manca l'email, blocca l'esecuzione
    // e restituisce un errore 400 (Bad Request) per risparmiare risorse server
    if (!email) {
      return NextResponse.json({ error: "Email mancante" }, { status: 400 });
    }

    // QUERY AL DATABASE (Find): ricerca utente
    const user = await prisma.utenti.findUnique({ 
      where: { email } 
    });

      // Sicurezza: Restituisce 404 se l'utente non esiste, simulando l'invio.
    if (!user) {
      return NextResponse.json({ error: "Utente non trovato" }, { status: 404 });
    }

    // Crea un numero casuale a 4 cifre. 
    // Math.random() genera un decimale [0, 1). Moltiplicato per 9000 dà [0, 8999).
    // Aggiungendo 1000 otteniamo un range sicuro [1000, 9999].
    const otpCode = Math.floor(1000 + Math.random() * 9000);

    // Gestione della scadenza (15 minuti nel futuro rispetto all'ora attuale del server)
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 15);

    // Salva il codice e la scadenza generati sul record specifico dell'utente.
    await prisma.utenti.update({
      where: { email },
      data: { otpCode, otpExpiry }
    });

    // Simulazione di un servizio di invio email
    console.log(`[DEV EMAIL SIMULATOR] A: ${email} | Il tuo codice Netflix è: ${otpCode}`);

    // 9. COSTRUZIONE RISPOSTA TIPIZZATA:
    const responsePayload: OtpResponsePayload = { 
      success: true, 
      message: "Codice generato e salvato con successo" 
    };

    // controlla se l'applicazione sta girando sul mio computer locale
    if (process.env.NODE_ENV === "development") {
      //convert l'otp in una stringa e la aggancia all'oggetto respondePayload tramite la proprietà devOtpCode
      responsePayload.devOtpCode = otpCode.toString(); 
    }

    // Risposta finale automatica
    return NextResponse.json(responsePayload);

  } catch (error) {
    // Cattura qualsiasi eccezione (DB irraggiungibile, JSON malformato, ecc.)
    // Evita il crash dell'app e restituisce un 500 (Internal Server Error).
    console.error("Errore invio OTP:", error);
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  }
}