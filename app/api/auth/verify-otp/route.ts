import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const adapter = new PrismaBetterSqlite3({ url: "file:./prisma/netflix.db" });
const prisma = new PrismaClient({ adapter });

interface VerifyOtpResponse {
  success: boolean;
  redirect?: string;
  error?: string;
}

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json<VerifyOtpResponse>(
        { success: false, error: "Email o codice mancanti" },
        { status: 400 }
      );
    }

    const user = await prisma.utenti.findUnique({ where: { email } });

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

    const cookieStore = await cookies();
    cookieStore.set("session_token", String(session.id_sessione), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json<VerifyOtpResponse>({
      success: true,
      redirect: "/browse",
    });
  } catch (error) {
    console.error("Errore verifica OTP:", error);
    return NextResponse.json<VerifyOtpResponse>(
      { success: false, error: "Errore interno del server" },
      { status: 500 }
    );
  }
}