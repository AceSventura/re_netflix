'use server';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface ProgressUpdateRequest {
  idProfilo: number;
  durataVisualizzata: number;
  statoCompletamento?: boolean;
}

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const contentId = parseInt(id);
    const body: ProgressUpdateRequest = await request.json();

    const { idProfilo, durataVisualizzata, statoCompletamento } = body;

    if (!idProfilo || durataVisualizzata === undefined) {
      return NextResponse.json(
        { error: 'idProfilo e durataVisualizzata sono obbligatori' },
        { status: 400 }
      );
    }

    // Upsert: se esiste, aggiorna; se non esiste, crea
    const guarda = await prisma.guarda.upsert({
      where: {
        id_contenuto_id_profilo: {
          id_contenuto: contentId,
          id_profilo: idProfilo,
        },
      },
      update: {
        durata_visualizzata: durataVisualizzata,
        stato_completamento: statoCompletamento ?? undefined,
      },
      create: {
        id_contenuto: contentId,
        id_profilo: idProfilo,
        durata_visualizzata: durataVisualizzata,
        stato_completamento: statoCompletamento ?? false,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Progresso salvato',
        data: guarda,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Errore nel salvataggio del progresso:', error);

    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}

// GET per recuperare il progresso
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const contentId = parseInt(id);
    const url = new URL(request.url);
    const idProfilo = url.searchParams.get('idProfilo');

    if (!idProfilo) {
      return NextResponse.json(
        { error: 'idProfilo mancante' },
        { status: 400 }
      );
    }

    const guarda = await prisma.guarda.findUnique({
      where: {
        id_contenuto_id_profilo: {
          id_contenuto: contentId,
          id_profilo: parseInt(idProfilo),
        },
      },
    });

    if (!guarda) {
      return NextResponse.json(
        { data: null, message: 'Nessun progresso trovato' },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: guarda,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Errore nel recupero del progresso:', error);

    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}
