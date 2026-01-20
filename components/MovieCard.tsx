import Link from "next/link";
import Image from "next/image";

interface MovieCardProps {
    id: string;
    title: string;
    poster: string;
}

export default function MovieCard({ id, title, poster }: MovieCardProps) {
    return (
        <Link href={`/movie/${id}`}>
            <div className="relative w-40 h-60 cursor-pointer transform transition-transform hover:scale-125">
                <Image
                    src={poster}
                    alt={title}
                    className="w-full h-full object-cover rounded-md"
                    fill
                />

                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-sm rounded-b-md">
                    {title}
                </div>
            </div>
        </Link>
    );
}
