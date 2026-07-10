import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

interface FavoriteRequest {
  idProfilo: number;
  idContenuto: number;
  tipo: 'film' | 'serie';
  azione: 'aggiungi' | 'rimuovi';
}

export async function POST(request: NextRequest) {
  try {
    const body: FavoriteRequest = await request.json();
    const { idProfilo, idContenuto, tipo, azione } = body;

    if (!idProfilo || !idContenuto || !tipo || !azione) {
      return NextResponse.json({ error: 'Parametri mancanti' }, { status: 400 });
    }

    if (tipo === 'film') {
      if (azione === 'aggiungi') {
        // Upsert permette di aggiungere un record se non esiste o aggiornare se esiste già
        await prisma.salva_film.upsert({
          where: { id_film_id_profilo: { id_film: idContenuto, id_profilo: idProfilo } },
          update: {},   // Funziona da create if not exists, perchè non aggiorna 
          create: { id_film: idContenuto, id_profilo: idProfilo },
        });
      } else if (azione === 'rimuovi') {
        await prisma.salva_film.deleteMany({
          where: { id_film: idContenuto, id_profilo: idProfilo },
        });
      }
    } else if (tipo === 'serie') {
      if (azione === 'aggiungi') {
        await prisma.salva_serie.upsert({
          where: { id_serie_tv_id_profilo: { id_serie_tv: idContenuto, id_profilo: idProfilo } },
          update: {},
          create: { id_serie_tv: idContenuto, id_profilo: idProfilo },
        });
      } else if (azione === 'rimuovi') {
        await prisma.salva_serie.deleteMany({
          where: { id_serie_tv: idContenuto, id_profilo: idProfilo },
        });
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Errore POST preferiti:', error);
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 });
  }
}

// GET per verificare se è nei preferiti
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const idProfiloStr = url.searchParams.get('idProfilo');
    const idContenutoStr = url.searchParams.get('idContenuto');
    const tipo = url.searchParams.get('tipo');    // tipo è il tipo di contenuto (film / serie)

    if (!idProfiloStr || !idContenutoStr || !tipo) {
      return NextResponse.json({ success: false, isFavorite: false }, { status: 400 });
    }

    const idProfilo = parseInt(idProfiloStr, 10);
    const idContenuto = parseInt(idContenutoStr, 10);

    if (isNaN(idProfilo) || isNaN(idContenuto)) {
      return NextResponse.json({ success: false, isFavorite: false }, { status: 400 });
    }

    let isFavorite = false;

    if (tipo === 'film') {
      const record = await prisma.salva_film.findUnique({
        where: { id_film_id_profilo: { id_film: idContenuto, id_profilo: idProfilo } },
      });
      // Validazione rigorosa: se il record esiste è true, altrimenti false
      isFavorite = record !== null; 
    } else if (tipo === 'serie') {
      const record = await prisma.salva_serie.findUnique({
        where: { id_serie_tv_id_profilo: { id_serie_tv: idContenuto, id_profilo: idProfilo } },
      });
      isFavorite = record !== null;
    }

    // Risposta "piatta", senza annidamenti complessi
    return NextResponse.json({ success: true, isFavorite: isFavorite }, { status: 200 });
    
  } catch (error) {
    console.error('Errore GET preferiti:', error);
    return NextResponse.json({ success: false, isFavorite: false }, { status: 500 });
  }
}