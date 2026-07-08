"use client";

import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation"; // Aggiunto useSearchParams
import { useEffect, useState } from "react";
import Navbar from "@/components/browse/Navbar"; 
import { getAllMovies, getAllSeries, getMyListFromId } from "@/app/actions/media";
import MovieDetailModal from "@/components/browse/MovieDetailModal";
import { useProfiles } from "@/context/ProfileContext";

type ContentItem = {
    id: string;
    title: string;
    poster: string;
    vposter: string;
    type: string;
};

export default function CategoryPage() {
    const { selectedProfile, isLoading } = useProfiles();
    
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams(); // Estrazione parametri
    
    const category = params.category as string;
    const selectedId = searchParams.get("id");
    const selectedType = searchParams.get("type");
    
    const [content, setContent] = useState<ContentItem[]>([]);

    const getPageTitle = () => {
        switch (category) {
            case "series": return "Serie TV";
            case "movies": return "Film";
            case "my-list": return "La mia lista";
            default: return "Sfoglia";
        }
    };
    const pageTitle = getPageTitle();

    useEffect(() => {
        const fetchData = async () => {
            if (category === "series") {
                const data = await getAllSeries();
                setContent(data);
            } else if (category === "movies") {
                const data = await getAllMovies();
                setContent(data);
            } else if (category === "my-list") {
                const data = await getMyListFromId(selectedProfile?.id_profilo);
                setContent(data);
            }
        };

        fetchData();
    }, [category, selectedProfile?.id_profilo]);

    return (
        <div className="min-h-screen bg-[#141414]">
            <Navbar />
            
            <main className="pt-32 px-4 md:px-12 relative">
                <header className="mb-8">
                    <h1 className="text-white text-2xl md:text-3xl font-medium">
                        {pageTitle}
                    </h1>
                </header>

                {content.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {content.map((item) => (
                            <div 
                                key={item.id} 
                                onClick={() => router.push(`?id=${item.id}&type=${item.type}`, { scroll: false })}
                                className="relative aspect-video bg-zinc-800 rounded-md overflow-hidden hover:scale-105 transition duration-300 cursor-pointer"
                            >
                               <Image 
                                src={item.poster} 
                                alt={item.title} 
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-zinc-500 text-lg mt-20 text-center">
                        {category === "my-list" 
                            ? "Non hai ancora aggiunto nulla alla tua lista." 
                            : "Caricamento contenuti..."}
                    </div>
                )}
            </main>

            {/* Renderizza il modale solo se i parametri URL sono presenti */}
            {selectedId && selectedType && <MovieDetailModal />}
        </div>
    );
}