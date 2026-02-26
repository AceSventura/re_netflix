import { NextRequest, NextResponse } from 'next/server';

interface WatchHistoryData {
    idProfilo: number;
    idContenuto: number;
    tempoGuardo: number; // in secondi
    dataGuardo: Date;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json() as WatchHistoryData;

        const { idProfilo, idContenuto, tempoGuardo } = body;

        if (!idProfilo || !idContenuto) {
            return NextResponse.json(
                { error: 'Dati mancanti' },
                { status: 400 }
            );
        }

        // TODO: Implementare la registrazione nel database Prisma
        // Esempio:
        // const watchRecord = await prisma.guarda.upsert({
        //     where: {
        //         id_profilo_id_contenuto: {
        //             id_profilo: idProfilo,
        //             id_contenuto: idContenuto,
        //         }
        //     },
        //     update: {
        //         tempo_guardo: tempoGuardo,
        //         data_guardo: new Date(),
        //     },
        //     create: {
        //         id_profilo: idProfilo,
        //         id_contenuto: idContenuto,
        //         tempo_guardo: tempoGuardo,
        //         data_guardo: new Date(),
        //     }
        // });

        return NextResponse.json({
            success: true,
            message: 'Cronologia di visualizzazione aggiornata'
        });
    } catch (error) {
        console.error('Errore nel salvataggio della cronologia:', error);
        return NextResponse.json(
            { error: 'Errore interno del server' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const profileId = request.nextUrl.searchParams.get('profileId');
        const contentId = request.nextUrl.searchParams.get('contentId');

        if (!profileId || !contentId) {
            return NextResponse.json(
                { error: 'Parametri mancanti' },
                { status: 400 }
            );
        }

        // TODO: Implementare il recupero della cronologia dal database
        // Esempio:
        // const watchRecord = await prisma.guarda.findUnique({
        //     where: {
        //         id_profilo_id_contenuto: {
        //             id_profilo: parseInt(profileId),
        //             id_contenuto: parseInt(contentId),
        //         }
        //     }
        // });

        return NextResponse.json({
            success: true,
            data: {
                tempoGuardo: 0, // Mock
            }
        });
    } catch (error) {
        console.error('Errore nel recupero della cronologia:', error);
        return NextResponse.json(
            { error: 'Errore interno del server' },
            { status: 500 }
        );
    }
}
