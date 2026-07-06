"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* HEADER */}
      <header className="w-full border-b border-gray-200 py-6 bg-white">
        <div className="max-w-[1000px] mx-auto px-4 flex justify-between items-center">
          <Link href="/">
            <Image
              src="https://occ.a.nflxso.net/dnmt/api/v6/iL4oJVDYZ8KLSrJ6eG2OwtghbfQ/AAAAAVBEN9I57czDc_uW4ZnDTNTb9hWvK70hYAqf0VNv_dsufIxZqfNclKrp7ugn5j0DkKCYy_4ncEpi6fJk1wpPuLO61r5YUWiEbVjxFpCESIWdJwAAOvAX.svg"
              alt="Netflix"
              width={140}
              height={32}
              priority
            />
          </Link>
          <Link href="/login" className="font-bold text-[#333] hover:underline text-lg">
            Accedi
          </Link>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-grow flex justify-center items-center py-16 md:py-24 px-4">
        <div className="max-w-[340px] text-left flex flex-col space-y-6 py-12">
          
          {/* Logo SVG */}
          <div className="text-[#e50914]">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 48 48">
              <path fill="currentColor" fillRule="evenodd" d="M2 24C2 11.85 11.85 2 24 2s22 9.85 22 22-9.85 22-22 22S2 36.15 2 24M24 0C10.745 0 0 10.745 0 24s10.745 24 24 24 24-10.745 24-24S37.255 0 24 0m-2.293 30.707 12-12-1.414-1.414L21 28.586l-5.293-5.293-1.414 1.414 6 6 .707.707z" clipRule="evenodd" />
            </svg>
          </div>

          {/* Testi */}
          <div>
            <p className="text-sm text-gray-900 mb-1">Passaggio 1 di 3</p>
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">Scegli un piano</h1>
          </div>
          
          {/* Lista */}
          <ul className="space-y-5">
            <li className="flex items-start gap-3 text-lg text-gray-800">
              <span className="text-[#e50914] font-bold mt-0.5">✓</span> Senza impegno, disdici quando vuoi.
            </li>
            <li className="flex items-start gap-3 text-lg text-gray-800">
              <span className="text-[#e50914] font-bold mt-0.5">✓</span> Un intrattenimento senza fine a un costo mensile ridotto.
            </li>
            <li className="flex items-start gap-3 text-lg text-gray-800">
              <span className="text-[#e50914] font-bold mt-0.5">✓</span> Guarda Netflix su tutti i tuoi dispositivi.
            </li>
          </ul>

          {/* Bottone */}
          <div className="pt-4">
            <Link 
              href="/signup/planform" 
              className="block w-full bg-[#e50914] text-white text-center py-4 rounded font-medium text-xl hover:bg-[#c40812] transition-colors"
            >
              Avanti
            </Link>
          </div>
        </div>
      </main>
      
      {/* FOOTER */}
      <footer className="w-full bg-[#f3f3f3] text-[#737373] pt-16 pb-12 border-t border-gray-200">
        <div className="max-w-[1000px] mx-auto px-4 py-8">
          <p className="text-base mb-6">
            Domande? Chiama il numero verde <a href="tel:800931413" className="underline">800 931 413</a>
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-4 text-sm mb-8">
            <Link href="#" className="underline">Domande frequenti</Link>
            <Link href="#" className="underline">Centro assistenza</Link>
            <Link href="#" className="underline">Condizioni di utilizzo</Link>
            <Link href="#" className="underline">Privacy</Link>
            <Link href="#" className="underline">Preferenze per i cookie</Link>
            <Link href="#" className="underline">Informazioni sull&apos;azienda</Link>
            <Link href="#" className="underline">Preferenze per la pubblicità</Link>
          </div>

          <div className="relative inline-block border border-gray-400 px-2 py-1 bg-white">
            <span className="mr-2">🌐</span>
            <select className="bg-transparent outline-none cursor-pointer">
              <option>Italiano</option>
              <option>English</option>
            </select>
          </div>
        </div>
      </footer>
    </div>
  );
}