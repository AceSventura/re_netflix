#!/bin/bash

# ================================
# Script per Setup Locale File
# ================================
# Uso: bash setup_files.sh

echo "🎬 Setup Netflix Clone - File Locali"
echo "===================================="

# Crea le cartelle necessarie
echo "📁 Creando cartelle..."
mkdir -p public/videos
mkdir -p public/audio
mkdir -p public/subtitles
mkdir -p data

echo "✅ Cartelle create:"
echo "   - public/videos/"
echo "   - public/audio/"
echo "   - public/subtitles/"

# Crea file di esempio (placeholder)
echo ""
echo "📝 Creando file placeholder..."

# Video placeholder (contenuto minimo per test)
cat > public/videos/.gitkeep << EOF
# Carica i tuoi file video qui
# Formati supportati: .mp4, .webm, .ogv
EOF

cat > public/audio/.gitkeep << EOF
# Carica i tuoi file audio qui
# Formati supportati: .m4a, .mp3, .aac
EOF

cat > public/subtitles/.gitkeep << EOF
# Carica i tuoi file sottotitoli qui
# Formati supportati: .vtt, .srt
EOF

echo "✅ File placeholder creati"

# Istruzioni
echo ""
echo "===================================="
echo "🎯 PROSSIMI PASSI:"
echo "===================================="
echo ""
echo "1️⃣ CARICA I FILE:"
echo "   - Copia i tuoi video in: public/videos/"
echo "   - Copia i tuoi audio in: public/audio/"
echo "   - Copia i tuoi sottotitoli in: public/subtitles/"
echo ""
echo "2️⃣ AGGIORNA IL DATABASE:"
echo "   mysql -u root -p Netflix < data/seed_data.sql"
echo ""
echo "3️⃣ VERIFICA NELLA PAGINA WATCH:"
echo "   http://localhost:3000/watch/1"
echo ""
echo "===================================="
echo "✅ Setup completato!"
