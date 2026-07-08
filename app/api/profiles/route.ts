import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token')?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    // 1. Recupera la sessione per ottenere l'id_utente
    const session = await prisma.sessioni.findUnique({
        where: { id_sessione: parseInt(sessionToken, 10) },
        select: { id_utente: true }
    });

    if (!session) {
         return NextResponse.json({ error: 'Sessione non valida' }, { status: 401 });
    }

    // 2. Recupera i profili associati a quell'utente
    const profiles = await prisma.profili.findMany({
      where: {
        id_utente: session.id_utente,
      },
      select: {
        id_profilo: true,
        nome_profilo: true,
        avatar_url: true,
      },
      orderBy: {
         id_profilo: 'asc' // Ordina per ID per mantenere la consistenza
      }
    });

    return NextResponse.json({ profiles });
  } catch (error) {
    console.error('Errore recupero profili:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}