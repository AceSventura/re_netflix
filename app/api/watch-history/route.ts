import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


interface WatchHistoryData {
    idProfilo: number;
    idContenuto: number;
    tempoGuardo: number; // in secondi
    dataGuardo: Date;
}

const toCompletionState = (completed?: boolean | number) => {
    if (typeof completed === 'number') {
        return completed > 0 ? 1 : 0;
    }

    return completed ? 1 : 0;
};

export async function POST(request: NextRequest) {
    try {
        const body = await request.json() as WatchHistoryData;

        const { idProfilo, idContenuto, tempoGuardo } = body;

        if (!idProfilo || !idContenuto || tempoGuardo === undefined) {
            return NextResponse.json(
                { error: 'Dati mancanti' },
                { status: 400 }
            );
        }

        const watchRecord = await prisma.guarda.upsert({
            where: {
                id_contenuto_id_profilo: {
                    id_contenuto: idContenuto,
                    id_profilo: idProfilo,
                },
            },
            update: {
                durata_visualizzata: tempoGuardo,
                stato_completamento: toCompletionState(false),
            },
            create: {
                id_contenuto: idContenuto,
                id_profilo: idProfilo,
                durata_visualizzata: tempoGuardo,
                stato_completamento: toCompletionState(false),
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Cronologia di visualizzazione aggiornata',
            data: watchRecord,
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

        const watchRecord = await prisma.guarda.findUnique({
            where: {
                id_contenuto_id_profilo: {
                    id_profilo: parseInt(profileId),
                    id_contenuto: parseInt(contentId),
                },
            },
        });

        return NextResponse.json({
            success: true,
            data: {
                tempoGuardo: watchRecord?.durata_visualizzata ?? 0,
            },
        });
    } catch (error) {
        console.error('Errore nel recupero della cronologia:', error);
        return NextResponse.json(
            { error: 'Errore interno del server' },
            { status: 500 }
        );
    }
}
