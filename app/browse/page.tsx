"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useProfiles } from "@/context/ProfileContext";

import Navbar from "@/components/browse/Navbar";
import Hero from "@/components/browse/Hero";
import MediaRow from "@/components/browse/MediaRow";
import Profiles from "@/components/browse/Profiles";
import MovieDetailModal from "@/components/browse/MovieDetailModal";
import Footer from "@/components/browse/Footer";

// Importa la Server Action appena creata
import { getBrowseData } from "@/app/actions/media"; 

// Interfaccia per la tipizzazione dello stato
interface MediaItem {
    id: string;
    title: string;
    poster: string;
    type: string;
}

const BrowseContent = () => {
    const searchParams = useSearchParams();
    
    // 1. Modifica: Ora leggiamo "id" invece di "movie"
    const selectedMediaId = searchParams.get("id");

    const [media, setMedia] = useState<{ series: MediaItem[]; movies: MediaItem[] }>({
        series: [],
        movies: []
    });
    const [isLoadingData, setIsLoadingData] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getBrowseData();
            setMedia(data);
            setIsLoadingData(false);
        };
        fetchData(); 
    }, []);

    return (
        // 2. Modifica: Aggiornate le variabili di stato (selectedMediaId)
        <div className={`bg-[#141414] min-h-screen relative overflow-x-hidden ${selectedMediaId ? "h-screen overflow-hidden" : ""}`}>
            <div className={`transition-all duration-500 ${selectedMediaId ? "brightness-[0.2] scale-[0.98] blur-sm" : ""}`}>
                <Navbar />
                <Hero />
                <main className="p-6 md:p-12 space-y-12">
                    {isLoadingData ? (
                        <div className="text-white text-center py-20">Caricamento catalogo...</div>
                    ) : (
                        <>
                            <MediaRow title="Serie TV" items={media.series} />
                            <MediaRow title="Film" items={media.movies} />
                        </>
                    )}
                </main>
                <Footer/>
            </div>
            
            {/* 3. Modifica: Rimosso il passaggio della prop id, il modale legge l'URL da solo */}
            {selectedMediaId && <MovieDetailModal id={selectedMediaId} />}
        </div>
    );
}

export default function Home() {
    const { selectedProfile, isLoading } = useProfiles();

    if (isLoading) return <div className="bg-[#141414] h-screen" />;

    if (!selectedProfile) {
        return <Profiles />;
    }

    return (
        <Suspense fallback={<div className="bg-[#141414] h-screen" />}>
            <BrowseContent />
        </Suspense>
    );
}