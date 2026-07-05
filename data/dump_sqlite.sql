PRAGMA foreign_keys = ON;
BEGIN TRANSACTION;

CREATE TABLE abbonamenti (
  id_abbonamento INTEGER PRIMARY KEY AUTOINCREMENT,
  piano TEXT NOT NULL,
  costo_mensile REAL NOT NULL
);
INSERT INTO abbonamenti (id_abbonamento, piano, costo_mensile) VALUES
(1, 'Basic', 5.99), (2, 'Standard', 12.99), (3, 'Premium', 19.99), (4, 'Premium', 19.99);

CREATE TABLE artisti (
  id_artista INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL
);
INSERT INTO artisti (id_artista, nome) VALUES
(1, 'Tom Cruise'), (2, 'Scarlett Johansson'), (3, 'Leonardo DiCaprio'), (4, 'Gal Gadot'),
(5, 'Ryan Gosling'), (6, 'Margot Robbie'), (7, 'Christian Bale'), (8, 'Dwayne Johnson');

CREATE TABLE assets_audio (
  id_asset_audio INTEGER PRIMARY KEY AUTOINCREMENT,
  codec TEXT DEFAULT NULL,
  url_traccia TEXT NOT NULL
);
INSERT INTO assets_audio (id_asset_audio, codec, url_traccia) VALUES
(1, 'aac', '/audio/topgun_it.m4a'), (2, 'aac', '/audio/topgun_en.m4a'), (3, 'aac', '/audio/bw_it.m4a'),
(4, 'aac', '/audio/st_s01e01_it.m4a'), (5, 'aac', '/audio/st_s01e02_it.m4a');

CREATE TABLE assets_video (
  id_asset_video INTEGER PRIMARY KEY AUTOINCREMENT,
  bitrate INTEGER DEFAULT NULL,
  codec TEXT DEFAULT NULL,
  url_manifest TEXT NOT NULL
);
INSERT INTO assets_video (id_asset_video, bitrate, codec, url_manifest) VALUES
(1, 2500, 'h.264', '/videos/topgun_maverick.mp4'), (2, 2500, 'h.264', '/videos/black_widow.mp4'),
(3, 2000, 'h.264', '/videos/st_s01e01.mp4'), (4, 2000, 'h.264', '/videos/st_s01e02.mp4');

CREATE TABLE generi (
  id_genere INTEGER PRIMARY KEY AUTOINCREMENT,
  nome_genere TEXT NOT NULL
);
INSERT INTO generi (id_genere, nome_genere) VALUES
(1, 'Azione'), (2, 'Commedia'), (3, 'Drammatico'), (4, 'Horror'),
(5, 'Fantascienza'), (6, 'Thriller'), (7, 'Avventura'), (8, 'Romantico');

CREATE TABLE serie_tv (
  id_serie_tv INTEGER PRIMARY KEY AUTOINCREMENT,
  titolo_serie_tv TEXT NOT NULL
);
INSERT INTO serie_tv (id_serie_tv, titolo_serie_tv) VALUES
(1, 'Breaking Bad'), (2, 'Stranger Things'), (3, 'The Crown'), (4, 'Dark'),
(5, 'Black Mirror'), (6, 'The Witcher'), (7, 'Mindhunter'), (8, 'Succession'),
(9, 'The Bear'), (10, 'Beef'), (11, 'Stranger Things');

