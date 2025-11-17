// Font per h1
import { Bebas_Neue } from "next/font/google";
import Link from "next/link";

const bebas = Bebas_Neue({
    subsets: ["latin"],
    weight: "400",
});

export default function Navbar() {
    return (
        <nav className="fixed top-0 w-full z-50 bg-gradient-to-b from-black/70 to-black/20 backdrop-blur-md px-8 py-4 flex items-center justify-between transition-colors duration-300">
            <Link href="/">
            <h1 className={`${bebas.className} text-4xl text-red-600`}>
                NETFLIX
            </h1>
            </Link>
            <ul className="flex items-center gap-6 text-white">
                <li className="cursor-pointer hover:text-gray-300 transition">Home</li>
                <li className="cursor-pointer hover:text-gray-300 transition">Series</li>
                <li className="cursor-pointer hover:text-gray-300 transition">Movies</li>
                <li className="cursor-pointer hover:text-gray-300 transition">My List</li>
            </ul>
        </nav>
    )
}