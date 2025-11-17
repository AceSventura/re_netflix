interface PageProps {
    params: { id: string };
}

export default function MovieDetailPage({ params }: PageProps) {
    const { id } = params;

    // Dati fittizi, in produzione fai fetch dall'API
    const movie = {
        title: "Esempio Film",
        description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Questo è un esempio di descrizione del film/serie.",
        trailer: "/trailer.mp4",
        episodes: ["Episodio 1", "Episodio 2", "Episodio 3"],
    };

    return (
        <main className="p-8 text-white">
            {/* Titolo */}
            <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>

            {/* Trailer */}
            <video
                controls
                className="w-full max-w-3xl rounded-md mb-4 bg-black"
            >
                <source src={movie.trailer} type="video/mp4" />
                Il tuo browser non supporta il video.
            </video>

            {/* Descrizione */}
            <p className="mb-6">{movie.description}</p>

            {/* Episodi */}
            <h2 className="text-2xl font-semibold mb-2">Episodi</h2>
            <ul className="list-disc pl-5 space-y-1 mb-6">
                {movie.episodes.map((ep, index) => (
                    <li key={index}>{ep}</li>
                ))}
            </ul>

            {/* Pulsante Guarda Ora */}
            <button className="px-6 py-2 bg-red-600 rounded font-bold hover:bg-red-700 transition">
                Guarda Ora
            </button>
        </main>
    );
}
