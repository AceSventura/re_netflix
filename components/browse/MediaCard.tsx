"use client";

import Image from "next/image";
import Link from "next/link";
import { memo } from "react";

interface MediaCardData {
    id: string;
    title: string;
    poster: string;
    vposter?: string;
    type: string;
    progress?: number;
    resumeTime?: number;
}

interface MediaCardProps {
    item: MediaCardData;
    index: number;
    isTop10?: boolean;
    isContinueWatching?: boolean;
    hrefBase?: string;
    fluid?: boolean; // NUOVO: true = riempie il contenitore (per grid), false = larghezza fissa (per carosello)
}

function MediaCard({
    item,
    index,
    isTop10 = false,
    isContinueWatching = false,
    hrefBase = "",
    fluid = false,
}: MediaCardProps) {
    const top10ContainerClass =
        index === 9
            ? "w-[280px] md:w-[340px]"
            : "w-[190px] md:w-[240px]";

    // Se fluid, la card riempie il genitore (grid gestisce lei le dimensioni)
    const sizingClass = isTop10
        ? `${top10ContainerClass} h-45 md:h-55 justify-end`
        : fluid
        ? "w-full aspect-video"
        : "w-40 md:w-65 aspect-video";

    const shrinkClass = fluid ? "" : "shrink-0";

    return (
        <Link
            href={`${hrefBase}?id=${item.id}&type=${item.type}`}
            scroll={false}
            className={`relative ${shrinkClass} cursor-pointer transition-transform duration-300 hover:scale-105 hover:z-30 group flex items-end ${sizingClass}`}
        >
            {isTop10 ? (
                <>
                    <div className="absolute -left-5 md:-left-7.5 -bottom-3.75 md:-bottom-6.25 text-[200px] md:text-[260px] font-black text-black [-webkit-text-stroke:4px_#595959] leading-none z-0 tracking-[-0.08em] select-none pointer-events-none">
                        {index + 1}
                    </div>

                    <div className="relative w-30 md:w-35 h-full z-10 rounded-md overflow-hidden shadow-2xl">
                        <Image
                            src={item.vposter || item.poster}
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 120px, 140px"
                        />
                    </div>
                </>
            ) : (
                <div className="relative w-full h-full rounded-md overflow-hidden bg-zinc-800">
                    <Image
                        src={item.poster}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes={fluid ? "(max-width: 768px) 50vw, 16vw" : "(max-width: 768px) 160px, 260px"}
                    />

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
}

export default memo(MediaCard);
export type { MediaCardData };