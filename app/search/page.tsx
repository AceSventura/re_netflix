import { fetchSearchResults, type SearchResult } from "@/app/actions/search";
import Navbar from "@/components/browse/Navbar";
import Image from "next/image";
import Link from "next/link";
export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const resolvedSearchParams = await searchParams;
    const query = resolvedSearchParams.q || "";
    
    const results: SearchResult[] = await fetchSearchResults(query);

    return (
        <div>
            <Navbar/>
          
            <main className="min-h-screen bg-[#141414] pt-24 px-4 md:px-12 text-white">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-zinc-400">
                        Risultati di ricerca per: <span className="text-white">&quot;{query}&quot;</span>
                    </h1>
                </div>

                {results.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-lg text-zinc-500">Nessun contenuto trovato per questa ricerca.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {results.map((item) => (
                            <Link 
                                // RISOLUZIONE BUG: Chiave composita univoca
                                key={`${item.tipo}-${item.id}`} 
                                href={`/browse?id=${item.id}&type=${item.tipo}`}
                                className="relative aspect-video bg-zinc-800 rounded-md overflow-hidden hover:scale-105 transition duration-300 cursor-pointer group"
                            >
                                <Image
                                    src={item.poster || "/placeholder.jpg"} 
                                    alt={item.titolo || "Titolo assente"}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
                                    <span className="text-sm font-medium">{item.titolo}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}