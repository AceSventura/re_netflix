"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MediaCard, { type MediaCardData } from "./MediaCard";

interface MediaRowProps {
    title: string;
    items: MediaCardData[];
    isTop10?: boolean;
    isContinueWatching?: boolean;
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

    if (items.length === 0) return null;

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

                        return (
                            <MediaCard
                                key={`${item.type}-${item.id}-${index}`}
                                item={item}
                                index={index}
                                isTop10={isTop10}
                                isContinueWatching={isContinueWatching}
                            />
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