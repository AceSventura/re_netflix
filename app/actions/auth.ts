"use server";
// Importa l'istanza di Prisma Client per interagire con il database
import { prisma } from "@/lib/prisma"; 
// Importa bcrypt per la gestione della crittografia delle password
import bcrypt from "bcrypt";
// Importa la funzione cookies da Next.js per gestire i cookie
import { cookies } from "next/headers";

// Funzione per registrare un nuovo utente
export async function registerUser(formData: FormData) { // Riceve i dati del modulo come parametro
  // Estrae l'email e la password dai dati del modulo
  const email = formData.get("email") as string; 
  const password = formData.get("password") as string; 

  // criptiamo la password con un "costo" computazionale di 10 (saltRounds)
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Crea un nuovo record nella tabella "utenti" del database con l'email e la password crittografata
    const utente = await prisma.utenti.create({
      data: {
        email,
        PASSWORD: hashedPassword,
        nome: "",  // Placeholder temporanei per campi non gestiti dal form attuale
        cognome: "",
        data_nascita: new Date(),
      },
    });

    // Risposta di successo al client
    return { success: true, userId: utente.id_utente };
  } catch (error) {
    console.error("Errore di registrazione:", error); 
    return { success: false, message: "Errore durante la registrazione: l'email potrebbe essere già esistente." };
  }
}

// funzione di logout
export async function logoutUser() {
  try {
    const cookieStore = await cookies(); // Ottiene l'oggetto cookieStore per gestire i cookie
    const sessionToken = cookieStore.get("session_token")?.value; // Ottiene l'oggeto sessionToken per gestire i token di sessione

    if (sessionToken) {
      const sessionId = Number(sessionToken); 
      // Controllo di validità: previene errori sul DB se il cookie è stato 
      // manomesso nel browser con stringhe non numeriche.
      if (!Number.isNaN(sessionId)) { 
        // Elimina fisicamente la sessione dal database.
        // Il .catch(() => undefined) "inghiotte" silenziosamente l'errore 
        // se la sessione fosse già inesistente.
        await prisma.sessioni.delete({ where: { id_sessione: sessionId } }).catch(() => undefined); 
      }
    }

    // Ordina al browser di distruggere i cookie locali.
    cookieStore.delete("session_token"); 
    cookieStore.delete("active_profile_id");

    return { success: true }; 
  } catch (error) {
    console.error("Errore logoutUser:", error);
    return { success: false, error: "Errore durante il logout" };
  }
}

// funzione per verificare l'easistenza della mail
export async function checkEmailExists(email: string) {
  if (!email) return false; // se non esiste

  try {
    //PRISMA ORM - LETTURA (Read):
    const user = await prisma.utenti.findUnique({ 
      where: { email },
      // Usa 'select' per ordinare a SQL di restituire SOLO la colonna id_utente.
      // Ignorando il resto dei dati (password, data di nascita, ecc.)
      select: { id_utente: true }, 
    });

    // L'operatore '!!' (doppia negazione) converte un valore truthy/falsy in un booleano puro.
    // Se 'user' contiene un record -> !!user === true.
    // Se 'user' è null (non trovato) -> !!null === false.
    return !!user;
  } catch (error) {
    console.error("Errore durante la verifica dell'email:", error);
    return false;
  }
}