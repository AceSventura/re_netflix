"use client";

import Link from "next/link";

interface HeroProps {
    item: {
        id: string;
        title: string;
        description?: string;
        poster: string;
        type: string;
    };
}

export default function Hero({ item }: HeroProps) {
    return (
        <section className="relative w-full h-[70vh] mb-12">
            {/* VIDEO BACKGROUND */}
            {/* Attualmente statico. Per renderlo dinamico servirà una colonna url_trailer nel DB */}
            <video
                className="w-full h-full object-cover"
                src="/videos/hero.mp4"
                autoPlay
                muted
                loop
            />

            {/* OVERLAY OSCURANTE */}
            <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-black/20"></div>

            {/* CONTENUTO TESTO */}
            <div className="absolute bottom-20 left-10 text-white max-w-xl z-10">
                <h1 className="text-5xl font-bold mb-4 drop-shadow-lg uppercase tracking-tight">
                    {item.title}
                </h1>
                
                {/* Aggiunto line-clamp-3 per evitare overflow del testo in descrizioni troppo lunghe */}
                <p className="text-lg mb-6 max-w-lg drop-shadow-md line-clamp-3">
                    {item.description}
                </p>

                <div className="flex gap-4">
                    <Link href={`/watch/${item.id}`}>
                        <button className="bg-white text-black px-6 py-3 rounded-md font-semibold hover:bg-gray-300 transition">
                            ▶ Play
                        </button>
                    </Link>

                    {/* Sostituito il button con un Link per gestire i parametri URL del modale */}
                    <Link href={`?id=${item.id}&type=${item.type}`} scroll={false}>
                        <button className="bg-gray-700/70 text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-600 transition">
                            ℹ More Info
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
}