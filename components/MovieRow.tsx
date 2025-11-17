"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MovieCard from "@/components/MovieCard";

interface Movie {
    id: string;
    title: string;
    poster: string;
}

interface MovieRowProps {
    title: string;
    movies: Movie[];
}

export default function MovieRow({ title, movies }: MovieRowProps) {
    const rowRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (!rowRef.current) return;

        const amount = 300; // quanto scorre a ogni click
        const newPosition =
            direction === "left"
                ? rowRef.current.scrollLeft - amount
                : rowRef.current.scrollLeft + amount;

        rowRef.current.scrollTo({
            left: newPosition,
            behavior: "smooth",
        });
    };

    return (
        <section className="relative mb-8">
            <h2 className="text-white text-xl font-semibold mb-2">{title}</h2>

            {/* Freccia sinistra */}
            <button
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 bg-black/40 p-2 rounded-full hover:bg-black/70 transition-opacity"
            >
                <ChevronLeft className="text-white" />
            </button>

            {/* Container scorrevole */}
            <div
                ref={rowRef}
                className="flex gap-4 overflow-x-scroll scroll-smooth scrollbar-hide py-2 px-8"
            >
                {movies.map((movie) => (
                    <MovieCard
                        key={movie.id}
                        id={movie.id}
                        title={movie.title}
                        poster={movie.poster}
                    />
                ))}
            </div>

            {/* Freccia destra */}
            <button
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 bg-black/40 p-2 rounded-full hover:bg-black/70 transition-opacity"
            >
                <ChevronRight className="text-white" />
            </button>
        </section>
    );
}
