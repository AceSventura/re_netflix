"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Cookies from 'js-cookie';

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import MovieRow from "@/components/MovieRow";
import Profiles from "@/components/Profiles";
import MovieDetailModal from "@/components/MovieDetailModal";

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
function BrowseContent({ selectedProfile }: { selectedProfile: string }) {
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
            </div>
            {selectedMovieId && <MovieDetailModal id={selectedMovieId} />}
        </div>
    );
}

export default function Home() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const auth = Cookies.get('isLoggedIn');
        if (!auth) {
            router.push('/login');
        } else {
            setIsAuthenticated(true);
        }
    }, [router]);

    // Mentre controlla l'autenticazione, mostriamo uno sfondo nero
    if (isAuthenticated === null) return <div className="bg-[#141414] h-screen" />;

    // Se loggato ma non ha scelto il profilo
    if (!selectedProfile) {
        return <Profiles onSelect={(name) => setSelectedProfile(name)} />;
    }

    return (
        <Suspense fallback={<div className="bg-[#141414] h-screen" />}>
            <BrowseContent selectedProfile={selectedProfile} />
        </Suspense>
    );
}