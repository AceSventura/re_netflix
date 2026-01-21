CREATE DATABASE IF NOT EXISTS Netflix;

use Netflix;

-- =========================
-- UTENTI E PROFILI
-- =========================

CREATE TABLE Utenti (
    id_utente INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cognome VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    data_nascita DATE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE Profili (
    id_profilo INT AUTO_INCREMENT PRIMARY KEY,
    pin_profilo VARCHAR(10),
    lingua VARCHAR(50),
    nome_profilo VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    id_utente INT NOT NULL,
    FOREIGN KEY (id_utente) REFERENCES Utenti(id_utente)
);

-- =========================
-- ABBONAMENTI
-- =========================

CREATE TABLE Abbonamenti (
    id_abbonamento INT AUTO_INCREMENT PRIMARY KEY,
    piano VARCHAR(50) NOT NULL,
    costo_mensile DECIMAL(6,2) NOT NULL
);

CREATE TABLE Sottoscrive (
    data_inizio_sottoscrizione DATE NOT NULL,
    data_scadenza DATE NOT NULL,
    id_utente INT NOT NULL,
    id_abbonamento INT NOT NULL,
    PRIMARY KEY (id_utente, id_abbonamento),
    FOREIGN KEY (id_utente) REFERENCES Utenti(id_utente),
    FOREIGN KEY (id_abbonamento) REFERENCES Abbonamenti(id_abbonamento)
);

-- =========================
-- SERIE TV, STAGIONI
-- =========================

CREATE TABLE Serie_tv (
    id_serie_tv INT AUTO_INCREMENT PRIMARY KEY,
    titolo_serie_tv VARCHAR(150) NOT NULL
);

CREATE TABLE Stagioni (
    id_stagione INT AUTO_INCREMENT PRIMARY KEY,
    titolo_stagione VARCHAR(150),
    numero_stagione INT NOT NULL,
    id_serie_tv INT NOT NULL,
    FOREIGN KEY (id_serie_tv) REFERENCES Serie_tv(id_serie_tv)
);

-- =========================
-- CONTENUTI
-- =========================

CREATE TABLE Contenuti (
    id_contenuto INT AUTO_INCREMENT PRIMARY KEY,
    descrizione TEXT,
    anno_rilascio INT,
    durata INT,
    titolo_contenuto VARCHAR(150) NOT NULL,
    tipo ENUM('episodio', 'film') NOT NULL,
    id_stagione INT,
    FOREIGN KEY (id_stagione) REFERENCES Stagioni(id_stagione)
);

-- =========================
-- VALUTAZIONI
-- =========================

CREATE TABLE Valutazioni (
    id_valutazione INT AUTO_INCREMENT PRIMARY KEY,
    punteggio ENUM('Non fa per me', 'Mi piace', 'Adoro!') NOT NULL,
    id_profilo INT NOT NULL,
    id_serie_tv INT,
    id_film INT,
    FOREIGN KEY (id_profilo) REFERENCES Profili(id_profilo),
    FOREIGN KEY (id_serie_tv) REFERENCES Serie_tv(id_serie_tv),
    FOREIGN KEY (id_film) REFERENCES Contenuti(id_contenuto)
);

-- =========================
-- VISUALIZZAZIONE
-- =========================

CREATE TABLE Guarda (
    durata_visualizzata INT,
    stato_completamento BOOLEAN,
    id_contenuto INT NOT NULL,
    id_profilo INT NOT NULL,
    PRIMARY KEY (id_contenuto, id_profilo),
    FOREIGN KEY (id_contenuto) REFERENCES Contenuti(id_contenuto),
    FOREIGN KEY (id_profilo) REFERENCES Profili(id_profilo)
);

-- =========================
-- GENERI
-- =========================

CREATE TABLE Generi (
    id_genere INT AUTO_INCREMENT PRIMARY KEY,
    nome_genere VARCHAR(100) NOT NULL
);

CREATE TABLE Classificato_in (
    id_genere INT NOT NULL,
    id_contenuto INT NOT NULL,
    PRIMARY KEY (id_genere, id_contenuto),
    FOREIGN KEY (id_genere) REFERENCES Generi(id_genere),
    FOREIGN KEY (id_contenuto) REFERENCES Contenuti(id_contenuto)
);

-- =========================
-- ASSET VIDEO
-- =========================

CREATE TABLE Assets_video (
    id_asset_video INT AUTO_INCREMENT PRIMARY KEY,
    bitrate INT,
    codec VARCHAR(50),
    url_manifest TEXT NOT NULL
);

CREATE TABLE Codificato (
    id_asset_video INT NOT NULL,
    id_contenuto INT NOT NULL,
    PRIMARY KEY (id_asset_video, id_contenuto),
    FOREIGN KEY (id_asset_video) REFERENCES Assets_video(id_asset_video),
    FOREIGN KEY (id_contenuto) REFERENCES Contenuti(id_contenuto)
);

-- =========================
-- ASSET AUDIO E LINGUE
-- =========================

CREATE TABLE Assets_audio (
    id_asset_audio INT AUTO_INCREMENT PRIMARY KEY,
    codec VARCHAR(50),
    url_traccia TEXT NOT NULL
);

CREATE TABLE Include (
    id_asset_audio INT NOT NULL,
    id_contenuto INT NOT NULL,
    PRIMARY KEY (id_asset_audio, id_contenuto),
    FOREIGN KEY (id_asset_audio) REFERENCES Assets_audio(id_asset_audio),
    FOREIGN KEY (id_contenuto) REFERENCES Contenuti(id_contenuto)
);

CREATE TABLE Lingue (
    id_lingua INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL
);

CREATE TABLE Parlato_in (
    id_lingua INT NOT NULL,
    id_asset_audio INT NOT NULL,
    PRIMARY KEY (id_lingua, id_asset_audio),
    FOREIGN KEY (id_lingua) REFERENCES Lingue(id_lingua),
    FOREIGN KEY (id_asset_audio) REFERENCES Assets_audio(id_asset_audio)
);

-- =========================
-- SOTTOTITOLI
-- =========================

CREATE TABLE Sottotitoli (
    id_sub INT AUTO_INCREMENT PRIMARY KEY,
    url_sub TEXT NOT NULL,
    formato VARCHAR(20),
    tipo_traccia ENUM('forzata', 'completa'),
    id_contenuto INT NOT NULL,
    FOREIGN KEY (id_contenuto) REFERENCES Contenuti(id_contenuto)
);

CREATE TABLE Tradotto_in (
    id_lingua INT NOT NULL,
    id_sub INT NOT NULL,
    PRIMARY KEY (id_lingua, id_sub),
    FOREIGN KEY (id_lingua) REFERENCES Lingue(id_lingua),
    FOREIGN KEY (id_sub) REFERENCES Sottotitoli(id_sub)
);

-- =========================
-- PREFERITI / LISTE
-- =========================

CREATE TABLE Salva_film (
    id_film INT NOT NULL,
    id_profilo INT NOT NULL,
    PRIMARY KEY (id_film, id_profilo),
    FOREIGN KEY (id_film) REFERENCES Contenuti(id_contenuto),
    FOREIGN KEY (id_profilo) REFERENCES Profili(id_profilo)
);

CREATE TABLE Salva_serie (
    id_serie_tv INT NOT NULL,
    id_profilo INT NOT NULL,
    PRIMARY KEY (id_serie_tv, id_profilo),
    FOREIGN KEY (id_serie_tv) REFERENCES Serie_tv(id_serie_tv),
    FOREIGN KEY (id_profilo) REFERENCES Profili(id_profilo)
);

CREATE TABLE Liste (
    id_profilo INT NOT NULL,
    id_contenuto INT NOT NULL,
    PRIMARY KEY (id_profilo, id_contenuto),
    FOREIGN KEY (id_profilo) REFERENCES Profili(id_profilo),
    FOREIGN KEY (id_contenuto) REFERENCES Contenuti(id_contenuto)
);

-- =========================
-- ARTISTI
-- =========================

CREATE TABLE Artisti (
    id_artista INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL
);

CREATE TABLE Partecipa (
    id_artista INT NOT NULL,
    id_contenuto INT NOT NULL,
    PRIMARY KEY (id_artista, id_contenuto),
    FOREIGN KEY (id_artista) REFERENCES Artisti(id_artista),
    FOREIGN KEY (id_contenuto) REFERENCES Contenuti(id_contenuto)
);

-- =========================
-- LICENZE
-- =========================

CREATE TABLE Licenze (
    id_licenza INT AUTO_INCREMENT PRIMARY KEY,
    tipo_licenza VARCHAR(50),
    data_scadenza DATE,
    territorio VARCHAR(100)
);

CREATE TABLE Soggetto_a (
    id_licenza INT NOT NULL,
    id_contenuto INT NOT NULL,
    PRIMARY KEY (id_licenza, id_contenuto),
    FOREIGN KEY (id_licenza) REFERENCES Licenze(id_licenza),
    FOREIGN KEY (id_contenuto) REFERENCES Contenuti(id_contenuto)
);
