"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MediaItem {
    id: string;
    title: string;
    poster: string;
    vposter: string;
    type: string;
    progress?: number; // <-- Aggiunto
    resumeTime?: number; // <-- Aggiunto
}

interface MediaRowProps {
    title: string;
    items: MediaItem[];
    isTop10?: boolean;
    isContinueWatching?: boolean; // <-- Aggiunto
}

export default function MediaRow({ title, items, isTop10 = false, isContinueWatching = false }: MediaRowProps) {
    const rowRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScrollPosition = () => {
        if (rowRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(Math.ceil(scrollLeft) < scrollWidth - clientWidth - 1);
        }
    };

    useEffect(() => {
        checkScrollPosition();
        window.addEventListener("resize", checkScrollPosition);
        return () => window.removeEventListener("resize", checkScrollPosition);
    }, [items]);

    const scroll = (direction: "left" | "right") => {
        if (rowRef.current) {
            const { scrollLeft, clientWidth } = rowRef.current;
            const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            rowRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
        }
    };

    if (items.length === 0) return null; // Evita di renderizzare righe vuote

    return (
        <div className="space-y-4 group/row">
            <h2 className="text-xl md:text-2xl font-bold text-white pl-4 md:pl-12">
                {title}
            </h2>

            <div className="relative">
                {canScrollLeft && (
                    <button 
                        onClick={() => scroll("left")}
                        className="absolute left-0 top-0 bottom-0 z-40 w-12 bg-transparent opacity-0 group-hover/row:opacity-100 transition-opacity flex items-center justify-center text-white drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]"
                    >
                        <ChevronLeft size={40} />
                    </button>
                )}

                <div 
                    ref={rowRef}
                    onScroll={checkScrollPosition}
                    className={`flex gap-2 md:gap-4 overflow-x-auto overflow-y-hidden scroll-smooth px-4 md:px-12 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
                        isTop10 ? "py-10 md:py-16 items-center" : "py-4"
                    }`}
                >
                    {items.map((item, index) => {
                        if (isTop10 && index >= 10) return null;

                        const top10ContainerClass = index === 9 
                            ? "w-[280px] md:w-[340px]" 
                            : "w-[190px] md:w-[240px]";

                        return (
                            <Link 
                                href={`?id=${item.id}&type=${item.type}`} 
                                scroll={false} 
                                key={item.id}
                                className={`relative shrink-0 cursor-pointer transition-transform duration-300 hover:scale-105 hover:z-30 group flex items-end ${
                                    isTop10 
                                    ? `${top10ContainerClass} h-45 md:h-55 justify-end` 
                                    : "w-40 md:w-65 aspect-video"
                                }`}
                            >
                                {isTop10 && (
                                    <>
                                        <div className="absolute -left-5 md:-left-7.5 -bottom-3.75 md:-bottom-6.25 text-[200px] md:text-[260px] font-black text-black [-webkit-text-stroke:4px_#595959] leading-none z-0 tracking-[-0.08em] select-none pointer-events-none">
                                            {index + 1}
                                        </div>
                                        
                                        <div className="relative w-30 md:w-35 h-full z-10 rounded-md overflow-hidden shadow-2xl">
                                            <Image
                                                src={item.vposter}
                                                alt={item.title}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 120px, 140px"
                                            />
                                        </div>
                                    </>
                                )}

                                {!isTop10 && (
                                    <div className="relative w-full h-full rounded-md overflow-hidden bg-zinc-800">
                                        <Image
                                            src={item.poster}
                                            alt={item.title}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 160px, 260px"
                                        />
                                        
                                        {/* Rendering Barra di avanzamento */}
                                        {isContinueWatching && item.progress !== undefined && (
                                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-600/80">
                                                <div 
                                                    className="h-full bg-[#E50914]" 
                                                    style={{ width: `${Math.min(Math.max(item.progress, 0), 100)}%` }} 
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </div>

                {canScrollRight && (
                    <button 
                        onClick={() => scroll("right")}
                        className="absolute right-0 top-0 bottom-0 z-40 w-12 bg-transparent opacity-0 group-hover/row:opacity-100 transition-opacity flex items-center justify-center text-white drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]"
                    >
                        <ChevronRight size={40} />
                    </button>
                )}
            </div>
        </div>
    );
}