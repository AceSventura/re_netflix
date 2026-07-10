"use server";

import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

const adapter = new PrismaBetterSqlite3({ url: "file:./prisma/netflix.db" });
const prisma = new PrismaClient({ adapter });

const MAX_PROFILI = 5;

// Recupera l'utente loggato a partire dal cookie di sessione
async function getUtenteDaSessione() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;
  if (!token) return null;

  // Normalmente il token è una stringa. Si fa il cast per numero
  const idSessione = Number(token);
  if (isNaN(idSessione)) return null; // cookie manomesso/non numerico

  const sessione = await prisma.sessioni.findUnique({
    where: { id_sessione: idSessione },
    include: { utenti: true },
  });

  if (!sessione || sessione.expiresAt < new Date()) return null;
  return sessione.utenti;
}

export async function getUserProfiles() {
  try {
    const utente = await getUtenteDaSessione();
    if (!utente) {
      const cookieStore = await cookies();
      if(cookieStore.get("session_token")) { 
        cookieStore.delete("session_token");
      }
      return { success: false, error: "Sessione non valida o scaduta" };
    }

    const profiles = await prisma.profili.findMany({
      where: { id_utente: utente.id_utente },
      orderBy: { id_profilo: "asc" },
    });

    return { success: true, profiles };
  } catch (error) {
    console.error("Errore getUserProfiles:", error);
    return { success: false, error: "Errore interno del server" };
  }
}

export async function createNewProfile(nome: string, avatarUrl: string) {
  try {
    const utente = await getUtenteDaSessione();
    if (!utente) {
      return { success: false, error: "Sessione non valida o scaduta" };
    }

    // Normalizzazione della stringa nome
    if (!nome || !nome.trim()) {
      return { success: false, error: "Il nome del profilo è obbligatorio" };
    }

    const count = await prisma.profili.count({
      where: { id_utente: utente.id_utente },
    });

    if (count >= MAX_PROFILI) {
      return { success: false, error: "Hai raggiunto il numero massimo di profili" };
    }

    const profile = await prisma.profili.create({
      data: {
        nome_profilo: nome.trim(),
        avatar_url: avatarUrl,
        id_utente: utente.id_utente,
      },
    });

    return { success: true, profile };
  } catch (error) {
    console.error("Errore createNewProfile:", error);
    return { success: false, error: "Errore interno del server" };
  }
}

export async function setActiveProfile(profileId: number) {
  try {
    const utente = await getUtenteDaSessione();
    if (!utente) {
      return { success: false, error: "Sessione non valida o scaduta" };
    }

    // Verifica che il profilo appartenga davvero a questo utente
    const profilo = await prisma.profili.findFirst({
      where: { id_profilo: profileId, id_utente: utente.id_utente },
    });

    if (!profilo) {
      return { success: false, error: "Profilo non trovato" };
    }

    const cookieStore = await cookies();
    cookieStore.set("active_profile_id", String(profilo.id_profilo), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return { success: true };
  } catch (error) {
    console.error("Errore setActiveProfile:", error);
    return { success: false, error: "Errore interno del server" };
  }
}

export async function deleteProfile(profileId: number) {
  try {
    const utente = await getUtenteDaSessione();
    if (!utente) {
      return { success: false, error: "Sessione non valida o scaduta" };
    }

    const profilo = await prisma.profili.findFirst({
      where: { id_profilo: profileId, id_utente: utente.id_utente },
    });

    if (!profilo) {
      return { success: false, error: "Profilo non trovato" };
    }

    await prisma.profili.delete({ where: { id_profilo: profileId } });

    return { success: true };
  } catch (error) {
    console.error("Errore deleteProfile:", error);
    return { success: false, error: "Errore interno del server" };
  }
}

export async function getActiveProfile() {
  try {
    const utente = await getUtenteDaSessione();
    if (!utente) {
      return { success: false, error: "Sessione non valida o scaduta" };
    }

    const cookieStore = await cookies();
    const activeProfileId = cookieStore.get("active_profile_id")?.value;

    if (!activeProfileId) {
      return { success: true, profile: null };
    }

    const profilo = await prisma.profili.findFirst({
      where: { id_profilo: Number(activeProfileId), id_utente: utente.id_utente },
    });

    return { success: true, profile: profilo ?? null };
  } catch (error) {
    console.error("Errore getActiveProfile:", error);
    return { success: false, error: "Errore interno del server" };
  }
}
export async function removeProfileCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("active_profile_id");
  
}