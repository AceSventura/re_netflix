"use client";

import { useEffect, useState } from "react";
import { Bebas_Neue } from "next/font/google";
import Link from "next/link";
import { Search, Bell, ChevronDown } from "lucide-react";

const bebas = Bebas_Neue({
    subsets: ["latin"],
    weight: "400",
});

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);

    // Cambia lo sfondo da trasparente a nero quando l'utente scende di 10px
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 w-full z-50 px-4 md:px-12 py-4 flex items-center justify-between transition-colors duration-500 ${
                isScrolled ? "bg-[#141414]" : "bg-gradient-to-b from-black/80 to-transparent"
            }`}
        >
            {/* GRUPPO SINISTRA: Logo + Navigazione Primaria */}
            <div className="flex items-center gap-6 md:gap-10">
                <Link href="/browse">
                    <h1 className={`${bebas.className} text-2xl md:text-4xl text-[#E50914] tracking-wider`}>
                        NETFLIX
                    </h1>
                </Link>

                <ul className="hidden lg:flex items-center gap-5 text-sm text-[#E5E5E5]">
                    <li className="font-bold text-white cursor-pointer hover:text-gray-300 transition">Home</li>
                    <li className="cursor-pointer hover:text-gray-300 transition text-[13px]">Serie</li>
                    <li className="cursor-pointer hover:text-gray-300 transition text-[13px]">Film</li>
                    <li className="cursor-pointer hover:text-gray-300 transition text-[13px]">Giochi</li>
                    <li className="cursor-pointer hover:text-gray-300 transition text-[13px]">Nuovi e popolari</li>
                    <li className="cursor-pointer hover:text-gray-300 transition text-[13px]">La mia lista</li>
                    <li className="cursor-pointer hover:text-gray-300 transition text-[13px]">Sfoglia per lingua</li>
                </ul>

                {/* Trigger per menu mobile (opzionale) */}
                <div className="lg:hidden flex items-center gap-1 text-white text-xs font-bold cursor-pointer">
                    Sfoglia <ChevronDown size={14} fill="white" />
                </div>
            </div>

            {/* GRUPPO DESTRA: Search, Kids, Bell, Profile */}
            <div className="flex items-center gap-5 text-white">
                <Search className="cursor-pointer w-5 h-5 hover:text-gray-300" strokeWidth={2.5} />

                <span className="hidden sm:inline text-[13px] cursor-pointer hover:text-gray-300">Bambini</span>

                <div className="relative cursor-pointer group">
                    <Bell className="w-5 h-5 hover:text-gray-300" strokeWidth={2.5} />
                    {/* Badge Notifica (il numero 13 rosso nell'immagine) */}
                    <span className="absolute -top-1.5 -right-1.5 bg-[#E50914] text-[9px] font-bold px-1 rounded-sm border-[0.5px] border-white/20">
                        13
                    </span>
                </div>

                <div className="flex items-center gap-2 cursor-pointer group">
                    <div className="w-8 h-8 rounded overflow-hidden">
                        {/* Icona profilo blu dell'immagine */}
                        <img
                            src="https://occ-0-2581-784.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABeukSeWjyiUEgKzcXwSdeS8ul5WNIOTMt6QsgVlobiBA8SKShw4Mfb2QdD6R_i0TZZ3fr4409fGv4q1kXrmpUSIevJDc90M.png?r=dec"
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
                </div>
            </div>
        </nav>
    );
}