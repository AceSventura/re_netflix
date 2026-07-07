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

import { getBrowseData } from "@/app/actions/media";

interface MediaItem {
    id: string;
    title: string;
    description?: string;
    poster: string;
    vposter: string;
    type: string;
}

interface CarouselRow {
    id: string;
    title: string;
    items: MediaItem[];
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

    const [mediaRows, setMediaRows] = useState<CarouselRow[]>([]);
    const [heroItem, setHeroItem] = useState<MediaItem | null>(null);
    const [isLoadingData, setIsLoadingData] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            setIsLoadingData(true);
            const data = await getBrowseData(profileId);
            if (!isMounted) return;

            const coinFlip = Math.random() < 0.5;
            const firstTopMovie = data.topMovies?.[0];
            const firstTopSeries = data.topSeries?.[0];
            let selectedHero = coinFlip ? firstTopMovie : firstTopSeries;
            if (!selectedHero) selectedHero = firstTopMovie || firstTopSeries;
            setHeroItem(selectedHero || null);

            const structuredRows: CarouselRow[] = [
                { id: "my-list", title: "La mia lista", items: data.myList || [] },
                { id: "series", title: "Serie TV", items: data.series || [] },
                { id: "movies", title: "Film", items: data.movies || [] },
                { id: "top-10-movies", title: "Top 10 dei film in Italia oggi", items: data.topMovies || [] },
                { id: "top-10-series", title: "Top 10 delle serie TV in Italia oggi", items: data.topSeries || [] },
            ];

            const validRows = structuredRows.filter((row) => row.items.length > 0);
            setMediaRows(shuffleArray(validRows));
            setIsLoadingData(false);
        };

        fetchData();
        return () => {
            isMounted = false;
        };
    }, [profileId]);

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
                                isTop10={row.id.includes("top-10")}
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