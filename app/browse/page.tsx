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

// 2. Estensione dell'interfaccia CarouselRow per il routing delle props al MediaRow
interface CarouselRow {
    id: string;
    title: string;
    items: MediaItem[];
    isTop10?: boolean;
    isContinueWatching?: boolean;
}

const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

const BrowseContent = ({ profileId }: { profileId: number }) => {
    const searchParams = useSearchParams();
    const selectedMediaId = searchParams.get("id");
    
    // Estrazione del profilo completo per accedere a nome_profilo
    const { selectedProfile } = useProfiles();

    const [mediaRows, setMediaRows] = useState<CarouselRow[]>([]);
    const [heroItem, setHeroItem] = useState<MediaItem | null>(null);
    const [isLoadingData, setIsLoadingData] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            setIsLoadingData(true);
            const data = await getBrowseData(profileId);
            if (!isMounted) return;

            // Selezione Hero
            const coinFlip = Math.random() < 0.5;
            const firstTopMovie = data.topMovies?.[0];
            const firstTopSeries = data.topSeries?.[0];
            let selectedHero = coinFlip ? firstTopMovie : firstTopSeries;
            if (!selectedHero) selectedHero = firstTopMovie || firstTopSeries;
            setHeroItem(selectedHero || null);

            // Definizione righe standard soggette a shuffle
            const structuredRows: CarouselRow[] = [
                { id: "my-list", title: "La mia lista", items: data.myList || [] },
                { id: "series", title: "Serie TV", items: data.series || [] },
                { id: "movies", title: "Film", items: data.movies || [] },
                { id: "top-10-movies", title: "Top 10 dei film in Italia oggi", items: data.topMovies || [], isTop10: true },
                { id: "top-10-series", title: "Top 10 delle serie TV in Italia oggi", items: data.topSeries || [], isTop10: true },
            ];

            // Filtraggio e shuffle delle righe generiche
            const validRows = structuredRows.filter((row) => row.items.length > 0);
            const finalRows = shuffleArray(validRows);

            // Iniezione forzata della riga "Continua a guardare" in posizione 0 (se sono presenti dati)
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
        <div
            className={`bg-[#141414] min-h-screen relative overflow-x-hidden ${
                selectedMediaId ? "h-screen overflow-hidden" : ""
            }`}
        >
            <div
                className={`transition-all duration-500 ${
                    selectedMediaId ? "brightness-[0.2] scale-[0.98] blur-sm" : ""
                }`}
            >
                <Navbar />
                {heroItem && <Hero item={heroItem} />}

                <main className="p-6 md:p-12 space-y-12">
                    {isLoadingData ? (
                        <div className="text-white text-center py-20">Caricamento catalogo...</div>
                    ) : (
                        mediaRows.map((row) => (
                            <MediaRow
                                key={row.id}
                                title={row.title}
                                items={row.items}
                                isTop10={row.isTop10} // Utilizzo del flag tipizzato nell'interfaccia
                                isContinueWatching={row.isContinueWatching} // Passaggio flag per la progress bar
                            />
                        ))
                    )}
                </main>
                <Footer />
            </div>

            {selectedMediaId && <MovieDetailModal />}
        </div>
    );
};

export default function Home() {
    const { selectedProfile, isLoading } = useProfiles();

    if (isLoading) return <div className="bg-[#141414] h-screen" />;

    if (!selectedProfile) {
        return <Profiles />;
    }

    return (
        <Suspense fallback={<div className="bg-[#141414] h-screen" />}>
            <BrowseContent profileId={selectedProfile.id_profilo} />
        </Suspense>
    );
}