CREATE TABLE stagioni (
  id_stagione INTEGER PRIMARY KEY AUTOINCREMENT,
  titolo_stagione TEXT DEFAULT NULL,
  numero_stagione INTEGER NOT NULL,
  id_serie_tv INTEGER NOT NULL,
  FOREIGN KEY (id_serie_tv) REFERENCES serie_tv (id_serie_tv)
);
INSERT INTO stagioni (id_stagione, titolo_stagione, numero_stagione, id_serie_tv) VALUES
(1, 'Principiante', 1, 1), (2, 'Crescita', 2, 1), (3, 'La scomparsa di Will', 1, 2), (4, 'Il ritorno', 2, 2),
(5, 'Primi anni', 1, 3), (6, 'Anni 60', 2, 3), (7, 'Segreti a Winden', 1, 4), (8, 'Viaggi nel tempo', 2, 4),
(9, 'Futuro distopico', 1, 5), (10, 'Scelte morali', 2, 5), (11, 'Il destino', 1, 6), (12, 'Il lupo bianco', 2, 6),
(13, 'Unità criminale', 1, 7), (14, 'Interviste killer', 2, 7), (15, 'Eredità', 1, 8), (16, 'Potere', 2, 8),
(17, 'Il locale', 1, 9), (18, 'La brigata', 2, 9), (19, 'Scontro stradale', 1, 10), (20, 'Vendetta', 2, 10),
(21, 'Stagione 1: L''Avversario', 1, 11);

