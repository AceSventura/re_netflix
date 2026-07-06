import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { NextResponse } from "next/server";

// 1. Inizializzazione corretta senza l'uso di "as any"
const adapter = new PrismaBetterSqlite3({ url: "file:./prisma/netflix.db" });
const prisma = new PrismaClient({ adapter });

// 2. Definizione stretta del tipo per evitare "any" nel payload
interface OtpResponsePayload {
  success: boolean;
  message: string;
  devOtpCode?: string; // Il "?" indica che questo campo è facoltativo (apparirà solo in dev)
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email mancante" }, { status: 400 });
    }

    const user = await prisma.utenti.findUnique({ 
      where: { email } 
    });

    if (!user) {
      return NextResponse.json({ error: "Utente non trovato" }, { status: 404 });
    }

    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 15);

    await prisma.utenti.update({
      where: { email },
      data: { otpCode, otpExpiry }
    });

    console.log(`[DEV EMAIL SIMULATOR] A: ${email} | Il tuo codice Netflix è: ${otpCode}`);

    // 3. Applichiamo l'interfaccia creata al posto di "any"
    const responsePayload: OtpResponsePayload = { 
      success: true, 
      message: "Codice generato e salvato con successo" 
    };

    if (process.env.NODE_ENV === "development") {
      responsePayload.devOtpCode = otpCode;
    }

    return NextResponse.json(responsePayload);

  } catch (error) {
    console.error("Errore invio OTP:", error);
    return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
  }
}