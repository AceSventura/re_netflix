-- ================================
-- NETFLIX CLONE - DATI DI ESEMPIO
-- ================================

USE Netflix;

-- ========================
-- LINGUE
-- ========================
INSERT INTO Lingue (nome) VALUES 
('Italiano'),
('Inglese'),
('Spagnolo'),
('Francese'),
('Tedesco');

-- ========================
-- GENERI
-- ========================
INSERT INTO Generi (nome_genere) VALUES 
('Azione'),
('Commedia'),
('Drammatico'),
('Horror'),
('Fantascienza'),
('Thriller'),
('Avventura'),
('Romantico');

-- ========================
-- ARTISTI / ATTORI
-- ========================
INSERT INTO Artisti (nome) VALUES 
('Tom Cruise'),
('Scarlett Johansson'),
('Leonardo DiCaprio'),
('Gal Gadot'),
('Ryan Gosling'),
('Margot Robbie'),
('Christian Bale'),
('Dwayne Johnson');

-- ========================
-- ABBONAMENTI
-- ========================
INSERT INTO Abbonamenti (piano, costo_mensile) VALUES 
('Basic', 5.99),
('Standard', 12.99),
('Premium', 19.99);

-- ========================
-- FILM 1: TOP GUN MAVERICK
-- ========================
INSERT INTO Contenuti (titolo_contenuto, descrizione, anno_rilascio, durata, tipo)
VALUES (
    'Top Gun: Maverick',
    'Maverick torna per una nuova missione dopo 30 anni. Un film adrenalinico con inseguimenti aerei spettacolari.',
    2022,
    7320,
    'film'
);

SET @film_id_1 = LAST_INSERT_ID();

-- Video
INSERT INTO Assets_video (bitrate, codec, url_manifest)
VALUES (2500, 'h.264', '/videos/topgun_maverick.mp4');

SET @video_id_1 = LAST_INSERT_ID();

INSERT INTO Codificato (id_asset_video, id_contenuto)
VALUES (@video_id_1, @film_id_1);

-- Audio Italiano
INSERT INTO Assets_audio (codec, url_traccia)
VALUES ('aac', '/audio/topgun_it.m4a');

SET @audio_id_1_it = LAST_INSERT_ID();

INSERT INTO Include (id_asset_audio, id_contenuto)
VALUES (@audio_id_1_it, @film_id_1);

INSERT INTO Parlato_in (id_lingua, id_asset_audio)
VALUES (1, @audio_id_1_it);

-- Audio Inglese
INSERT INTO Assets_audio (codec, url_traccia)
VALUES ('aac', '/audio/topgun_en.m4a');

SET @audio_id_1_en = LAST_INSERT_ID();

INSERT INTO Include (id_asset_audio, id_contenuto)
VALUES (@audio_id_1_en, @film_id_1);

INSERT INTO Parlato_in (id_lingua, id_asset_audio)
VALUES (2, @audio_id_1_en);

-- Sottotitoli Italiano
INSERT INTO Sottotitoli (url_sub, formato, tipo_traccia, id_contenuto)
VALUES ('/subtitles/topgun_it.vtt', 'vtt', 'completa', @film_id_1);

SET @sub_id_1_it = LAST_INSERT_ID();

INSERT INTO Tradotto_in (id_lingua, id_sub)
VALUES (1, @sub_id_1_it);

-- Sottotitoli Inglese
INSERT INTO Sottotitoli (url_sub, formato, tipo_traccia, id_contenuto)
VALUES ('/subtitles/topgun_en.vtt', 'vtt', 'completa', @film_id_1);

SET @sub_id_1_en = LAST_INSERT_ID();

INSERT INTO Tradotto_in (id_lingua, id_sub)
VALUES (2, @sub_id_1_en);

-- Generi
INSERT INTO Classificato_in (id_genere, id_contenuto)
VALUES 
(1, @film_id_1),  -- Azione
(7, @film_id_1);  -- Avventura

-- Cast
INSERT INTO Partecipa (id_artista, id_contenuto)
VALUES 
(1, @film_id_1),  -- Tom Cruise
(5, @film_id_1);  -- Ryan Gosling

-- ========================
-- FILM 2: BLACK WIDOW
-- ========================
INSERT INTO Contenuti (titolo_contenuto, descrizione, anno_rilascio, durata, tipo)
VALUES (
    'Black Widow',
    'Natasha Romanoff affronta il suo passato come spia prima di diventare un Avenger.',
    2021,
    6600,
    'film'
);

SET @film_id_2 = LAST_INSERT_ID();

