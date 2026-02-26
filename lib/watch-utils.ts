/**
 * GUIDA: Come integrare il bottone "Riproduci" dalla pagina di dettaglio al watch
 * 
 * Nella pagina /app/movie/[id]/page.tsx, il bottone "Riproduci" dovrebbe:
 * 1. Reindirizzare a /watch/[id]
 * 2. Opzionalmente passare informazioni di contexto via query params
 */

// ESEMPIO DI IMPLEMENTAZIONE NEL BOTTONE PLAY:
// 
// <Link href={`/watch/${movie.id}?from=movie&trackId=14190394&tctx=..`}>
//   <button className="flex items-center gap-2 px-8 py-2 bg-white text-black rounded font-bold hover:bg-white/80 transition">
//     <Play fill="black" /> Riproduci
//   </button>
// </Link>

// GESTIONE DEI PARAMETRI NELLA PAGINA /watch:
// 
// ```typescript
// const searchParams = useSearchParams();
// const from = searchParams.get('from'); // 'movie' | 'series' | 'browse'
// const trackId = searchParams.get('trackId');
// const tctx = searchParams.get('tctx');
// 
// // Usa questi parametri per analytics/tracking
// ```

export interface PlaybackSource {
    from: 'movie' | 'series' | 'browse' | 'mylist' | 'search';
    trackId?: string;
    tctx?: string;
    timestamp?: number;
}

export const getWatchUrl = (
    contentId: string,
    source: PlaybackSource
): string => {
    const url = new URL(`/watch/${contentId}`, typeof window !== 'undefined' ? window.location.origin : '');
    
    if (source.from) url.searchParams.set('from', source.from);
    if (source.trackId) url.searchParams.set('trackId', source.trackId);
    if (source.tctx) url.searchParams.set('tctx', source.tctx);
    if (source.timestamp) url.searchParams.set('t', source.timestamp.toString());
    
    return url.pathname + url.search;
};
