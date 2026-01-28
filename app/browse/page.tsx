"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useProfiles } from "@/context/ProfileContext"; // Importa il context

import Navbar from "@/components/browse/Navbar";
import Hero from "@/components/browse/Hero";
import MovieRow from "@/components/browse/MovieRow";
import Profiles from "@/components/browse/Profiles";
import MovieDetailModal from "@/components/browse/MovieDetailModal";
import Footer from "@/components/browse/Footer";

const movies = [
    { id: "1", title: "KPop Demon Hunters", poster: "/images/movie1.jpg" },
    { id: "2", title: "SpongeBob", poster: "/images/movie2.jpg" },
    { id: "3", title: "Gumball", poster: "/images/movie3.jpg" },
    { id: "4", title: "Henry Danger", poster: "/images/movie4.jpg" },
    { id: "5", title: "PAW Patrol", poster: "/images/movie5.jpg" },
    { id: "6", title: "I Thunderman", poster: "/images/movie6.jpg" },
];

/**
 * Componente per il catalogo principale.
 * Gestisce la visualizzazione dei film e l'apertura del modal tramite URL.
 */
const BrowseContent = () => {
    const searchParams = useSearchParams();
    const selectedMovieId = searchParams.get("movie");

    return (
        <div className={`bg-[#141414] min-h-screen relative overflow-x-hidden ${selectedMovieId ? "h-screen overflow-hidden" : ""}`}>
            <div className={`transition-all duration-500 ${selectedMovieId ? "brightness-[0.2] scale-[0.98] blur-sm" : ""}`}>
                <Navbar />
                <Hero />
                <main className="p-6 md:p-12 space-y-12">
                    <MovieRow title="Popolari" movies={movies} />
                </main>
                <Footer/>
            </div>
            {selectedMovieId && <MovieDetailModal id={selectedMovieId} />}
        </div>
    );
}

export default function Home() {
    const { selectedProfile, isLoading } = useProfiles(); // Leggiamo dal Context

    if (isLoading) return <div className="bg-[#141414] h-screen" />;

    // Se non c'è un profilo selezionato nel Context, mostriamo la griglia di selezione
    if (!selectedProfile) {
        return <Profiles />;
    }

    // Se il profilo c'è, mostriamo il catalogo
    return (
        <Suspense fallback={<div className="bg-[#141414] h-screen" />}>
            <BrowseContent />
        </Suspense>
    );
}