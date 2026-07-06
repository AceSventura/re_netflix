import { PrismaClient } from "../../prisma/generated/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { NextResponse } from "next/server";

// Nota: se questa inizializzazione ti dava errore, la sintassi corretta di solito è:
// import Database from "better-sqlite3";
// const db = new Database("./prisma/netflix.db");
// const adapter = new PrismaBetterSqlite3(db);
const adapter = new PrismaBetterSqlite3({ url: "file:./prisma/netflix.db" } as any); 
const prisma = new PrismaClient({ adapter });

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email mancante" }, { status: 400 });
    }

    // 1. Controlla se l'utente esiste realmente nel DB
    const user = await prisma.user.findUnique({ 
      where: { email } 
    });

    // Se user è null, significa che l'email non è nel database
    if (!user) {
      return NextResponse.json({ error: "Utente non trovato" }, { status: 404 });
    }

    // 2. Genera un codice a 4 cifre
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

    // 3. Calcola la scadenza (ora + 15 minuti)
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 15);

    // 4. Salva il codice e la scadenza nel Database
    await prisma.user.update({
      where: { email },
      data: { otpCode, otpExpiry }
    });

    // 5. Gestione assenza servizio mail
    console.log(`[DEV EMAIL SIMULATOR] A: ${email} | Il tuo codice Netflix è: ${otpCode}`);

    // Costruiamo la risposta
    const responsePayload: any = { 
      success: true, 
      message: "Codice generato e salvato con successo" 
    };

    // TRUCCO PER LO SVILUPPO: Se sei in locale, restituisci il codice nel JSON 
    // così il frontend o Postman/Insomnia possono leggerlo facilmente per i test.
    // RICORDATI DI RIMUOVERE QUESTO CONTROLLO IN PRODUZIONE!
    if (process.env.NODE_ENV === "development") {
      responsePayload.devOtpCode = otpCode;
    }

    return NextResponse.json(responsePayload);

  } catch (error) {
    console.error("Errore invio OTP:", error);
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  }
}