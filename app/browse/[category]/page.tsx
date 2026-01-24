"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/browse/Navbar"; 

export default function CategoryPage() {
    const params = useParams();
    const category = params.category; // Recupera "series", "movies" o "my-list" dalla barra degli indirizzi

    const [content, setContent] = useState([]);
    const [pageTitle, setPageTitle] = useState("");

    useEffect(() => {
        // Logica per decidere cosa mostrare
        switch (category) {
            case "series":
                setPageTitle("Serie TV");
                // fetchSeries().then(data => setContent(data));
                break;
            case "movies":
                setPageTitle("Film");
                // fetchMovies().then(data => setContent(data));
                break;
            case "my-list":
                setPageTitle("La mia lista");
                // Recupero i dati dal localStorage
                const savedList = JSON.parse(localStorage.getItem("my_netflix_list") || "[]");
                setContent(savedList);
                break;
            default:
                setPageTitle("Sfoglia");
        }
    }, [category]);

    return (
        <div className="min-h-screen bg-[#141414]">
            <Navbar />
            
            <main className="pt-32 px-4 md:px-12">
                <header className="mb-8">
                    <h1 className="text-white text-2xl md:text-3xl font-medium">
                        {pageTitle}
                    </h1>
                </header>

                {/* Griglia dei contenuti */}
                {content.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {content.map((item) => (
                            <div key={item.id} className="relative aspect-video bg-zinc-800 rounded-md overflow-hidden hover:scale-105 transition duration-300 cursor-pointer">
                                <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
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
        </div>
    );
}