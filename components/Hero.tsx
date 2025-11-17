"use client";

export default function Hero() {
    return (
        <section className="relative w-full h-[70vh] mb-12">
            {/* VIDEO BACKGROUND */}
            <video
                className="w-full h-full object-cover"
                src="/videos/hero.mp4"
                autoPlay
                muted
                loop
            />

            {/* OVERLAY OSCURANTE */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20"></div>

            {/* CONTENUTO TESTO */}
            <div className="absolute bottom-20 left-10 text-white max-w-xl">
                <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">
                    Il Prodotto di Punta
                </h1>
                <p className="text-lg mb-6 max-w-lg drop-shadow-md">
                    Descrizione epica del contenuto principale, proprio come Netflix che
                    mostra un trailer esclusivo per attirare l’utente.
                </p>

                <div className="flex gap-4">
                    <button className="bg-white text-black px-6 py-3 rounded-md font-semibold hover:bg-gray-300 transition">
                        ▶ Play
                    </button>

                    <button className="bg-gray-700/70 px-6 py-3 rounded-md font-semibold hover:bg-gray-600 transition">
                        ℹ More Info
                    </button>
                </div>
            </div>
        </section>
    );
}
