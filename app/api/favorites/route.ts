'use server';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";

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
      return NextResponse.json(
        { error: 'Parametri obbligatori mancanti' },
        { status: 400 }
      );
    }

    if (tipo === 'film') {
      if (azione === 'aggiungi') {
        // Usa upsert per evitare errori di duplicati
        await prisma.salva_film.upsert({
          where: {
            id_film_id_profilo: {
              id_film: idContenuto,
              id_profilo: idProfilo,
            },
          },
          update: {},
          create: {
            id_film: idContenuto,
            id_profilo: idProfilo,
          },
        });
      } else if (azione === 'rimuovi') {
        await prisma.salva_film.delete({
          where: {
            id_film_id_profilo: {
              id_film: idContenuto,
              id_profilo: idProfilo,
            },
          },
        });
      }
    } else if (tipo === 'serie') {
      if (azione === 'aggiungi') {
        await prisma.salva_serie.upsert({
          where: {
            id_serie_tv_id_profilo: {
              id_serie_tv: idContenuto,
              id_profilo: idProfilo,
            },
          },
          update: {},
          create: {
            id_serie_tv: idContenuto,
            id_profilo: idProfilo,
          },
        });
      } else if (azione === 'rimuovi') {
        await prisma.salva_serie.delete({
          where: {
            id_serie_tv_id_profilo: {
              id_serie_tv: idContenuto,
              id_profilo: idProfilo,
            },
          },
        });
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: `Film ${azione === 'aggiungi' ? 'aggiunto ai' : 'rimosso dai'} preferiti`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Errore nella gestione dei preferiti:', error);

    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}

// GET per verificare se è nei preferiti
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const idProfilo = url.searchParams.get('idProfilo');
    const idContenuto = url.searchParams.get('idContenuto');
    const tipo = url.searchParams.get('tipo') as 'film' | 'serie';

    if (!idProfilo || !idContenuto || !tipo) {
      return NextResponse.json(
        { error: 'Parametri mancanti' },
        { status: 400 }
      );
    }

    let isFavorite = false;

    if (tipo === 'film') {
      const salvaFilm = await prisma.salva_film.findUnique({
        where: {
          id_film_id_profilo: {
            id_film: parseInt(idContenuto),
            id_profilo: parseInt(idProfilo),
          },
        },
      });
      isFavorite = !!salvaFilm;
    } else if (tipo === 'serie') {
      const salvaSerie = await prisma.salva_serie.findUnique({
        where: {
          id_serie_tv_id_profilo: {
            id_serie_tv: parseInt(idContenuto),
            id_profilo: parseInt(idProfilo),
          },
        },
      });
      isFavorite = !!salvaSerie;
    }

    return NextResponse.json(
      {
        success: true,
        data: { isFavorite },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Errore nel controllo dei preferiti:', error);

    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}
