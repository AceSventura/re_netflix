import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numericId = parseInt(id, 10);

    // Cerca il contenuto e verifica se è legato a una stagione
    const contenuto = await prisma.contenuti.findUnique({
      where: { id_contenuto: numericId },
      include: {
        codificato: { include: { assets_video: true } },
        stagioni: { // Risale alla stagione per capire se è una serie
          include: {
            serie_tv: {
              include: {
                stagioni: { // Scende di nuovo per prendere tutti gli episodi della serie
                  orderBy: { numero_stagione: 'asc' },
                  include: {
                    contenuti: {
                      orderBy: { id_contenuto: 'asc' },
                      include: { codificato: { include: { assets_video: true } } }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!contenuto) {
      return NextResponse.json({ success: false, error: 'Contenuto non trovato' }, { status: 404 });
    }

    const videoUrl = contenuto.codificato[0]?.assets_video?.url_manifest;
    const isSerie = contenuto.id_stagione !== null;

    const payload: any = {
      id: contenuto.id_contenuto.toString(),
      titolo: contenuto.titolo_contenuto,
      descrizione: contenuto.descrizione,
      tipo: isSerie ? 'serie_tv' : 'film',
      streaming: { videoUrl: videoUrl || null }
    };

    // Se è un episodio, costruiamo l'array della barra laterale
    if (isSerie && contenuto.stagioni?.serie_tv) {
      const serie = contenuto.stagioni.serie_tv;
      payload.titoloSerie = serie.titolo_serie_tv;
      payload.stagioneCorrente = contenuto.stagioni.numero_stagione;
      
      payload.episodi = serie.stagioni.flatMap(stagione => 
        stagione.contenuti.map((ep, index) => ({
          id: ep.id_contenuto.toString(),
          title: ep.titolo_contenuto,
          description: ep.descrizione,
          videoUrl: ep.codificato[0]?.assets_video?.url_manifest || null,
          episodeNumber: index + 1,
          seasonNumber: stagione.numero_stagione,
          isCurrent: ep.id_contenuto === numericId
        }))
      );
    }

    return NextResponse.json({ success: true, data: payload });

  } catch (error) {
    console.error('Errore API Watch:', error);
    return NextResponse.json({ success: false, error: 'Errore server' }, { status: 500 });
  }
}