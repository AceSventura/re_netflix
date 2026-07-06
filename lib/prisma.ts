import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

// Definizione globale per evitare connessioni multiple in sviluppo (Next.js hot-reload)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// 1. Risoluzione del percorso assoluto
const dbPath = path.join(process.cwd(), "prisma", "netflix.db");

// 2. Inizializzazione dell'adattatore con la sintassi richiesta dall'interfaccia
// Il prefisso 'file:' è obbligatorio per SQLite
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });

// 3. Istanziazione di PrismaClient con l'adattatore
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}