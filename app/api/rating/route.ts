'use server';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type RatingValue = 'Non fa per me' | 'Mi piace' | 'Adoro!';

interface RatingRequest {
  idProfilo: number;
  idFilm: number;
  punteggio: RatingValue;
}

export async function POST(request: NextRequest) {
  try {
    const body: RatingRequest = await request.json();
    const { idProfilo, idFilm, punteggio } = body;

    if (!idProfilo || !idFilm || !punteggio) {
      return NextResponse.json(
        { error: 'idProfilo, idFilm e punteggio sono obbligatori' },
        { status: 400 }
      );
    }

    // Valida il valore del punteggio
    const validRatings: RatingValue[] = [
      'Non fa per me',
      'Mi piace',
      'Adoro!',
    ];
    if (!validRatings.includes(punteggio)) {
      return NextResponse.json(
        { error: 'Punteggio non valido' },
        { status: 400 }
      );
    }

    // Upsert: se esiste una valutazione, la aggiorna; altrimenti la crea
    const valutazione = await prisma.valutazioni.upsert({
      where: {
        id_profilo_id_film: {
          id_profilo: idProfilo,
          id_film: idFilm,
        },
      },
      update: {
        punteggio: punteggio as any, // Cast necessario per enum
      },
      create: {
        id_profilo: idProfilo,
        id_film: idFilm,
        punteggio: punteggio as any,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Valutazione salvata',
        data: valutazione,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Errore nel salvataggio della valutazione:', error);

    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}

// GET per recuperare la valutazione
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const idProfilo = url.searchParams.get('idProfilo');
    const idFilm = url.searchParams.get('idFilm');

    if (!idProfilo || !idFilm) {
      return NextResponse.json(
        { error: 'idProfilo e idFilm mancanti' },
        { status: 400 }
      );
    }

    const valutazione = await prisma.valutazioni.findFirst({
      where: {
        id_profilo: parseInt(idProfilo),
        id_film: parseInt(idFilm),
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: valutazione || null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Errore nel recupero della valutazione:', error);

    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}
