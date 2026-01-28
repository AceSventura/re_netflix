import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// 1. Importa il Provider (assicurati che il percorso sia corretto)
import { ProfileProvider } from "@/context/ProfileContext";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Netflix Clone", // Magari cambiamo il titolo ;)
    description: "Netflix clone created with Next.js",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="it">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
        >
        {/* 2. Avvolgi tutto il contenuto con il ProfileProvider */}
        <ProfileProvider>
            <div className="min-h-screen flex flex-col">{children}</div>
        </ProfileProvider>
        </body>
        </html>
    );
}