import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const adapter = new PrismaBetterSqlite3({ url: "file:./prisma/netflix.db" });
const prisma = new PrismaClient({ adapter });

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session_token")?.value;

    if (!sessionToken) {
      return NextResponse.json({ success: false, error: "Non autorizzato" }, { status: 401 });
    }

    const user = await prisma.utenti.findUnique({
      where: { session_token: sessionToken },
      include: { profili: true }
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "Sessione non valida" }, { status: 401 });
    }

    return NextResponse.json({ 
      success: true, 
      profiles: user.profili 
    });

  } catch (error) {
    console.error("Errore recupero profili:", error);
    return NextResponse.json({ success: false, error: "Errore interno" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session_token")?.value;

    if (!sessionToken) {
      return NextResponse.json({ success: false, error: "Non autorizzato" }, { status: 401 });
    }

    const { nome_profilo, avatar_url } = await request.json();

    if (!nome_profilo || !avatar_url) {
      return NextResponse.json({ success: false, error: "Dati mancanti" }, { status: 400 });
    }

    const user = await prisma.utenti.findUnique({
      where: { session_token: sessionToken }
    });

    if (!user) return NextResponse.json({ success: false, error: "Utente non trovato" }, { status: 401 });

    const count = await prisma.profili.count({ where: { id_utente: user.id_utente } });
    if (count >= 5) {
      return NextResponse.json({ success: false, error: "Limite profili raggiunto" }, { status: 403 });
    }

    const newProfile = await prisma.profili.create({
      data: {
        nome_profilo,
        avatar_url,
        id_utente: user.id_utente
      }
    });

    return NextResponse.json({ success: true, profile: newProfile });

  } catch (error) {
    console.error("Errore creazione profilo:", error);
    return NextResponse.json({ success: false, error: "Errore interno" }, { status: 500 });
  }
}