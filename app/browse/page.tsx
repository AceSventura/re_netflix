"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useProfiles } from "@/context/ProfileContext";

import Navbar from "@/components/browse/Navbar";
import Hero from "@/components/browse/Hero";
import MediaRow from "@/components/browse/MediaRow";
import Profiles from "@/components/browse/ProfileSelection";
import MovieDetailModal from "@/components/browse/MovieDetailModal";
import Footer from "@/components/browse/Footer";
import { MediaItem } from "@/types";

import { getBrowseData } from "@/app/actions/media";

// Definizione del tipo di dato per una singola riga del catalogo.
// Estende MediaItem raggruppando gli elementi per categoria e definendo flag per il rendering UI.
interface CarouselRow {
    id: string;
    title: string;
    items: MediaItem[];
    isTop10?: boolean;
    isContinueWatching?: boolean;
}

// Algoritmo di Fisher-Yates per la randomizzazione dell'array.
// Garantisce una distribuzione probabilistica uniforme degli elementi, operando su una copia per non mutare l'array originale.
const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

const BrowseContent = ({ profileId }: { profileId: number }) => {
    // Gestione dei parametri URL per l'apertura del modale di dettaglio senza alterare il routing.
    const searchParams = useSearchParams();
    const selectedMediaId = searchParams.get("id");
    
    // Estrazione del profilo contestuale per l'interfaccia personalizzata (es. nome_profilo).
    const { selectedProfile } = useProfiles();

    // Stati locali per la gestione asincrona del catalogo e dell'elemento in evidenza.
    const [mediaRows, setMediaRows] = useState<CarouselRow[]>([]);
    const [heroItem, setHeroItem] = useState<MediaItem | null>(null);
    const [isLoadingData, setIsLoadingData] = useState(true);

    // Effetto per il recupero dati al montaggio del componente o al cambio del profilo.
    useEffect(() => {
        // Flag per prevenire state updates su componenti smontati (memory leak prevention).
        let isMounted = true;

        const fetchData = async () => {
            setIsLoadingData(true);
            const data = await getBrowseData(profileId);
            if (!isMounted) return;

            // Logica di selezione Hero: alternanza al 50% tra il contenuto Top Movie e Top Series.
            const coinFlip = Math.random() < 0.5;
            const firstTopMovie = data.topMovies?.[0];
            const firstTopSeries = data.topSeries?.[0];
            let selectedHero = coinFlip ? firstTopMovie : firstTopSeries;
            if (!selectedHero) selectedHero = firstTopMovie || firstTopSeries;
            setHeroItem(selectedHero || null);

            // Mappatura strutturale dei dati grezzi ricevuti dall'API in configurazioni per le righe (CarouselRow).
            const structuredRows: CarouselRow[] = [
                { id: "my-list", title: "La mia lista", items: data.myList || [] },
                { id: "series", title: "Serie TV", items: data.series || [] },
                { id: "movies", title: "Film", items: data.movies || [] },
                { id: "top-10-movies", title: "Top 10 dei film in Italia oggi", items: data.topMovies || [], isTop10: true },
                { id: "top-10-series", title: "Top 10 delle serie TV in Italia oggi", items: data.topSeries || [], isTop10: true },
            ];

            // Pipeline di trasformazione:
            // 1. Rimozione delle righe vuote.
            // 2. Randomizzazione dell'ordine delle righe rimanenti.
            const validRows = structuredRows.filter((row) => row.items.length > 0);
            const finalRows = shuffleArray(validRows);

            // Iniezione condizionale della riga "Continua a guardare" in cima all'array (indice 0),
            // in modo che non subisca il processo di shuffle e rimanga la prima visualizzata.
            if (data.continueWatching && data.continueWatching.length > 0) {
                finalRows.unshift({
                    id: "continue-watching",
                    title: `${selectedProfile?.nome_profilo}, continua a guardare:`,
                    items: data.continueWatching,
                    isContinueWatching: true
                });
            }

            setMediaRows(finalRows);
            setIsLoadingData(false);
        };

        fetchData();
        return () => {
            isMounted = false;
        };
    }, [profileId, selectedProfile]);

    return (
        <div className="bg-[#141414] min-h-screen relative overflow-x-hidden">
            <div
                // Applicazione di effetti visivi (scurimento, scala ridotta e sfocatura) 
                // sullo sfondo quando un ID media è presente nei parametri di ricerca.
                className={`transition-all duration-500 ${
                    selectedMediaId ? "brightness-[0.2] scale-[0.98] blur-sm" : ""
                }`}
            >
                <Navbar />
                {heroItem && <Hero item={heroItem} />}

                <main className="p-6 md:p-12 space-y-12">
                    {/* Rendering condizionale: loader durante la fetch, mappatura righe ad operazione conclusa. */}
                    {isLoadingData ? (
                        <div className="text-white text-center py-20">Caricamento catalogo...</div>
                    ) : (
                        mediaRows.map((row) => (
                            <MediaRow
                                key={row.id}
                                title={row.title}
                                items={row.items}
                                isTop10={row.isTop10}
                                isContinueWatching={row.isContinueWatching}
                            />
                        ))
                    )}
                </main>
                <Footer />
            </div>

            {/* Rendering del modale condizionato dalla presenza del parametro 'id' nell'URL. */}
            {selectedMediaId && <MovieDetailModal />}
        </div>
    );
};

export default function Home() {
    const { selectedProfile, isLoading } = useProfiles();

    // Gestione dello stato di caricamento del contesto globale.
    if (isLoading) return <div className="bg-[#141414] h-screen" />;

    // Gate di sicurezza: reindirizzamento al componente di selezione profilo se nessuno è selezionato.
    if (!selectedProfile) {
        return <Profiles />;
    }

    // Boundary di sospensione obbligatorio in Next.js 13+ quando i componenti figli 
    // utilizzano useSearchParams() client-side.
    return (
        <Suspense fallback={<div className="bg-[#141414] h-screen" />}>
            <BrowseContent profileId={selectedProfile.id_profilo} />
        </Suspense>
    );
}