CREATE TABLE contenuti (
  id_contenuto INTEGER PRIMARY KEY AUTOINCREMENT,
  descrizione TEXT DEFAULT NULL,
  anno_rilascio INTEGER DEFAULT NULL,
  durata INTEGER DEFAULT NULL,
  titolo_contenuto TEXT NOT NULL,
  tipo TEXT CHECK(tipo IN ('episodio','film')) NOT NULL,
  id_stagione INTEGER DEFAULT NULL,
  FOREIGN KEY (id_stagione) REFERENCES stagioni (id_stagione)
);
INSERT INTO contenuti (id_contenuto, descrizione, anno_rilascio, durata, titolo_contenuto, tipo, id_stagione) VALUES
(1, 'Un detective indaga su un mistero.', 2022, 139, 'Glass Onion', 'film', NULL),
(2, 'Un killer anziano ricorda la sua vita.', 2019, 209, 'The Irishman', 'film', NULL),
(3, 'Il ritorno di Jesse Pinkman.', 2019, 122, 'El Camino', 'film', NULL),
(4, 'Due astronomi avvertono il mondo.', 2021, 138, 'Don''t Look Up', 'film', NULL),
(5, 'In un futuro dove non si può guardare.', 2018, 124, 'Bird Box', 'film', NULL),
(6, 'Un truffatore di cuori su Tinder.', 2022, 114, 'Il truffatore di Tinder', 'film', NULL),
(7, 'Un viaggio introspettivo a Roma (Messico).', 2018, 135, 'Roma', 'film', NULL),
(8, 'La storia di un divorzio difficile.', 2019, 137, 'Marriage Story', 'film', NULL),
(9, 'Ragazzi in un campo estivo di robotica.', 2021, 105, 'I Mitchell contro le macchine', 'film', NULL),
(10, 'Un poliziotto e una truffatrice.', 2019, 97, 'Murder Mystery', 'film', NULL),
(11, 'Eroe della guerra in un sottomarino.', 2020, 91, 'Greyhound', 'film', NULL),
(12, 'Dramma storico sulla monarchia.', 2019, 140, 'Il Re', 'film', NULL),
(13, 'Action movie con Chris Hemsworth.', 2020, 117, 'Extraction', 'film', NULL),
(14, 'Un detective a New Orleans.', 2019, 95, 'Project Power', 'film', NULL),
(15, 'Animazione su Babbo Natale.', 2019, 96, 'Klaus', 'film', NULL),
(16, 'Storia di un rapinatore di banche.', 2021, 110, 'Army of the Dead', 'film', NULL),
(17, 'Guerra civile americana futuristica.', 2023, 115, 'Civil War', 'film', NULL),
(18, 'Il mito di Marilyn Monroe.', 2022, 166, 'Blonde', 'film', NULL),
(19, 'Documentario sulla Formula 1.', 2021, 106, 'Schumacher', 'film', NULL),
(20, 'Un mondo governato da orchi.', 2017, 117, 'Bright', 'film', NULL),
(21, 'La vita di una spia.', 2022, 122, 'The Gray Man', 'film', NULL),
(22, 'Sfida tra maghi dell''inganno.', 2022, 118, 'Now You See Me 3', 'film', NULL),
(23, 'Dramma sulla crisi dei rifugiati.', 2022, 126, 'The Swimmers', 'film', NULL),
(24, 'Commedia romantica in Italia.', 2022, 90, 'Love in the Villa', 'film', NULL),
(25, 'Un thriller psicologico in casa.', 2021, 94, 'Il colpevole', 'film', NULL),
(26, 'Guerra di trincea.', 2022, 148, 'Niente di nuovo sul fronte occidentale', 'film', NULL),
(27, 'Horror psicologico spagnolo.', 2019, 94, 'Il buco', 'film', NULL),
(28, 'Indagine su un serial killer.', 2023, 128, 'The Killer', 'film', NULL),
(29, 'Un cuoco stellato torna a casa.', 2023, 102, 'The Menu', 'film', NULL),
(30, 'Documentario sugli oceani.', 2021, 89, 'Seaspiracy', 'film', NULL),
(31, 'Walter scopre la malattia.', 2008, 58, 'Questione di chimica', 'episodio', 1),
(32, 'Smaltimento corpi difficile.', 2008, 48, 'Cat''s in the Bag...', 'episodio', 1),
(33, 'Il primo incontro con Tuco.', 2008, 47, 'Crazy Handful of Nothin''', 'episodio', 1),
(34, 'Sette-Tre-Sette.', 2009, 47, 'Seven-Three-Seven', 'episodio', 2),
(35, 'Giro nel deserto.', 2009, 47, 'Grilled', 'episodio', 2),
(36, 'Better Call Saul (Episodio).', 2009, 47, 'Better Call Saul', 'episodio', 2),
(37, 'Will scompare nel bosco.', 2016, 50, 'Capitolo 1: Will', 'episodio', 3),
(38, 'Undici mangia Eggos.', 2016, 52, 'Capitolo 2: La stramba', 'episodio', 3),
(39, 'Luci di Natale parlanti.', 2016, 49, 'Capitolo 3: Luci', 'episodio', 3),
(40, 'MadMax appare.', 2017, 48, 'Capitolo 1: MadMax', 'episodio', 4),
(41, 'Will ha delle visioni.', 2017, 50, 'Capitolo 2: Halloween', 'episodio', 4),
(42, 'Elisabetta diventa Regina.', 2016, 61, 'Wolferton Splash', 'episodio', 5),
(43, 'Incoronazione solenne.', 2016, 58, 'Fumo negli occhi', 'episodio', 5),
(44, 'Scandalo a corte.', 2017, 56, 'Mister Nightingale', 'episodio', 6),
(45, 'Dove è Mikkel?', 2017, 52, 'Segreti', 'episodio', 7),
(46, 'Il bunker degli anni 80.', 2017, 48, 'Bugie', 'episodio', 7),
(47, 'Adam rivela il piano.', 2019, 54, 'Origini', 'episodio', 8),
(48, 'Social media estremi.', 2016, 63, 'Caduta libera', 'episodio', 9),
(49, 'Test di un videogioco.', 2016, 57, 'Playtest', 'episodio', 9),
(50, 'Programma di appuntamenti.', 2017, 52, 'Hang the DJ', 'episodio', 10),
(51, 'Geralt a Blaviken.', 2019, 61, 'L''inizio della fine', 'episodio', 11),
(52, 'Addestramento a Kaer Morhen.', 2021, 60, 'Tracce', 'episodio', 12),
(53, 'Intervista a Ed Kemper.', 2017, 60, 'Profilo 1', 'episodio', 13),
(54, 'L''omicidio di Atlanta.', 2019, 58, 'Atlanta', 'episodio', 14),
(55, 'Descrizione episodio filler 0', 2024, 45, 'Episodio 0', 'episodio', 1),
(56, 'Descrizione episodio filler 10', 2024, 45, 'Episodio 10', 'episodio', 11),
(57, 'Descrizione episodio filler 20', 2024, 45, 'Episodio 20', 'episodio', 1),
(58, 'Descrizione episodio filler 30', 2024, 45, 'Episodio 30', 'episodio', 11),
(59, 'Descrizione episodio filler 40', 2024, 45, 'Episodio 40', 'episodio', 1),
(60, 'Descrizione episodio filler 1', 2024, 45, 'Episodio 1', 'episodio', 2),
(61, 'Descrizione episodio filler 11', 2024, 45, 'Episodio 11', 'episodio', 12),
(62, 'Descrizione episodio filler 21', 2024, 45, 'Episodio 21', 'episodio', 2),
(63, 'Descrizione episodio filler 31', 2024, 45, 'Episodio 31', 'episodio', 12),
(64, 'Descrizione episodio filler 41', 2024, 45, 'Episodio 41', 'episodio', 2),
(65, 'Descrizione episodio filler 2', 2024, 45, 'Episodio 2', 'episodio', 3),
(66, 'Descrizione episodio filler 12', 2024, 45, 'Episodio 12', 'episodio', 13),
(67, 'Descrizione episodio filler 22', 2024, 45, 'Episodio 22', 'episodio', 3),
(68, 'Descrizione episodio filler 32', 2024, 45, 'Episodio 32', 'episodio', 13),
(69, 'Descrizione episodio filler 42', 2024, 45, 'Episodio 42', 'episodio', 3),
(70, 'Descrizione episodio filler 3', 2024, 45, 'Episodio 3', 'episodio', 4),
(71, 'Descrizione episodio filler 13', 2024, 45, 'Episodio 13', 'episodio', 14),
(72, 'Descrizione episodio filler 23', 2024, 45, 'Episodio 23', 'episodio', 4),
(73, 'Descrizione episodio filler 33', 2024, 45, 'Episodio 33', 'episodio', 14),
(74, 'Descrizione episodio filler 43', 2024, 45, 'Episodio 43', 'episodio', 4),
(75, 'Descrizione episodio filler 4', 2024, 45, 'Episodio 4', 'episodio', 5),
(76, 'Descrizione episodio filler 14', 2024, 45, 'Episodio 14', 'episodio', 15),
(77, 'Descrizione episodio filler 24', 2024, 45, 'Episodio 24', 'episodio', 5),
(78, 'Descrizione episodio filler 34', 2024, 45, 'Episodio 34', 'episodio', 15),
(79, 'Descrizione episodio filler 44', 2024, 45, 'Episodio 44', 'episodio', 5),
(80, 'Descrizione episodio filler 5', 2024, 45, 'Episodio 5', 'episodio', 6),
(81, 'Descrizione episodio filler 15', 2024, 45, 'Episodio 15', 'episodio', 16),
(82, 'Descrizione episodio filler 25', 2024, 45, 'Episodio 25', 'episodio', 6),
(83, 'Descrizione episodio filler 35', 2024, 45, 'Episodio 35', 'episodio', 16),
(84, 'Descrizione episodio filler 45', 2024, 45, 'Episodio 45', 'episodio', 6),
(85, 'Descrizione episodio filler 6', 2024, 45, 'Episodio 6', 'episodio', 7),
(86, 'Descrizione episodio filler 16', 2024, 45, 'Episodio 16', 'episodio', 17),
(87, 'Descrizione episodio filler 26', 2024, 45, 'Episodio 26', 'episodio', 7),
(88, 'Descrizione episodio filler 36', 2024, 45, 'Episodio 36', 'episodio', 17),
(89, 'Descrizione episodio filler 46', 2024, 45, 'Episodio 46', 'episodio', 7),
(90, 'Descrizione episodio filler 7', 2024, 45, 'Episodio 7', 'episodio', 8),
(91, 'Descrizione episodio filler 17', 2024, 45, 'Episodio 17', 'episodio', 18),
(92, 'Descrizione episodio filler 27', 2024, 45, 'Episodio 27', 'episodio', 8),
(93, 'Descrizione episodio filler 37', 2024, 45, 'Episodio 37', 'episodio', 18),
(94, 'Descrizione episodio filler 47', 2024, 45, 'Episodio 47', 'episodio', 8),
(95, 'Descrizione episodio filler 8', 2024, 45, 'Episodio 8', 'episodio', 9),
(96, 'Descrizione episodio filler 18', 2024, 45, 'Episodio 18', 'episodio', 19),
(97, 'Descrizione episodio filler 28', 2024, 45, 'Episodio 28', 'episodio', 9),
(118, 'Maverick torna per una nuova missione dopo 30 anni. Un film adrenalinico con inseguimenti aerei spettacolari.', 2022, 7320, 'Top Gun: Maverick', 'film', NULL),
(119, 'Natasha Romanoff affronta il suo passato come spia prima di diventare un Avenger.', 2021, 6600, 'Black Widow', 'film', NULL),
(120, 'Un ragazzo scompare misteriosamente in una piccola cittadina dell''Indiana.', 2016, 2700, 'Capitolo uno: La Desaparizione di Will Byers', 'episodio', 21),
(121, 'Un ragazzo scomparso riappare in modo misterioso mentre il Sottosopra comincia a manifestarsi.', 2016, 2700, 'Capitolo due: La Porta del Demone', 'episodio', 21);

