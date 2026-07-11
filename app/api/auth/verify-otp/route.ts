// libreria esterna di node.js
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
// interazione con il database
import { PrismaClient } from "@prisma/client";
// oggetto di risposta standard di next.js
import { NextResponse } from "next/server";
// Importa la funzione cookies da Next.js per gestire i cookie
import { cookies } from "next/headers";

// indica a prisma di utlizzare better-sqlite3 e lo collega al mio db
const adapter = new PrismaBetterSqlite3({ url: "file:./prisma/netflix.db" });
// crea l'oggetto prisma passandogli l'adapter appena creato
const prisma = new PrismaClient({ adapter });

// Definire un'interfaccia esplicita per la verifica dell'Otp
interface VerifyOtpResponse {
  success: boolean;
  redirect?: string;
  error?: string;
}

// Il nome della funzione (POST) definisce strettamente il metodo HTTP accettato
export async function POST(request: Request) {
  try {
    //ESTRAZIONE DATI: Parsing asincrono del corpo della richiesta JSON.
    const { email, otp } = await request.json();

    //  VALIDAZIONE INPUT (Fail-Fast): in caso di fallimento
    if (!email || !otp) {
      return NextResponse.json<VerifyOtpResponse>(
        { success: false, error: "Email o codice mancanti" },
        { status: 400 }
      );
    }

    // QUERY AL DATABASE (Find): ricerca utente
    const user = await prisma.utenti.findUnique({ where: { email } });

    // 5. AUTENTICAZIONE (Match del codice): 
    if (!user || user.otpCode !== otp) {
      return NextResponse.json<VerifyOtpResponse>(
        { success: false, error: "Codice errato" },
        { status: 401 }
      );
    }

    // VALIDAZIONE SCADENZA (Time-to-Live):
    const now = new Date();
    if (!user.otpExpiry || user.otpExpiry < now) { 
      return NextResponse.json<VerifyOtpResponse>(
        { success: false, error: "Codice scaduto. Richiedine uno nuovo." },
        { status: 401 }
      );
    }

    // Salva il codice e la scadenza generati sul record specifico dell'utente.
    await prisma.utenti.update({
      where: { email },
      data: { otpCode: null, otpExpiry: null },
    });

    // Crea una sessione REALE collegata all'utente (non più token fisso)
    const session = await prisma.sessioni.create({
      data: {
        id_utente: user.id_utente,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 giorni
      },
    });

    const cookieStore = await cookies(); // Ottiene l'oggetto cookieStore per gestire i cookie
    cookieStore.set("session_token", String(session.id_sessione), {
      //httpOnly: Fondamentale. Impedisce al codice JavaScript del browser di leggere il cookie.
      httpOnly: true,
      // secure: Se true, il cookie viaggia SOLO su connessioni HTTPS cifrate.
      // Dinamico: in sviluppo (localhost) è false, in produzione (Vercel) è true.
      secure: process.env.NODE_ENV === "production",
      // sameSite: "lax" previene attacchi CSRF (Cross-Site Request Forgery) 
      // bloccando l'invio del cookie se la richiesta arriva da un dominio esterno,
      // a meno che non sia una navigazione top-level (es. un link diretto).
      sameSite: "lax",
      // maxAge: Durata vitale del cookie in secondi (coincide con la scadenza DB).
      maxAge: 60 * 60 * 24 * 7,
    });

    // RISPOSTA DI SUCCESSO:
    return NextResponse.json<VerifyOtpResponse>({
      success: true,
      redirect: "/browse", // mi reinderizza alla pagina di browse
    });
  } catch (error) {
    console.error("Errore verifica OTP:", error);
    return NextResponse.json<VerifyOtpResponse>(
      { success: false, error: "Errore interno del server" },
      { status: 500 }
    );
  }
}