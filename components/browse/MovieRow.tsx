// components/MovieRow.tsx
import Link from "next/link";

interface Movie {
    id: string;
    title: string;
    poster: string;
}

export default function MovieRow({ title, movies }: { title: string, movies: Movie[] }) {
    return (
        <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-zinc-200 px-4">{title}</h2>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 pb-4">
                {movies.map((movie) => (
                    <Link
                        key={movie.id}
                        href={`?movie=${movie.id}`}
                        scroll={false} // Impedisce alla pagina di tornare in alto
                        className="relative min-w-[200px] md:min-w-[280px] aspect-video bg-zinc-800 rounded-md overflow-hidden transition-transform duration-300 hover:scale-110 hover:z-50 cursor-pointer"
                    >
                        <div className="w-full h-full bg-zinc-700 flex items-center justify-center text-xs italic">
                            {movie.title}
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}