CREATE TABLE classificato_in (
  id_genere INTEGER NOT NULL,
  id_contenuto INTEGER NOT NULL,
  PRIMARY KEY (id_genere, id_contenuto),
  FOREIGN KEY (id_genere) REFERENCES generi (id_genere),
  FOREIGN KEY (id_contenuto) REFERENCES contenuti (id_contenuto)
);
INSERT INTO classificato_in (id_genere, id_contenuto) VALUES
(1, 118), (1, 119), (5, 120), (5, 121), (6, 119), (6, 120), (6, 121), (7, 118);

CREATE TABLE codificato (
  id_asset_video INTEGER NOT NULL,
  id_contenuto INTEGER NOT NULL,
  PRIMARY KEY (id_asset_video, id_contenuto),
  FOREIGN KEY (id_asset_video) REFERENCES assets_video (id_asset_video),
  FOREIGN KEY (id_contenuto) REFERENCES contenuti (id_contenuto)
);
INSERT INTO codificato (id_asset_video, id_contenuto) VALUES
(1, 118), (2, 119), (3, 120), (4, 121);

CREATE TABLE fatture (
  id_fattura INTEGER PRIMARY KEY AUTOINCREMENT,
  importo REAL NOT NULL,
  FILE TEXT NOT NULL,
  data_emissione DATE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO fatture (id_fattura, importo, FILE, data_emissione, created_at, updated_at) VALUES
(1, 19.99, '/invoices/invoice_001.pdf', '2026-03-31', '2026-03-31 10:05:47', '2026-03-31 10:05:47');

CREATE TABLE utenti (
  id_utente INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  cognome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  data_nascita DATE NOT NULL,
  PASSWORD TEXT NOT NULL
);
INSERT INTO utenti (id_utente, nome, cognome, email, data_nascita, PASSWORD) VALUES
(1, 'Mario', 'Rossi', 'mario.rossi@example.com', '1990-01-15', 'hashedpassword123');

CREATE TABLE profili (
  id_profilo INTEGER PRIMARY KEY AUTOINCREMENT,
  pin_profilo TEXT DEFAULT NULL,
  lingua TEXT DEFAULT NULL,
  nome_profilo TEXT NOT NULL,
  avatar_url TEXT DEFAULT NULL,
  id_utente INTEGER NOT NULL,
  FOREIGN KEY (id_utente) REFERENCES utenti (id_utente)
);
INSERT INTO profili (id_profilo, pin_profilo, lingua, nome_profilo, avatar_url, id_utente) VALUES
(1, '1234', 'Italiano', 'Profilo Mario', 'https://via.placeholder.com/80', 1);

CREATE TABLE guarda (
  durata_visualizzata INTEGER DEFAULT NULL,
  stato_completamento INTEGER DEFAULT NULL,
  id_contenuto INTEGER NOT NULL,
  id_profilo INTEGER NOT NULL,
  PRIMARY KEY (id_contenuto, id_profilo),
  FOREIGN KEY (id_contenuto) REFERENCES contenuti (id_contenuto),
  FOREIGN KEY (id_profilo) REFERENCES profili (id_profilo)
);
INSERT INTO guarda (durata_visualizzata, stato_completamento, id_contenuto, id_profilo) VALUES
(3600, 0, 118, 1), (1350, 0, 120, 1);

CREATE TABLE include (
  id_asset_audio INTEGER NOT NULL,
  id_contenuto INTEGER NOT NULL,
  PRIMARY KEY (id_asset_audio, id_contenuto),
  FOREIGN KEY (id_asset_audio) REFERENCES assets_audio (id_asset_audio),
  FOREIGN KEY (id_contenuto) REFERENCES contenuti (id_contenuto)
);
INSERT INTO include (id_asset_audio, id_contenuto) VALUES
(1, 118), (2, 118), (3, 119), (4, 120), (5, 121);

CREATE TABLE licenze (
  id_licenza INTEGER PRIMARY KEY AUTOINCREMENT,
  tipo_licenza TEXT DEFAULT NULL,
  data_scadenza DATE DEFAULT NULL,
  territorio TEXT DEFAULT NULL
);

CREATE TABLE lingue (
  id_lingua INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL
);
INSERT INTO lingue (id_lingua, nome) VALUES
(1, 'Italiano'), (2, 'Inglese'), (3, 'Spagnolo'), (4, 'Francese'), (5, 'Tedesco');

CREATE TABLE liste (
  id_profilo INTEGER NOT NULL,
  id_contenuto INTEGER NOT NULL,
  PRIMARY KEY (id_profilo, id_contenuto),
  FOREIGN KEY (id_profilo) REFERENCES profili (id_profilo),
  FOREIGN KEY (id_contenuto) REFERENCES contenuti (id_contenuto)
);

CREATE TABLE parlato_in (
  id_lingua INTEGER NOT NULL,
  id_asset_audio INTEGER NOT NULL,
  PRIMARY KEY (id_lingua, id_asset_audio),
  FOREIGN KEY (id_lingua) REFERENCES lingue (id_lingua),
  FOREIGN KEY (id_asset_audio) REFERENCES assets_audio (id_asset_audio)
);
INSERT INTO parlato_in (id_lingua, id_asset_audio) VALUES
(1, 1), (1, 3), (1, 4), (1, 5), (2, 2);

CREATE TABLE partecipa (
  id_artista INTEGER NOT NULL,
  id_contenuto INTEGER NOT NULL,
  PRIMARY KEY (id_artista, id_contenuto),
  FOREIGN KEY (id_artista) REFERENCES artisti (id_artista),
  FOREIGN KEY (id_contenuto) REFERENCES contenuti (id_contenuto)
);
INSERT INTO partecipa (id_artista, id_contenuto) VALUES
(1, 118), (2, 119), (3, 120), (3, 121), (5, 118), (8, 120), (8, 121);

CREATE TABLE salva_film (
  id_film INTEGER NOT NULL,
  id_profilo INTEGER NOT NULL,
  PRIMARY KEY (id_film, id_profilo),
  FOREIGN KEY (id_film) REFERENCES contenuti (id_contenuto),
  FOREIGN KEY (id_profilo) REFERENCES profili (id_profilo)
);
INSERT INTO salva_film (id_film, id_profilo) VALUES
(118, 1), (119, 1);

CREATE TABLE salva_serie (
  id_serie_tv INTEGER NOT NULL,
  id_profilo INTEGER NOT NULL,
  PRIMARY KEY (id_serie_tv, id_profilo),
  FOREIGN KEY (id_serie_tv) REFERENCES serie_tv (id_serie_tv),
  FOREIGN KEY (id_profilo) REFERENCES profili (id_profilo)
);
INSERT INTO salva_serie (id_serie_tv, id_profilo) VALUES
(11, 1);

CREATE TABLE soggetto_a (
  id_licenza INTEGER NOT NULL,
  id_contenuto INTEGER NOT NULL,
  PRIMARY KEY (id_licenza, id_contenuto),
  FOREIGN KEY (id_licenza) REFERENCES licenze (id_licenza),
  FOREIGN KEY (id_contenuto) REFERENCES contenuti (id_contenuto)
);

CREATE TABLE sottoscrizioni (
  id_sottoscrizione INTEGER PRIMARY KEY AUTOINCREMENT,
  data_inizio_sottoscrizione DATE NOT NULL,
  data_scadenza DATE NOT NULL,
  id_utente INTEGER NOT NULL,
  id_abbonamento INTEGER NOT NULL,
  id_fattura INTEGER NOT NULL,
  FOREIGN KEY (id_utente) REFERENCES utenti (id_utente),
  FOREIGN KEY (id_abbonamento) REFERENCES abbonamenti (id_abbonamento),
  FOREIGN KEY (id_fattura) REFERENCES fatture (id_fattura)
);
INSERT INTO sottoscrizioni (id_sottoscrizione, data_inizio_sottoscrizione, data_scadenza, id_utente, id_abbonamento, id_fattura) VALUES
(1, '2026-03-31', '2026-04-30', 1, 3, 1);

CREATE TABLE sottotitoli (
  id_sub INTEGER PRIMARY KEY AUTOINCREMENT,
  url_sub TEXT NOT NULL,
  formato TEXT DEFAULT NULL,
  tipo_traccia TEXT CHECK(tipo_traccia IN ('forzata','completa')) DEFAULT NULL,
  id_contenuto INTEGER NOT NULL,
  FOREIGN KEY (id_contenuto) REFERENCES contenuti (id_contenuto)
);
INSERT INTO sottotitoli (id_sub, url_sub, formato, tipo_traccia, id_contenuto) VALUES
(1, '/subtitles/topgun_it.vtt', 'vtt', 'completa', 118),
(2, '/subtitles/topgun_en.vtt', 'vtt', 'completa', 118),
(3, '/subtitles/bw_it.vtt', 'vtt', 'completa', 119),
(4, '/subtitles/st_s01e01_it.vtt', 'vtt', 'completa', 120),
(5, '/subtitles/st_s01e02_it.vtt', 'vtt', 'completa', 121);

CREATE TABLE tradotto_in (
  id_lingua INTEGER NOT NULL,
  id_sub INTEGER NOT NULL,
  PRIMARY KEY (id_lingua, id_sub),
  FOREIGN KEY (id_lingua) REFERENCES lingue (id_lingua),
  FOREIGN KEY (id_sub) REFERENCES sottotitoli (id_sub)
);
INSERT INTO tradotto_in (id_lingua, id_sub) VALUES
(1, 1), (1, 3), (1, 4), (1, 5), (2, 2);

CREATE TABLE valutazioni (
  id_valutazione INTEGER PRIMARY KEY AUTOINCREMENT,
  punteggio TEXT CHECK(punteggio IN ('Non fa per me','Mi piace','Adoro!')) NOT NULL,
  id_profilo INTEGER NOT NULL,
  id_serie_tv INTEGER DEFAULT NULL,
  id_film INTEGER DEFAULT NULL,
  FOREIGN KEY (id_profilo) REFERENCES profili (id_profilo),
  FOREIGN KEY (id_serie_tv) REFERENCES serie_tv (id_serie_tv),
  FOREIGN KEY (id_film) REFERENCES contenuti (id_contenuto)
);
INSERT INTO valutazioni (id_valutazione, punteggio, id_profilo, id_serie_tv, id_film) VALUES
(1, 'Adoro!', 1, NULL, 118),
(2, 'Mi piace', 1, NULL, 119);

COMMIT;