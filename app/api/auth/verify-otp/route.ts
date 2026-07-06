import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// 1. Inizializzazione pulita del database e di Prisma
const adapter = new PrismaBetterSqlite3({ url: "file:./prisma/netflix.db" });
const prisma = new PrismaClient({ adapter });

// 2. Definizione dell'interfaccia per la risposta (Type-Safe)
interface VerifyOtpResponse {
  success: boolean;
  redirect?: string;
  error?: string;
}

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    // Validazione base degli input
    if (!email || !otp) {
      return NextResponse.json<VerifyOtpResponse>(
        { success: false, error: "Email o codice mancanti" }, 
        { status: 400 }
      );
    }

    // 3. Recupera l'utente dal Database
    const user = await prisma.utenti.findUnique({ 
      where: { email } 
    });

    // 4. Controlli di sicurezza incrociati
    if (!user || user.otpCode !== otp) {
      return NextResponse.json<VerifyOtpResponse>(
        { success: false, error: "Codice errato" }, 
        { status: 401 }
      );
    }

    const now = new Date();
    if (!user.otpExpiry || user.otpExpiry < now) {
      return NextResponse.json<VerifyOtpResponse>(
        { success: false, error: "Codice scaduto. Richiedine uno nuovo." }, 
        { status: 401 }
      );
    }

    // 5. Successo! Pulisci il codice OTP dal DB per evitare riutilizzi (Usa e Getta)
    await prisma.utenti.update({
      where: { email },
      data: { otpCode: null, otpExpiry: null }
    });

    // 6. Crea la sessione utente impostando un Cookie Sicuro
    const cookieStore = await cookies(); // <--- Aggiungi l'await qui
    
    cookieStore.set("session_token", "dummy-token-generato", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7 // Scade tra 7 giorni
    });

    // Rispondi con il segnale di successo e la rotta verso cui il frontend deve reindirizzare
    return NextResponse.json<VerifyOtpResponse>({ 
      success: true, 
      redirect: "/browse" 
    });

  } catch (error) {
    console.error("Errore verifica OTP:", error);
    return NextResponse.json<VerifyOtpResponse>(
      { success: false, error: "Errore interno del server" }, 
      { status: 500 }
    );
  }
}