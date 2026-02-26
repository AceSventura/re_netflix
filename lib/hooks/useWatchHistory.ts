import { useEffect, useCallback } from 'react';

interface UseWatchHistoryOptions {
    contentId: string;
    profileId?: number;
    onTimeUpdate?: (time: number) => void;
}

export const useWatchHistory = ({
    contentId,
    profileId,
    onTimeUpdate
}: UseWatchHistoryOptions) => {
    // Salva la posizione di riproduzione ogni 10 secondi
    useEffect(() => {
        if (!profileId || !contentId) return;

        const interval = setInterval(async () => {
            try {
                const video = document.querySelector('video') as HTMLVideoElement;
                if (video) {
                    await fetch('/api/watch-history', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            idProfilo: profileId,
                            idContenuto: parseInt(contentId),
                            tempoGuardo: Math.floor(video.currentTime),
                            dataGuardo: new Date()
                        })
                    });
                }
            } catch (error) {
                console.error('Errore nel salvataggio della cronologia:', error);
            }
        }, 10000); // Salva ogni 10 secondi

        return () => clearInterval(interval);
    }, [profileId, contentId]);

    // Recupera il punto di ripresa precedente
    const fetchResumeTime = useCallback(async (): Promise<number | null> => {
        if (!profileId || !contentId) return null;

        try {
            const response = await fetch(
                `/api/watch-history?profileId=${profileId}&contentId=${contentId}`
            );

            if (!response.ok) return null;

            const data = await response.json();
            return data.data?.tempoGuardo ?? null;
        } catch (error) {
            console.error('Errore nel recupero della cronologia:', error);
            return null;
        }
    }, [contentId, profileId]);

    return { fetchResumeTime };
};
