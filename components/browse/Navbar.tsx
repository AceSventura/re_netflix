"use client";

import { usePathname } from "next/navigation"; // Importa l'hook per leggere l'URL
import { useEffect, useState } from "react";
import { Bebas_Neue } from "next/font/google";
import Link from "next/link";
import { Search, Bell, ChevronDown, Pencil, UserRoundPlus, User, HelpCircle } from "lucide-react";

const bebas = Bebas_Neue({
    subsets: ["latin"],
    weight: "400",
});

export default function Navbar() {
    const pathname = usePathname(); // Ottieni l'URL corrente (es: "/browse/movies")
    
    const navLinks = [
        { name: "Home", href: "/browse" },
        { name: "Serie", href: "/browse/series" },
        { name: "Film", href: "/browse/movies" },
        { name: "Nuovi e popolari", href: "/browse/latest" },
        { name: "La mia lista", href: "/browse/my-list" },
    ];

    const [isScrolled, setIsScrolled] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
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
            {/* GRUPPO SINISTRA */}
            <div className="flex items-center gap-6 md:gap-10">
                <Link href="/browse" className="block w-20 md:w-32" aria-label="Netflix">
                    <svg viewBox="0 0 111 30" className="fill-[#e50914] w-full h-auto">
                        <path d="M105.06233,14.2806261 L110.999156,30 C109.249227,29.7497422 107.500234,29.4366857 105.718437,29.1554972 L102.374168,20.4686475 L98.9371075,28.4375293 C97.2499766,28.1563408 95.5928391,28.061674 93.9057081,27.8432843 L99.9372012,14.0931671 L94.4680851,-5.68434189e-14 L99.5313525,-5.68434189e-14 L102.593495,7.87421502 L105.874965,-5.68434189e-14 L110.999156,-5.68434189e-14 L105.06233,14.2806261 Z M90.4686475,-5.68434189e-14 L85.8749649,-5.68434189e-14 L85.8749649,27.2499766 C87.3746368,27.3437061 88.9371075,27.4055675 90.4686475,27.5930265 L90.4686475,-5.68434189e-14 Z M81.9055207,26.93692 C77.7186241,26.6557316 73.5307901,26.4064111 69.250164,26.3117443 L69.250164,-5.68434189e-14 L73.9366389,-5.68434189e-14 L73.9366389,21.8745899 C76.6248008,21.9373887 79.3120255,22.1557784 81.9055207,22.2804387 L81.9055207,26.93692 Z M64.2496954,10.6561065 L64.2496954,15.3435186 L57.8442216,15.3435186 L57.8442216,25.9996251 L53.2186709,25.9996251 L53.2186709,-5.68434189e-14 L66.3436123,-5.68434189e-14 L66.3436123,4.68741213 L57.8442216,4.68741213 L57.8442216,10.6561065 L64.2496954,10.6561065 Z M45.3435186,4.68741213 L45.3435186,26.2498828 C43.7810479,26.2498828 42.1876465,26.2498828 40.6561065,26.3117443 L40.6561065,4.68741213 L35.8121661,4.68741213 L35.8121661,-5.68434189e-14 L50.2183897,-5.68434189e-14 L50.2183897,4.68741213 L45.3435186,4.68741213 Z M30.749836,15.5928391 C28.687787,15.5928391 26.2498828,15.5928391 24.4999531,15.6875059 L24.4999531,22.6562939 C27.2499766,22.4678976 30,22.2495079 32.7809542,22.1557784 L32.7809542,26.6557316 L19.812541,27.6876933 L19.812541,-5.68434189e-14 L32.7809542,-5.68434189e-14 L32.7809542,4.68741213 L24.4999531,4.68741213 L24.4999531,10.9991564 C26.3126816,10.9991564 29.0936358,10.9054269 30.749836,10.9054269 L30.749836,15.5928391 Z M4.78114163,12.9684132 L4.78114163,29.3429562 C3.09401069,29.5313525 1.59340144,29.7497422 0,30 L0,-5.68434189e-14 L4.4690224,-5.68434189e-14 L10.562377,17.0315868 L10.562377,-5.68434189e-14 L15.2497891,-5.68434189e-14 L15.2497891,28.061674 C13.5935889,28.3437998 11.906458,28.4375293 10.1246602,28.6868498 L4.78114163,12.9684132 Z" />
                    </svg>
                </Link>

                <ul className="hidden lg:flex items-center gap-5 text-sm transition-colors">
                    {navLinks.map((link) => {
                        // Verifichiamo se il link è quello attivo
                        const isActive = pathname === link.href;

                        return (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className={`cursor-pointer transition duration-300 hover:text-gray-300 ${
                                        isActive 
                                            ? "font-bold text-white" // Stile per pagina corrente
                                            : "font-normal text-[#E5E5E5]" // Stile normale
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* GRUPPO DESTRA */}
            <div className="flex items-center gap-5 text-white">
                <Search className="cursor-pointer w-5 h-5 hover:text-gray-300" />
                <span className="hidden sm:inline text-[13px] cursor-pointer hover:text-gray-300">Bambini</span>
                
                <div className="relative cursor-pointer">
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-1.5 -right-1.5 bg-[#E50914] text-[9px] font-bold px-1 rounded-sm">13</span>
                </div>

                {/* CONTENITORE PROFILO + DROPDOWN */}
                <div 
                    className="relative"
                    onMouseEnter={() => setShowProfileMenu(true)}
                    onMouseLeave={() => setShowProfileMenu(false)}
                >
                    <div className="flex items-center gap-2 cursor-pointer group py-2">
                        <div className="w-8 h-8 rounded overflow-hidden">
                            <img
                                src="https://occ-0-2581-784.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABeukSeWjyiUEgKzcXwSdeS8ul5WNIOTMt6QsgVlobiBA8SKShw4Mfb2QdD6R_i0TZZ3fr4409fGv4q1kXrmpUSIevJDc90M.png?r=dec"
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <ChevronDown size={14} className={`transition-transform duration-300 ${showProfileMenu ? "rotate-180" : ""}`} />
                    </div>

                    {/* DROPDOWN MENU */}
                    {showProfileMenu && (
                        <div className="absolute right-0 top-full pt-4 w-56 animate-in fade-in duration-200">
                            {/* Triangolino */}
                            <div className="absolute top-2 right-4 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-zinc-100/10" />
                            
                            <div className="bg-black/95 border border-zinc-800 text-white text-[13px] shadow-xl">
                                {/* Lista Profili */}
                                <div className="p-3 space-y-3">
                                    <div className="flex items-center gap-3 group/item cursor-pointer">
                                        <div className="w-8 h-8 bg-yellow-600 rounded-sm overflow-hidden flex items-center justify-center">
                                            <span className="text-[10px]">🎭</span>
                                        </div>
                                        <span className="group-hover/item:underline">Papà</span>
                                    </div>
                                    <div className="flex items-center gap-3 group/item cursor-pointer">
                                        <div className="w-8 h-8 bg-purple-600 rounded-sm"></div>
                                        <span className="group-hover/item:underline">Grazia</span>
                                    </div>
                                    <div className="flex items-center gap-3 group/item cursor-pointer">
                                        <div className="w-8 h-8 bg-blue-400 rounded-sm flex items-center justify-center text-[10px] text-white">bambini</div>
                                        <span className="group-hover/item:underline">Bambini</span>
                                    </div>
                                </div>

                                <div className="h-[1px] bg-zinc-800" />

                                {/* Azioni */}
                                <div className="p-3 space-y-3">
                                    <div className="flex items-center gap-3 group/item cursor-pointer">
                                        <Pencil size={18} className="text-zinc-400" />
                                        <span className="group-hover/item:underline text-zinc-200">Gestisci i profili</span>
                                    </div>
                                    <div className="flex items-center gap-3 group/item cursor-pointer">
                                        <UserRoundPlus size={18} className="text-zinc-400" />
                                        <span className="group-hover/item:underline text-zinc-200">Trasferisci profilo</span>
                                    </div>
                                    <div className="flex items-center gap-3 group/item cursor-pointer">
                                        <User size={18} className="text-zinc-400" />
                                        <span className="group-hover/item:underline text-zinc-200">Account</span>
                                    </div>
                                    <div className="flex items-center gap-3 group/item cursor-pointer">
                                        <HelpCircle size={18} className="text-zinc-400" />
                                        <span className="group-hover/item:underline text-zinc-200">Centro assistenza</span>
                                    </div>
                                </div>

                                <div className="h-[1px] bg-zinc-800" />

                                {/* Logout */}
                                <div className="p-4 text-center cursor-pointer hover:underline font-medium">
                                    Esci da Netflix
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}