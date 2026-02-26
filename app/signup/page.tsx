"use client";

import Link from "next/link";
import Image from "next/image";

function Footer() {
  const links = [
    "Domande frequenti",
    "Centro assistenza",
    "Condizioni di utilizzo",
    "Privacy",
    "Preferenze per i cookie",
    "Informazioni sull'azienda",
    "Preferenze per la pubblicità",
  ];

  return (
    <footer className="w-full bg-neutral-900 text-[#b1adad] py-8 mt-10">
      <div className="max-w-[1000px] mx-auto px-4">
        {/* Numero di telefono */}
        <p className="mb-8 text-base">
          Domande? Chiama il numero verde <a href="tel:800931413" className="hover:underline">800 931 413</a>
        </p>

        {/* Griglia Link */}
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-sm mb-8">
          {links.map((link) => (
            <li key={link}>
              <a href="#" className="hover:underline text-xs">
                {link}
              </a>
            </li>
          ))}
        </ul>

        {/* Selettore Lingua */}
        <div className="relative inline-block">
          <button className="flex items-center gap-2 bg-black border border-[#333] px-4 py-2 rounded text-sm font-medium hover:ring-1 hover:ring-gray-500 transition">
            <span className="text-white flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"></path></svg>
              Italiano
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="m7 10 5 5 5-5z"></path></svg>
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full bg-black md:bg-transparent">
      {/* Background Image per Desktop */}
      <div className="hidden md:block absolute -z-10 w-full h-full">
        <Image
          src="/login-background.png"
          alt="Netflix Background"
          fill
          className="object-cover brightness-50"
          unoptimized
        />
      </div>

        {/* Navbar */}
        <nav className="relative z-10 flex items-center justify-between px-6 py-6 lg:px-44">
        <Link href="/" className="block w-20 md:w-32" aria-label="Netflix">
            <svg viewBox="0 0 111 30" className="fill-[#e50914] w-full h-auto">
                <path d="M105.06233,14.2806261 L110.999156,30 C109.249227,29.7497422 107.500234,29.4366857 105.718437,29.1554972 L102.374168,20.4686475 L98.9371075,28.4375293 C97.2499766,28.1563408 95.5928391,28.061674 93.9057081,27.8432843 L99.9372012,14.0931671 L94.4680851,-5.68434189e-14 L99.5313525,-5.68434189e-14 L102.593495,7.87421502 L105.874965,-5.68434189e-14 L110.999156,-5.68434189e-14 L105.06233,14.2806261 Z M90.4686475,-5.68434189e-14 L85.8749649,-5.68434189e-14 L85.8749649,27.2499766 C87.3746368,27.3437061 88.9371075,27.4055675 90.4686475,27.5930265 L90.4686475,-5.68434189e-14 Z M81.9055207,26.93692 C77.7186241,26.6557316 73.5307901,26.4064111 69.250164,26.3117443 L69.250164,-5.68434189e-14 L73.9366389,-5.68434189e-14 L73.9366389,21.8745899 C76.6248008,21.9373887 79.3120255,22.1557784 81.9055207,22.2804387 L81.9055207,26.93692 Z M64.2496954,10.6561065 L64.2496954,15.3435186 L57.8442216,15.3435186 L57.8442216,25.9996251 L53.2186709,25.9996251 L53.2186709,-5.68434189e-14 L66.3436123,-5.68434189e-14 L66.3436123,4.68741213 L57.8442216,4.68741213 L57.8442216,10.6561065 L64.2496954,10.6561065 Z M45.3435186,4.68741213 L45.3435186,26.2498828 C43.7810479,26.2498828 42.1876465,26.2498828 40.6561065,26.3117443 L40.6561065,4.68741213 L35.8121661,4.68741213 L35.8121661,-5.68434189e-14 L50.2183897,-5.68434189e-14 L50.2183897,4.68741213 L45.3435186,4.68741213 Z M30.749836,15.5928391 C28.687787,15.5928391 26.2498828,15.5928391 24.4999531,15.6875059 L24.4999531,22.6562939 C27.2499766,22.4678976 30,22.2495079 32.7809542,22.1557784 L32.7809542,26.6557316 L19.812541,27.6876933 L19.812541,-5.68434189e-14 L32.7809542,-5.68434189e-14 L32.7809542,4.68741213 L24.4999531,4.68741213 L24.4999531,10.9991564 C26.3126816,10.9991564 29.0936358,10.9054269 30.749836,10.9054269 L30.749836,15.5928391 Z M4.78114163,12.9684132 L4.78114163,29.3429562 C3.09401069,29.5313525 1.59340144,29.7497422 0,30 L0,-5.68434189e-14 L4.4690224,-5.68434189e-14 L10.562377,17.0315868 L10.562377,-5.68434189e-14 L15.2497891,-5.68434189e-14 L15.2497891,28.061674 C13.5935889,28.3437998 11.906458,28.4375293 10.1246602,28.6868498 L4.78114163,12.9684132 Z" />
            </svg>
        </Link>
        </nav>

      {/* Login Card */}
      <main className="flex justify-center items-center px-4 py-8">
        <div className="w-full max-w-[450px] bg-black/75 p-16 rounded-md flex flex-col min-h-[660px]">
          <h2 className="text-white text-3xl font-bold mb-8">Accedi</h2>
          
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email o numero di telefono"
                className="w-full p-4 bg-[#333] text-white rounded focus:bg-[#454545] focus:outline-none"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full p-4 bg-[#333] text-white rounded focus:bg-[#454545] focus:outline-none"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-[#e50914] text-white font-bold py-3 rounded mt-6 hover:bg-[#c11119] transition"
            >
              Accedi
            </button>

            <div className="flex items-center justify-between text-[#b3b3b3] text-sm mt-2">
              <div className="flex items-center space-x-1">
                <input type="checkbox" id="remember" className="accent-gray-500" />
                <label htmlFor="remember">Ricordami</label>
              </div>
              <a href="#" className="hover:underline">Serve aiuto?</a>
            </div>
          </form>

        </div>
      </main>
      <Footer/>
    </div>
  );
}