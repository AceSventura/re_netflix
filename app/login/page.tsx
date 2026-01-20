"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (email === "user@gmail.com" && password === "password123") {
            // Imposta il cookie con path globale
            Cookies.set('isLoggedIn', 'true', { expires: 7, path: '/' });

            // REFRESH è fondamentale: forza Next.js a riconsiderare
            // le regole del middleware con il nuovo cookie
            window.location.href = '/';
        } else {
            alert("Credenziali errate!");
        }
    };

    return (
        <div className="relative h-screen w-full bg-[url('https://assets.nflxext.com/...')] bg-cover">
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative z-10 flex items-center justify-center h-full">
                <form onSubmit={handleLogin} className="bg-black/75 p-16 w-full max-w-md rounded-md">
                    <h2 className="text-white text-4xl mb-8 font-semibold">Accedi</h2>
                    <div className="flex flex-col gap-4">
                        <input
                            className="bg-[#333] text-white p-3 rounded"
                            type="email" placeholder="Email"
                            onChange={e => setEmail(e.target.value)}
                        />
                        <input
                            className="bg-[#333] text-white p-3 rounded"
                            type="password" placeholder="Password"
                            onChange={e => setPassword(e.target.value)}
                        />
                        <button type="submit" className="bg-[#E50914] text-white py-3 rounded font-bold mt-4">
                            Accedi
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}