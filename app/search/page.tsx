import { fetchSearchResults } from "@/app/actions/search";
import { FormattedMedia } from "@/types";
import Navbar from "@/components/browse/Navbar";
import MediaCard from "@/components/browse/MediaCard";

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const resolvedSearchParams = await searchParams;
    const query = resolvedSearchParams.q || "";

    const results: FormattedMedia[] = await fetchSearchResults(query);

    return (
        <div>
            <Navbar />

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
                        {results.map((item, index) => (
                            <MediaCard
                                key={`${item.type}-${item.id}`}
                                item={item}
                                index={index}
                                hrefBase="/browse"
                                fluid
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}