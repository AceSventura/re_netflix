import { Play, Plus, ThumbsUp, X } from "lucide-react";
import Link from "next/link";
import React from "react";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function MovieDetailPage({ params }: PageProps) {
    const [id, setId] = React.useState<string>('');

    React.useEffect(() => {
        const unwrapParams = async () => {
            const { id: contentId } = await params;
            setId(contentId);
        };
        unwrapParams();
    }, [params]);

    // Dati estratti dall'HTML di KPop Demon Hunters
    const movie = {
        title: "KPop Demon Hunters",
        logoUrl: "/path-to-kpop-logo.png", // Immagine del titolo
        heroImage: "https://occ-0-2581-784.1.nflxso.net/dnm/api/v6/6AYY37jfdO6hpXcMjf9Yu5cnmO0/AAAABadE8Bq3QOWgiPE4OPFeXFVSvhSwAgYdqFzXqmIbrcuZkfJhCfYQ5rtt.jpg",
        year: 2025,
        maturity: "10+",
        duration: "1h 39min",
        description: "Un trio di amiche usa le proprie potenti voci per proteggere il mondo dai demoni in questo elegante mix di azione, commedia, romanticismo e canzoni K-pop orecchiabili.",
        cast: ["Arden Cho", "Ahn Hyo-seop", "Ken Jeong"],
        genres: ["Musica", "Film per famiglie", "Azione"],
        features: ["Anche in versione karaoke", "Audiodescrizione"],
        // Simulazione della "Collezione" o Episodi trovati nell'HTML
        collection: [
            {
                id: "81498621",
                title: "KPop Demon Hunters",
                duration: "1h 39min",
                thumbnail: "/thumb-main.jpg",
                synopsis: "Le superstar del K-pop Rumi, Mira e Zoey usano i loro poteri segreti..."
            },
            {
                id: "82125877",
                title: "KPop Demon Hunters: Canta con noi",
                duration: "1h 35min",
                thumbnail: "/thumb-karaoke.jpg",
                synopsis: "Canta le tue canzoni preferite e aiuta a chiudere l'Honmoon."
            },
            {
                id: "82154641",
                title: "KPop Demon Hunters: Il camino",
                duration: "1h",
                thumbnail: "/thumb-fireplace.jpg",
                synopsis: "Guarda le fiamme di Gwi-Ma danzare mentre la musica divampa."
            }
        ]
    };

    return (
        <div className="min-h-screen bg-[#141414] text-white font-sans">
            {/* --- 1. SEZIONE HERO --- */}
            <section className="relative w-full aspect-video md:h-[70vh]">
                <div className="absolute inset-0">
                    <img
                        src={movie.heroImage}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                    />
                    {/* Overlay gradiente nero tipico di Netflix */}
                    <div className="absolute inset-0 bg-linear-to-t from-[#141414] via-transparent to-black/30" />
                </div>

                <div className="absolute bottom-10 left-8 md:left-16 w-full max-w-xl p-4">
                    {/* Invece di H1, Netflix usa spesso il logo in PNG */}
                    <h1 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tighter">
                        {movie.title}
                    </h1>

                    <div className="flex gap-3 mb-6">
                        <Link href={`/watch/${id}`}>
                            <button className="flex items-center gap-2 px-8 py-2 bg-white text-black rounded font-bold hover:bg-white/80 transition">
                                <Play fill="black" /> Riproduci
                            </button>
                        </Link>
                        <button className="flex items-center justify-center w-10 h-10 bg-[#2a2a2a]/60 border-2 border-gray-400 rounded-full hover:border-white transition">
                            <Plus />
                        </button>
                        <button className="flex items-center justify-center w-10 h-10 bg-[#2a2a2a]/60 border-2 border-gray-400 rounded-full hover:border-white transition">
                            <ThumbsUp size={20} />
                        </button>
                    </div>
                </div>
            </section>

            {/* --- 2. GRIGLIA INFO --- */}
            <section className="px-8 md:px-16 py-10 grid grid-cols-1 md:grid-cols-12 gap-10">
                {/* Colonna Sinistra: Sinossi e Metadati */}
                <div className="md:col-span-8 space-y-6">
                    <div className="flex items-center gap-2 text-lg">
                        <span className="text-green-400 font-bold">98% compatibile</span>
                        <span>{movie.year}</span>
                        <span className="border border-gray-500 px-1.5 text-sm uppercase">{movie.maturity}</span>
                        <span>{movie.duration}</span>
                        <span className="border border-gray-500 px-1 text-[10px] rounded-sm">HD</span>
                    </div>

                    <p className="text-xl leading-snug max-w-3xl">
                        {movie.description}
                    </p>
                </div>

                {/* Colonna Destra: Cast e Generi */}
                <div className="md:col-span-4 text-sm space-y-4">
                    <p><span className="text-gray-500">Cast:</span> {movie.cast.join(", ")}</p>
                    <p><span className="text-gray-500">Generi:</span> {movie.genres.join(", ")}</p>
                    <p><span className="text-gray-500">Caratteristiche:</span> {movie.features.join(", ")}</p>
                </div>
            </section>

            {/* --- 3. SEZIONE EPISODI / COLLEZIONE --- */}
            <section className="px-8 md:px-16 py-10">
                <div className="flex justify-between items-end mb-6">
                    <h2 className="text-2xl font-bold">Contenuti della collezione</h2>
                    <span className="text-gray-400 text-sm">Serie originale Netflix</span>
                </div>

                <div className="flex flex-col gap-1">
                    {movie.collection.map((item, index) => (
                        <div
                            key={item.id}
                            className="group flex flex-col md:flex-row items-center gap-6 p-6 rounded-md bg-transparent hover:bg-[#2f2f2f] transition cursor-pointer border-b border-gray-800"
                        >
                            <div className="text-2xl font-bold text-gray-500 min-w-[20px]">
                                {index + 1}
                            </div>

                            <div className="relative w-40 aspect-video shrink-0 overflow-hidden rounded">
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition">
                                    <Play fill="white" />
                                </div>
                                <div className="w-full h-full bg-gray-700" /> {/* Placeholder per thumbnail */}
                            </div>

                            <div className="flex-1">
                                <div className="flex justify-between mb-2">
                                    <h3 className="font-bold text-lg">{item.title}</h3>
                                    <span className="text-gray-400">{item.duration}</span>
                                </div>
                                <p className="text-sm text-gray-400 line-clamp-3">
                                    {item.synopsis}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}