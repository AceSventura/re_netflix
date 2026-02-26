"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { label: "Panoramica", href: "/account" },
    { label: "Abbonamento", href: "/account/membership" },
    { label: "Sicurezza", href: "/account/security" },
    { label: "Dispositivi", href: "/account/devices" },
    { label: "Profili", href: "/account/profiles" },
  ];

  return (
    <nav className="flex flex-col gap-6">
      {/* Bottone Indietro */}
      <Link href="/browse" className="flex items-center gap-2 text-sm text-gray-700 hover:underline transition-all">
        <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
          <path fillRule="evenodd" d="M4.81 8.747h9.187v-1.5H4.81L7.529 4.53 6.47 3.469l-4 3.998a.75.75 0 0 0 0 1.06l4 4.001 1.06-1.06z" clipRule="evenodd" />
        </svg>
        Torna su Netflix
      </Link>

      {/* Lista Link */}
      <ul className="flex flex-col gap-1">
        {menuItems.map((item) => {
          // Controlla se il link corrente è quello attivo
          const isActive = pathname === item.href;
          
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 py-3 px-4 text-[15px] transition-all rounded-md ${
                  isActive
                    ? "bg-white shadow-sm font-bold text-black"
                    : "text-gray-500 hover:text-black hover:bg-gray-200/50"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}