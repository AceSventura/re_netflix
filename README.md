# Progetto: Piattaforma Streaming (Next.js + Prisma)

Questo repository contiene l'implementazione di un'applicazione web basata su architettura Next.js (App Router). Il sistema gestisce l'autenticazione tramite cookie HTTP-Only, la navigazione dei media e la gestione dei profili utente utilizzando Prisma ORM interfacciato con un database SQLite.

## Prerequisiti di sistema

Il motore di esecuzione richiesto per questo ambiente è **Node.js** (versione LTS raccomandata).

### Installazione di Node.js (se non presente sul sistema)

* **Windows / macOS:** Scarica il pacchetto di installazione LTS direttamente dal sito ufficiale [nodejs.org](https://nodejs.org/) ed esegui la procedura standard.
* **Linux (Ubuntu/Debian):**
    ```bash
    curl -fsSL [https://deb.nodesource.com/setup_lts.x](https://deb.nodesource.com/setup_lts.x) | sudo -E bash -
    sudo apt-get install -y nodejs
    ```
* **Verifica installazione:** Apri un terminale e verifica che i comandi restituiscano i numeri di versione corretti:
    ```bash
    node -v
    npm -v
    ```

## Installazione e Configurazione Locale

Seguire in sequenza i passaggi sottostanti per inizializzare l'ambiente di sviluppo.

**1. Installazione delle dipendenze**
Dalla directory radice del progetto, installa i pacchetti necessari definiti nel file `package.json`:
```bash
npm install