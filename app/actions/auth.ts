"use server";

import { prisma } from "@/lib/prisma"; 
import bcrypt from "bcrypt";

export async function registerUser(formData: FormData) {
  // Ora recuperiamo solo email e password dal frontend
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Criptiamo la password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const utente = await prisma.utenti.create({
      data: {
        email,
        PASSWORD: hashedPassword,
        // Valori di default necessari perché il tuo schema Prisma li richiede obbligatori
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