'use server';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { StreamingContent, StreamingResponse } from '@/lib/types/streaming';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const contentId = parseInt(id);

    // Recupera il contenuto con tutte le relazioni
    const contenuto = await prisma.contenuti.findUnique({
      where: { id_contenuto: contentId },
      include: {
        stagione: {
          select: {
            numero_stagione: true,
            titolo_stagione: true,
          },
        },
        codifiche: {
          include: {
            asset_video: true,
          },
        },
        include_audio: {
          include: {
            asset_audio: {
              include: {
                parlato_in: {
                  include: {
                    lingua: true,
                  },
                },
              },
            },
          },
        },
        sottotitoli: {
          include: {
            tradotto_in: {
              include: {
                lingua: true,
              },
            },
          },
        },
        classificazioni: {
          include: {
            genere: true,
          },
        },
        partecipa: {
          include: {
            artista: true,
          },
        },
      },
    });

    if (!contenuto) {
      const response: StreamingResponse = {
        success: false,
        error: 'Contenuto non trovato',
        statusCode: 404,
      };
      return NextResponse.json(response, { status: 404 });
    }

    // SEMPLIFICATO: Controllo basic (in produzione aggiungere auth + licenze)
    // Per ora assumiamo che se il contenuto esiste, è accessibile
    // In produzione: verificare Soggetto_a (licenze) + territorio + subscription

    // Costruisci la response di streaming
    const streamingContent: StreamingContent = {
      id: contenuto.id_contenuto,
      titolo: contenuto.titolo_contenuto,
      descrizione: contenuto.descrizione,
      anno_rilascio: contenuto.anno_rilascio,
      durata: contenuto.durata,
      tipo: contenuto.tipo,

      // Video stream - usa il primo asset disponibile
      streaming: {
        videoUrl: contenuto.codifiche[0]?.asset_video?.url_manifest || '',
        
        // Audio tracks - mappiamo tutti gli asset audio disponibili
        audioTracks: contenuto.include_audio.map((include) => ({
          id: include.asset_audio.id_asset_audio,
          lingua: include.asset_audio.parlato_in[0]?.lingua?.nome || 'Sconosciuto',
          codec: include.asset_audio.codec,
          url: include.asset_audio.url_traccia,
        })),

        // Subtitle tracks - mappiamo tutti i sottotitoli disponibili
        subtitles: contenuto.sottotitoli.flatMap((sub) =>
          sub.tradotto_in.map((trad) => ({
            id: sub.id_sub,
            lingua: trad.lingua.nome,
            formato: sub.formato,
            tipo: sub.tipo_traccia,
            url: sub.url_sub,
          }))
        ),
      },

      // Metadata
      metadata: {
        generi: contenuto.classificazioni.map((c) => c.genere.nome_genere),
        cast: contenuto.partecipa.map((p) => ({
          id: p.artista.id_artista,
          nome: p.artista.nome,
        })),
      },

      // Se è episodio, aggiungi info stagione
      ...(contenuto.tipo === 'episodio' && contenuto.stagione
        ? {
            episodeInfo: {
              titolo_stagione: contenuto.stagione.titolo_stagione || undefined,
              numero_stagione: contenuto.stagione.numero_stagione,
            },
          }
        : {}),
    };

    const response: StreamingResponse = {
      success: true,
      data: streamingContent,
      statusCode: 200,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Errore nel recupero dello streaming:', error);

    const response: StreamingResponse = {
      success: false,
      error: 'Errore interno del server',
      statusCode: 500,
    };

    return NextResponse.json(response, { status: 500 });
  }
}