-- Video
INSERT INTO Assets_video (bitrate, codec, url_manifest)
VALUES (2500, 'h.264', '/videos/black_widow.mp4');

SET @video_id_2 = LAST_INSERT_ID();

INSERT INTO Codificato (id_asset_video, id_contenuto)
VALUES (@video_id_2, @film_id_2);

-- Audio Italiano
INSERT INTO Assets_audio (codec, url_traccia)
VALUES ('aac', '/audio/bw_it.m4a');

SET @audio_id_2_it = LAST_INSERT_ID();

INSERT INTO Include (id_asset_audio, id_contenuto)
VALUES (@audio_id_2_it, @film_id_2);

INSERT INTO Parlato_in (id_lingua, id_asset_audio)
VALUES (1, @audio_id_2_it);

-- Sottotitoli
INSERT INTO Sottotitoli (url_sub, formato, tipo_traccia, id_contenuto)
VALUES ('/subtitles/bw_it.vtt', 'vtt', 'completa', @film_id_2);

SET @sub_id_2_it = LAST_INSERT_ID();

INSERT INTO Tradotto_in (id_lingua, id_sub)
VALUES (1, @sub_id_2_it);

-- Generi
INSERT INTO Classificato_in (id_genere, id_contenuto)
VALUES 
(1, @film_id_2),  -- Azione
(6, @film_id_2);  -- Thriller

-- Cast
INSERT INTO Partecipa (id_artista, id_contenuto)
VALUES 
(2, @film_id_2);  -- Scarlett Johansson

-- ========================
-- SERIE TV: STRANGER THINGS
-- ========================
INSERT INTO Serie_tv (titolo_serie_tv)
VALUES ('Stranger Things');

SET @serie_id_1 = LAST_INSERT_ID();

-- Stagione 1
INSERT INTO Stagioni (titolo_stagione, numero_stagione, id_serie_tv)
VALUES ('Stagione 1: L\'Avversario', 1, @serie_id_1);

SET @season_id_1 = LAST_INSERT_ID();

-- Episodio 1
INSERT INTO Contenuti (titolo_contenuto, descrizione, anno_rilascio, durata, tipo, id_stagione)
VALUES (
    'Capitolo uno: La Desaparizione di Will Byers',
    'Un ragazzo scompare misteriosamente in una piccola cittadina dell\'Indiana.',
    2016,
    2700,
    'episodio',
    @season_id_1
);

SET @ep_id_1 = LAST_INSERT_ID();

-- Video
INSERT INTO Assets_video (bitrate, codec, url_manifest)
VALUES (2000, 'h.264', '/videos/st_s01e01.mp4');

SET @video_id_3 = LAST_INSERT_ID();

INSERT INTO Codificato (id_asset_video, id_contenuto)
VALUES (@video_id_3, @ep_id_1);

-- Audio
INSERT INTO Assets_audio (codec, url_traccia)
VALUES ('aac', '/audio/st_s01e01_it.m4a');

SET @audio_id_3 = LAST_INSERT_ID();

INSERT INTO Include (id_asset_audio, id_contenuto)
VALUES (@audio_id_3, @ep_id_1);

INSERT INTO Parlato_in (id_lingua, id_asset_audio)
VALUES (1, @audio_id_3);

-- Sottotitoli
INSERT INTO Sottotitoli (url_sub, formato, tipo_traccia, id_contenuto)
VALUES ('/subtitles/st_s01e01_it.vtt', 'vtt', 'completa', @ep_id_1);

SET @sub_id_3 = LAST_INSERT_ID();

INSERT INTO Tradotto_in (id_lingua, id_sub)
VALUES (1, @sub_id_3);

-- Generi
INSERT INTO Classificato_in (id_genere, id_contenuto)
VALUES 
(5, @ep_id_1),  -- Fantascienza
(6, @ep_id_1);  -- Thriller

-- Cast
INSERT INTO Partecipa (id_artista, id_contenuto)
VALUES 
(3, @ep_id_1),  -- Leonardo DiCaprio (per example)
(8, @ep_id_1);  -- Dwayne Johnson

-- Episodio 2
INSERT INTO Contenuti (titolo_contenuto, descrizione, anno_rilascio, durata, tipo, id_stagione)
VALUES (
    'Capitolo due: La Porta del Demone',
    'Un ragazzo scomparso riappare in modo misterioso mentre il Sottosopra comincia a manifestarsi.',
    2016,
    2700,
    'episodio',
    @season_id_1
);

SET @ep_id_2 = LAST_INSERT_ID();

-- Video
INSERT INTO Assets_video (bitrate, codec, url_manifest)
VALUES (2000, 'h.264', '/videos/st_s01e02.mp4');

