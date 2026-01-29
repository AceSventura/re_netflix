"use client";

export default function Sidebar() {
  const menuItems = [
    { label: "Panoramica", active: true },
    { label: "Abbonamento", active: false },
    { label: "Sicurezza", active: false },
    { label: "Dispositivi", active: false },
    { label: "Profili", active: false },
  ];

  return (
    <nav className="flex flex-col gap-6">
      {/* Bottone Indietro */}
      <button className="flex items-center gap-2 text-sm text-gray-700 hover:underline">
        <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
            <path fillRule="evenodd" d="M4.81 8.747h9.187v-1.5H4.81L7.529 4.53 6.47 3.469l-4 3.998a.75.75 0 0 0 0 1.06l4 4.001 1.06-1.06z" clipRule="evenodd" />
        </svg>
        Torna su Netflix
      </button>

      {/* Lista Link */}
      <ul className="flex flex-col">
        {menuItems.map((item) => (
          <li key={item.label}>
            <a 
              href="#" 
              className={`flex items-center gap-3 py-3 px-4 text-[15px] transition-all rounded-md ${
                item.active 
                ? "bg-white shadow-sm font-bold text-black" 
                : "text-gray-500 hover:text-black"
              }`}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}