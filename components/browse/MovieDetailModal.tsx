"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Play, Plus, X, ThumbsUp, Volume2, Check } from "lucide-react";
import { useEffect, useState } from "react";

export default function MovieDetailModal({ id }: { id: string }) {
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(false);

    // Animazione di entrata
    useEffect(() => {
        setIsVisible(true);
        document.body.style.overflow = "hidden"; // Blocca lo scroll della pagina sotto
        return () => { document.body.style.overflow = "auto"; };
    }, []);

    const closeModal = () => {
        setIsVisible(false);
        setTimeout(() => router.push("/browse", { scroll: false }), 300);
    };

    // Dati estratti dal tuo HTML (mock)
    const movie = {
        title: "KPop Demon Hunters",
        description: "Un trio di amiche usa le proprie potenti voci per proteggere il mondo dai demoni in questo elegante mix di azione, commedia, romanticismo e canzoni K-pop orecchiabili.",
        year: 2025,
        maturity: "10+",
        duration: "1h 39min",
        cast: ["Arden Cho", "Ahn Hyo-seop", "Ken Jeong"],
        genres: ["Musica", "Film per famiglie", "Azione"],
        episodes: [
            { title: "KPop Demon Hunters", desc: "Le superstar del K-pop Rumi, Mira e Zoey usano i loro poteri segreti per proteggere i fan.", time: "1h 39m" },
            { title: "KPop Demon Hunters: Canta con noi", desc: "Edizione speciale karaoke del film di successo acclamato come fenomeno culturale.", time: "1h 35m" },
            { title: "Il camino di Gwi-Ma", desc: "Guarda le fiamme di Gwi-Ma danzare mentre la musica divampa nell'oscurità.", time: "1h 00m" }
        ]
    };

    return (
        <div className={`fixed inset-0 z-500 flex justify-center bg-black/70 overflow-y-auto transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}>
            {/* Backdrop cliccabile */}
            <div className="absolute inset-0" onClick={closeModal} />

            {/* Contenitore Dettaglio */}
            <div className={`relative bg-[#181818] w-[95%] max-w-[850px] h-fit my-8 rounded-xl overflow-hidden shadow-2xl transition-transform duration-300 ${isVisible ? "scale-100" : "scale-90"}`}>

                {/* 1. HEADER HERO */}
                <div className="relative aspect-video w-full bg-zinc-900">
                    <img
                        src="https://occ-0-2581-784.1.nflxso.net/dnm/api/v6/6AYY37jfdO6hpXcMjf9Yu5cnmO0/AAAABadE8Bq3QOWgiPE4OPFeXFVSvhSwAgYdqFzXqmIbrcuZkfJhCfYQ5rtt.jpg"
                        className="w-full h-full object-cover"
                        alt="Hero"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-[#181818] via-transparent to-transparent" />

                    <button onClick={closeModal} className="absolute top-4 right-4 p-2 bg-[#181818] rounded-full text-white hover:bg-white/20 transition">
                        <X size={24} />
                    </button>

                    <div className="absolute bottom-10 left-10 right-10">
                        <h2 className="text-4xl md:text-5xl font-black mb-6 uppercase italic tracking-tighter drop-shadow-lg">
                            {movie.title}
                        </h2>
                        <div className="flex items-center gap-3">
                            <Link href={`/watch/${id}`}>
                                <button className="flex items-center gap-2 bg-white text-black px-8 py-2.5 rounded shadow hover:bg-white/80 transition font-bold">
                                    <Play fill="black" size={20}/> Riproduci
                                </button>
                            </Link>
                            <button className="p-2 border-2 border-zinc-500 rounded-full text-white hover:border-white transition"><Plus size={22} /></button>
                            <button className="p-2 border-2 border-zinc-500 rounded-full text-white hover:border-white transition"><ThumbsUp size={20} /></button>
                            <div className="ml-auto"><Volume2 className="text-zinc-500 hover:text-white cursor-pointer" /></div>
                        </div>
                    </div>
                </div>

                {/* 2. GRIGLIA INFO */}
                <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-[1fr_250px] gap-12">
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-sm font-semibold">
                            <span className="text-green-500 font-bold text-lg">98% Compatibile</span>
                            <span className="text-zinc-400">{movie.year}</span>
                            <span className="border border-zinc-500 px-1.5 py-0.5 text-[12px] rounded-sm">{movie.maturity}</span>
                            <span className="text-zinc-400">{movie.duration}</span>
                            <span className="border border-zinc-600 px-1 text-[10px] rounded-sm">HD</span>
                        </div>
                        <p className="text-white text-xl leading-snug">
                            {movie.description}
                        </p>
                    </div>

                    <div className="text-[14px] space-y-4 leading-tight">
                        <p><span className="text-zinc-500">Cast:</span> <span className="text-zinc-200">{movie.cast.join(", ")}</span></p>
                        <p><span className="text-zinc-500">Generi:</span> <span className="text-zinc-200">{movie.genres.join(", ")}</span></p>
                        <p><span className="text-zinc-500">Caratteristiche:</span> <span className="text-zinc-200 italic font-light">Anche in versione karaoke</span></p>
                    </div>
                </div>

                {/* 3. LISTA EPISODI / COLLEZIONE */}
                <div className="px-8 md:px-12 pb-16">
                    <div className="flex justify-between items-center mb-8 border-b border-zinc-700 pb-4">
                        <h3 className="text-2xl font-bold">Episodi</h3>
                        <span className="text-zinc-400 text-sm italic">KPop Demon Hunters Collection</span>
                    </div>

                    <div className="flex flex-col">
                        {movie.episodes.map((ep, i) => (
                            <div key={i} className="flex items-center gap-6 p-6 rounded-lg hover:bg-[#2f2f2f] transition cursor-pointer group border-b border-zinc-800 last:border-0">
                                <span className="text-2xl font-bold text-zinc-500 w-4">{i + 1}</span>
                                <div className="w-36 md:w-44 aspect-video bg-zinc-800 rounded-md relative overflow-hidden shrink-0">
                                    <img src={`https://picsum.photos/seed/${i+40}/300/200`} className="w-full h-full object-cover" alt="" />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition">
                                        <Play size={30} className="text-white" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-lg leading-tight">{ep.title}</h4>
                                        <span className="text-zinc-400 font-semibold">{ep.time}</span>
                                    </div>
                                    <p className="text-sm text-zinc-400 line-clamp-2">
                                        {ep.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}