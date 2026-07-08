"use server";

import { prisma } from "@/lib/prisma"; 
import bcrypt from "bcrypt";
import { cookies } from "next/headers";

export async function registerUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // criptiamo la password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const utente = await prisma.utenti.create({
      data: {
        email,
        PASSWORD: hashedPassword,
        nome: "",
        cognome: "",
        data_nascita: new Date(),
      },
    });

    return { success: true, userId: utente.id_utente };
  } catch (error) {
    console.error("Errore di registrazione:", error);
    return { success: false, message: "Errore durante la registrazione: l'email potrebbe essere già esistente." };
  }
}

export async function logoutUser() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session_token")?.value;

    if (sessionToken) {
      const sessionId = Number(sessionToken);
      if (!Number.isNaN(sessionId)) {
        await prisma.sessioni.delete({ where: { id_sessione: sessionId } }).catch(() => undefined);
      }
    }

    cookieStore.delete("session_token");
    cookieStore.delete("active_profile_id");

    return { success: true };
  } catch (error) {
    console.error("Errore logoutUser:", error);
    return { success: false, error: "Errore durante il logout" };
  }
}

export async function checkEmailExists(email: string) {
  if (!email) return false;

  try {
    const user = await prisma.utenti.findUnique({
      where: { email },
      select: { id_utente: true }, 
    });

    return !!user;
  } catch (error) {
    console.error("Errore durante la verifica dell'email:", error);
    return false;
  }
}