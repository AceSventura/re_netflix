"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ChevronDown, Pencil, User, HelpCircle, X } from "lucide-react";

import { logoutUser } from "@/app/actions/auth";
import { setActiveProfile } from "@/app/actions/profiles";
import { useProfiles, type Profile } from "@/context/ProfileContext";

const AVATAR_FALLBACK = "/avatars/1.jpg";

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { profiles, selectProfile, selectedProfile } = useProfiles();

    const otherProfiles = profiles.filter((profile) => profile.id_profilo !== selectedProfile?.id_profilo);

    const navLinks = [
        { name: "Home", href: "/browse" },
        { name: "Serie", href: "/browse/series" },
        { name: "Film", href: "/browse/movies" },
        { name: "Nuovi e popolari", href: "/browse/latest" },
        { name: "La mia lista", href: "/browse/my-list" },
    ];

    // 1. Sincronizzazione sicura dello stato (Pattern raccomandato da React 18+)
    // Evita l'errore "Avoid calling setState directly within an effect"
    const currentUrlQuery = searchParams.get("q") || "";
    const [prevUrlQuery, setPrevUrlQuery] = useState(currentUrlQuery);
    const [searchQuery, setSearchQuery] = useState(currentUrlQuery);
    const [isSearchExpanded, setIsSearchExpanded] = useState(currentUrlQuery.length > 0);

    // Se l'URL cambia esternamente (es. tasto Indietro del browser), allineiamo lo stato durante il render
    if (currentUrlQuery !== prevUrlQuery) {
        setPrevUrlQuery(currentUrlQuery);
        setSearchQuery(currentUrlQuery);
        if (currentUrlQuery.length > 0) {
            setIsSearchExpanded(true);
        }
    }

    const [isScrolled, setIsScrolled] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showBrowseMenu, setShowBrowseMenu] = useState(false);

    
    const searchInputRef = useRef<HTMLInputElement>(null);
    const debounceTimerRef = useRef<number | null>(null);

    // Pulizia del timer alla distruzione del componente
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) window.clearTimeout(debounceTimerRef.current);
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Focus automatico sull'input
    useEffect(() => {
        if (isSearchExpanded && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchExpanded]);

    // 2. Gestione attiva dell'input (Debounce imperativo)
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearchQuery(val); // Aggiorna istantaneamente la UI locale

        // Cancella il timer precedente se l'utente sta ancora scrivendo
        if (debounceTimerRef.current) {
            window.clearTimeout(debounceTimerRef.current);
        }

        // Imposta un nuovo timer per il push alla pagina di ricerca
        debounceTimerRef.current = window.setTimeout(() => {
            const trimmed = val.trim();
            if (trimmed.length > 0) {
                router.push(`/search?q=${encodeURIComponent(trimmed)}`);
            } else if (pathname === '/search') {
                router.push('/browse');
            }
        }, 300);
    };

    const handleClearSearch = () => {
        setSearchQuery("");
        if (debounceTimerRef.current) window.clearTimeout(debounceTimerRef.current);
        
        if (pathname === '/search') {
            router.push('/browse');
        }
        
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    };

    const handleProfileSwitch = async (profile: Profile) => {
        try {
            const res = await setActiveProfile(profile.id_profilo);
            if (res.success) {
                selectProfile(profile);
                router.push("/browse");
                router.refresh();
            }
        } catch (error) {
            console.error("Errore nel cambio profilo:", error);
        }
    };

    const handleLogout = async () => {
        try {
            const res = await logoutUser();
            if (res.success) {
                router.push("/login");
                router.refresh();
            }
        } catch (error) {
            console.error("Errore nel logout:", error);
        }
    };

    if (!selectedProfile) return null;

    return (
        <nav
            className={`fixed top-0 w-full z-50 px-4 md:px-12 py-4 flex items-center justify-between transition-colors duration-500 ${
                isScrolled ? "bg-[#141414]" : "bg-linear-to-b from-black/80 to-transparent"
            }`}
        >
            {/* GRUPPO SINISTRA */}
            <div className="flex items-center gap-6 md:gap-10">
                <Link href="/browse" className="block w-20 md:w-32" aria-label="Netflix">
                    <svg viewBox="0 0 111 30" className="fill-[#e50914] w-full h-auto">
                        <path d="M105.06233,14.2806261 L110.999156,30 C109.249227,29.7497422 107.500234,29.4366857 105.718437,29.1554972 L102.374168,20.4686475 L98.9371075,28.4375293 C97.2499766,28.1563408 95.5928391,28.061674 93.9057081,27.8432843 L99.9372012,14.0931671 L94.4680851,-5.68434189e-14 L99.5313525,-5.68434189e-14 L102.593495,7.87421502 L105.874965,-5.68434189e-14 L110.999156,-5.68434189e-14 L105.06233,14.2806261 Z M90.4686475,-5.68434189e-14 L85.8749649,-5.68434189e-14 L85.8749649,27.2499766 C87.3746368,27.3437061 88.9371075,27.4055675 90.4686475,27.5930265 L90.4686475,-5.68434189e-14 Z M81.9055207,26.93692 C77.7186241,26.6557316 73.5307901,26.4064111 69.250164,26.3117443 L69.250164,-5.68434189e-14 L73.9366389,-5.68434189e-14 L73.9366389,21.8745899 C76.6248008,21.9373887 79.3120255,22.1557784 81.9055207,22.2804387 L81.9055207,26.93692 Z M64.2496954,10.6561065 L64.2496954,15.3435186 L57.8442216,15.3435186 L57.8442216,25.9996251 L53.2186709,25.9996251 L53.2186709,-5.68434189e-14 L66.3436123,-5.68434189e-14 L66.3436123,4.68741213 L57.8442216,4.68741213 L57.8442216,10.6561065 L64.2496954,10.6561065 Z M45.3435186,4.68741213 L45.3435186,26.2498828 C43.7810479,26.2498828 42.1876465,26.2498828 40.6561065,26.3117443 L40.6561065,4.68741213 L35.8121661,4.68741213 L35.8121661,-5.68434189e-14 L50.2183897,-5.68434189e-14 L50.2183897,4.68741213 L45.3435186,4.68741213 Z M30.749836,15.5928391 C28.687787,15.5928391 26.2498828,15.5928391 24.4999531,15.6875059 L24.4999531,22.6562939 C27.2499766,22.4678976 30,22.2495079 32.7809542,22.1557784 L32.7809542,26.6557316 L19.812541,27.6876933 L19.812541,-5.68434189e-14 L32.7809542,-5.68434189e-14 L32.7809542,4.68741213 L24.4999531,4.68741213 L24.4999531,10.9991564 C26.3126816,10.9991564 29.0936358,10.9054269 30.749836,10.9054269 L30.749836,15.5928391 Z M4.78114163,12.9684132 L4.78114163,29.3429562 C3.09401069,29.5313525 1.59340144,29.7497422 0,30 L0,-5.68434189e-14 L4.4690224,-5.68434189e-14 L10.562377,17.0315868 L10.562377,-5.68434189e-14 L15.2497891,-5.68434189e-14 L15.2497891,28.061674 C13.5935889,28.3437998 11.906458,28.4375293 10.1246602,28.6868498 L4.78114163,12.9684132 Z" />
                    </svg>
                </Link>

                {/* Menu esteso: visibile solo da lg in su */}
                <ul className="hidden lg:flex items-center gap-5 text-sm transition-colors">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className={`cursor-pointer transition duration-300 hover:text-gray-300 ${
                                        isActive ? "font-bold text-white" : "font-normal text-[#E5E5E5]"
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                {/* Menu "Sfoglia": visibile solo sotto lg */}
                <div
                    className="relative lg:hidden"
                    onMouseEnter={() => setShowBrowseMenu(true)}
                    onMouseLeave={() => setShowBrowseMenu(false)}
                >
                    <button
                        type="button"
                        className="flex items-center gap-1 text-sm font-semibold text-white cursor-pointer"
                    >
                        Sfoglia
                        <ChevronDown
                            size={16}
                            className={`transition-transform duration-300 ${showBrowseMenu ? "rotate-180" : ""}`}
                        />
                    </button>

                    {showBrowseMenu && (
                        <div className="absolute left-0 top-full pt-4 w-52 animate-in fade-in duration-200">
                            <div className="absolute top-2 left-6 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-zinc-100/10" />

                            <div className="bg-black/95 border border-zinc-800 text-white text-sm shadow-xl">
                                <ul className="py-2">
                                    {navLinks.map((link) => {
                                        const isActive = pathname === link.href;
                                        return (
                                            <li key={link.href}>
                                                <Link
                                                    href={link.href}
                                                    className={`block px-4 py-2.5 transition duration-200 hover:bg-zinc-800/60 ${
                                                        isActive ? "font-bold text-white" : "font-normal text-[#E5E5E5]"
                                                    }`}
                                                >
                                                    {link.name}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* GRUPPO DESTRA */}
            <div className="flex items-center gap-5 text-white relative">
                <div className="relative items-center h-9">
                    {/* Contenitore Search */}
                    <div 
                        className={`flex items-center transition-all duration-300 ease-in-out ${
                            isSearchExpanded ? "border border-white bg-black/70" : "border-transparent bg-transparent"
                        }`}
                    >
                        <button
                            type="button"
                            onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                            className="p-2 text-white"
                            aria-label="Cerca"
                        >
                            <Search className="w-5 h-5" />
                        </button>
                        <input
                            ref={searchInputRef}
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Titoli, persone, generi"
                            onBlur={() => {
                                if (!searchQuery.trim()) setIsSearchExpanded(false);
                            }}
                            className={`transition-all duration-300 ease-in-out bg-transparent text-sm text-white outline-none placeholder:text-zinc-400 ${
                                isSearchExpanded ? "w-52 px-2 opacity-100" : "w-0 px-0 opacity-0 border-none"
                            }`}
                        />
                        {isSearchExpanded && searchQuery && (
                            <button
                                type="button"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={handleClearSearch}
                                className="p-2 text-zinc-400 hover:text-white"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </div>



                {/* CONTENITORE PROFILO + DROPDOWN */}
                <div 
                    className="relative"
                    onMouseEnter={() => setShowProfileMenu(true)}
                    onMouseLeave={() => setShowProfileMenu(false)}
                >
                    <div className="flex items-center gap-2 cursor-pointer group py-2">
                        <div className="w-8 h-8 rounded overflow-hidden relative">
                            <Image
                                src={selectedProfile.avatar_url || AVATAR_FALLBACK}
                                alt={selectedProfile.nome_profilo}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <ChevronDown size={14} className={`transition-transform duration-300 ${showProfileMenu ? "rotate-180" : ""}`} />
                    </div>

                    {showProfileMenu && (
                        <div className="absolute right-0 top-full pt-4 w-56 animate-in fade-in duration-200">
                            <div className="absolute top-2 right-4 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-zinc-100/10" />
                            
                            <div className="bg-black/95 border border-zinc-800 text-white text-[13px] shadow-xl">
                                <div className="p-3 space-y-3">
                                    {otherProfiles.map((profile) => (
                                        <button
                                            key={profile.id_profilo}
                                            type="button"
                                            onClick={() => void handleProfileSwitch(profile)}
                                            className="flex w-full items-center gap-3 group/item cursor-pointer text-left"
                                        >
                                            <div className="relative w-8 h-8 rounded-sm overflow-hidden">
                                                <Image
                                                    src={profile.avatar_url || AVATAR_FALLBACK}
                                                    alt={profile.nome_profilo}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <span className="group-hover/item:underline">{profile.nome_profilo}</span>
                                        </button>
                                    ))}
                                </div>

                                <div className="h-px bg-zinc-800" />

                                <div className="p-3 space-y-3">
                                    <button
                                        type="button"
                                        onClick={() => router.push("/account/profiles")}
                                        className="flex w-full items-center gap-3 group/item cursor-pointer text-left"
                                    >
                                        <Pencil size={18} className="text-zinc-400" />
                                        <span className="group-hover/item:underline text-zinc-200">Gestisci i profili</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => router.push("/account")}
                                        className="flex w-full items-center gap-3 group/item cursor-pointer text-left"
                                    >
                                        <User size={18} className="text-zinc-400" />
                                        <span className="group-hover/item:underline text-zinc-200">Account</span>
                                    </button>
                                    <a
                                        href="https://help.netflix.com/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex w-full items-center gap-3 group/item cursor-pointer text-left"
                                    >
                                        <HelpCircle size={18} className="text-zinc-400" />
                                        <span className="group-hover/item:underline text-zinc-200">Centro assistenza</span>
                                    </a>
                                </div>

                                <div className="h-px bg-zinc-800" />

                                <button
                                    type="button"
                                    onClick={() => void handleLogout()}
                                    className="w-full p-4 text-center cursor-pointer hover:underline font-medium text-zinc-200"
                                >
                                    Esci da Netflix
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}