SET @video_id_4 = LAST_INSERT_ID();

INSERT INTO Codificato (id_asset_video, id_contenuto)
VALUES (@video_id_4, @ep_id_2);

-- Audio
INSERT INTO Assets_audio (codec, url_traccia)
VALUES ('aac', '/audio/st_s01e02_it.m4a');

SET @audio_id_4 = LAST_INSERT_ID();

INSERT INTO Include (id_asset_audio, id_contenuto)
VALUES (@audio_id_4, @ep_id_2);

INSERT INTO Parlato_in (id_lingua, id_asset_audio)
VALUES (1, @audio_id_4);

-- Sottotitoli
INSERT INTO Sottotitoli (url_sub, formato, tipo_traccia, id_contenuto)
VALUES ('/subtitles/st_s01e02_it.vtt', 'vtt', 'completa', @ep_id_2);

SET @sub_id_4 = LAST_INSERT_ID();

INSERT INTO Tradotto_in (id_lingua, id_sub)
VALUES (1, @sub_id_4);

-- Generi
INSERT INTO Classificato_in (id_genere, id_contenuto)
VALUES 
(5, @ep_id_2),  -- Fantascienza
(6, @ep_id_2);  -- Thriller

INSERT INTO Partecipa (id_artista, id_contenuto)
VALUES 
(3, @ep_id_2),
(8, @ep_id_2);

-- ========================
-- UTENTI E PROFILI (TEST)
-- ========================
INSERT INTO Utenti (nome, cognome, email, data_nascita, password)
VALUES (
    'Mario',
    'Rossi',
    'mario.rossi@example.com',
    '1990-01-15',
    'hashedpassword123'
);

SET @user_id_1 = LAST_INSERT_ID();

INSERT INTO Profili (pin_profilo, lingua, nome_profilo, avatar_url, id_utente)
VALUES (
    '1234',
    'Italiano',
    'Profilo Mario',
    'https://via.placeholder.com/80',
    @user_id_1
);

SET @profile_id_1 = LAST_INSERT_ID();

-- ========================
-- SAVE FILM (TEST)
-- ========================
INSERT INTO Salva_film (id_film, id_profilo)
VALUES 
(@film_id_1, @profile_id_1),
(@film_id_2, @profile_id_1);

-- ========================
-- SAVE SERIE (TEST)
-- ========================
INSERT INTO Salva_serie (id_serie_tv, id_profilo)
VALUES 
(@serie_id_1, @profile_id_1);

-- ========================
-- SOTTOSCRIZIONE (TEST)
-- ========================
INSERT INTO Abbonamenti (piano, costo_mensile)
SELECT piano, costo_mensile FROM Abbonamenti
WHERE piano = 'Premium'
LIMIT 1;

INSERT INTO Fatture (importo, file, data_emissione)
VALUES (
    19.99,
    '/invoices/invoice_001.pdf',
    CURDATE()
);

SET @invoice_id = LAST_INSERT_ID();

INSERT INTO Sottoscrizioni (
    data_inizio_sottoscrizione,
    data_scadenza,
    id_utente,
    id_abbonamento,
    id_fattura
) VALUES (
    CURDATE(),
    DATE_ADD(CURDATE(), INTERVAL 30 DAY),
    @user_id_1,
    3,  -- Premium
    @invoice_id
);

-- ========================
-- WATCH HISTORY (TEST)
-- ========================
INSERT INTO Guarda (durata_visualizzata, stato_completamento, id_contenuto, id_profilo)
VALUES 
(3600, false, @film_id_1, @profile_id_1),  -- Guardati 60 minuti di Top Gun
(1350, false, @ep_id_1, @profile_id_1);    -- Guardati 22.5 minuti di Stranger Things

-- ========================
-- VALUTAZIONI (TEST)
-- ========================
INSERT INTO Valutazioni (punteggio, id_profilo, id_film)
VALUES 
('Adoro!', @profile_id_1, @film_id_1),
('Mi piace', @profile_id_1, @film_id_2);

-- ========================
-- FINE
-- ========================
COMMIT;

SELECT 'DATI INSERITI CORRETTAMENTE! ✅' as Stato;

-- Verifica i dati
SELECT COUNT(*) as TotaleFilm FROM Contenuti WHERE tipo = 'film';
SELECT COUNT(*) as TotaleEpisodi FROM Contenuti WHERE tipo = 'episodio';
SELECT COUNT(*) as TotaleSerie FROM Serie_tv;
SELECT COUNT(*) as TotaleUtenti FROM Utenti;
