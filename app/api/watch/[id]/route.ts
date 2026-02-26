import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  context: { params: any } // params potrebbe essere una Promise in Next 14+
) {
  try {
    // 1. Unwrap dei params dinamici
    const unwrappedParams = await context.params;
    const contentId = Number(unwrappedParams.id);

    // 2. Validazione ID
    if (!unwrappedParams.id || isNaN(contentId)) {
      return NextResponse.json(
        { success: false, error: 'ID non valido' },
        { status: 400 }
      );
    }

    // 3. Recupero contenuto da DB
    const contenuto = await prisma.contenuti.findUnique({
      where: { id_contenuto: contentId },
    });

    if (!contenuto) {
      return NextResponse.json(
        { success: false, error: 'Contenuto non trovato' },
        { status: 404 }
      );
    }

    // 4. URL dello streaming (HLS)
    const manifestUrl = `/media/${contentId}/master.m3u8`;

    // 5. Risposta JSON
    return NextResponse.json({
      success: true,
      data: {
        id: contenuto.id_contenuto,
        titolo: contenuto.titolo_contenuto,
        streaming: {
          videoUrl: manifestUrl,
        },
      },
    });
  } catch (error) {
    console.error('Errore API watch/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Errore interno' },
      { status: 500 }
    );
  }
}