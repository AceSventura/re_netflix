import Link from "next/link";
import Image from "next/image";

interface MediaItem {
    id: string;
    title: string;
    type: string;
    poster: string;
}

export default function MediaRow({ title, items }: { title: string, items: MediaItem[] }) {
    return (
        <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-zinc-200 px-4">{title}</h2>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 pb-4">
                {items.map((item) => (
                    <Link
                        key={item.id}
                        // Sostituito ?movie= con ?id= per coerenza con il modale
                        href={`?id=${item.id}&type=${item.type}`}
                        scroll={false}
                        className="relative min-w-[200px] md:min-w-[280px] aspect-video bg-zinc-800 rounded-md overflow-hidden transition-transform duration-300 hover:scale-110 hover:z-50 cursor-pointer"
                    >
                        <Image 
                            src={item.poster} 
                            alt={`Copertina di ${item.title}`}
                            className="object-cover"
                            fill
                        />
                        
                        <div className="absolute inset-0 bg-black/40 flex items-end p-2 opacity-0 hover:opacity-100 transition-opacity duration-300">
                            <span className="text-white text-xs font-semibold shadow-black drop-shadow-md">
                                {item.title}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}