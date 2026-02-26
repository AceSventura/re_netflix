# ================================
# Setup Script per Netflix Clone
# Windows PowerShell
# ================================
# Uso: .\setup_files.ps1

Write-Host "🎬 Setup Netflix Clone - File Locali" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

# Crea le cartelle necessarie
Write-Host ""
Write-Host "📁 Creando cartelle..." -ForegroundColor Yellow

$folders = @(
    "public/videos",
    "public/audio",
    "public/subtitles",
    "data"
)

foreach ($folder in $folders) {
    if (-not (Test-Path $folder)) {
        New-Item -ItemType Directory -Path $folder | Out-Null
        Write-Host "   ✅ $folder creata" -ForegroundColor Green
    } else {
        Write-Host "   ℹ️  $folder esiste già" -ForegroundColor Gray
    }
}

# Crea file .gitkeep
Write-Host ""
Write-Host "📝 Creando file placeholder..." -ForegroundColor Yellow

$gitkeepFolders = @(
    "public/videos",
    "public/audio",
    "public/subtitles"
)

foreach ($folder in $gitkeepFolders) {
    $gitkeepPath = "$folder/.gitkeep"
    if (-not (Test-Path $gitkeepPath)) {
        "" | Out-File -FilePath $gitkeepPath -Encoding UTF8
        Write-Host "   ✅ $gitkeepPath creato" -ForegroundColor Green
    }
}

# Istruzioni finali
Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "🎯 PROSSIMI PASSI:" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1️⃣ CARICA I FILE:" -ForegroundColor Yellow
Write-Host "   - Copia i tuoi video in: public\videos\" -ForegroundColor White
Write-Host "   - Copia i tuoi audio in: public\audio\" -ForegroundColor White
Write-Host "   - Copia i tuoi sottotitoli in: public\subtitles\" -ForegroundColor White
Write-Host ""
Write-Host "2️⃣ AGGIORNA IL DATABASE:" -ForegroundColor Yellow
Write-Host "   mysql -u root -p Netflix < data\seed_data.sql" -ForegroundColor White
Write-Host ""
Write-Host "3️⃣ VERIFICA NELLA PAGINA WATCH:" -ForegroundColor Yellow
Write-Host "   http://localhost:3000/watch/1" -ForegroundColor White
Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "✅ Setup completato!" -ForegroundColor Green
