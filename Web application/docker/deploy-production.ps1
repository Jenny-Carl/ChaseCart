# Script PowerShell pour déploiement en production ChaseCart
# Usage: .\deploy-production.ps1

param(
    [string]$Domain = "chasecart.com",
    [string]$Email = ""
)

Write-Host "🚀 Déploiement ChaseCart en Production" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Vérifier que nous sommes dans le bon répertoire
if (-not (Test-Path "docker-compose.prod.yml")) {
    Write-Host "❌ Erreur: docker-compose.prod.yml non trouvé" -ForegroundColor Red
    Write-Host "Assurez-vous d'être dans le répertoire docker/" -ForegroundColor Red
    exit 1
}

# Vérifier que le fichier .env existe
if (-not (Test-Path ".env")) {
    Write-Host "❌ Erreur: Fichier .env non trouvé" -ForegroundColor Red
    Write-Host "Copiez .env.production vers .env et configurez vos variables" -ForegroundColor Red
    exit 1
}

Write-Host "📦 1. Construction des images Docker..." -ForegroundColor Yellow
docker compose -f docker-compose.prod.yml build --no-cache

Write-Host "🔄 2. Arrêt des services existants..." -ForegroundColor Yellow
docker compose -f docker-compose.prod.yml down

Write-Host "🏗️  3. Création des répertoires nécessaires..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "ssl", "ssl-challenge", "logs" | Out-Null

Write-Host "🔐 4. Configuration SSL initiale..." -ForegroundColor Yellow
# Démarrage temporaire nginx sans SSL pour Let's Encrypt
docker compose -f docker-compose.prod.yml up -d nginx

Write-Host "⏳ Attente que nginx soit prêt..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host "📜 5. Génération des certificats SSL..." -ForegroundColor Yellow
if ($Email -ne "") {
    $env:CERTBOT_EMAIL = $Email
}
docker compose -f docker-compose.prod.yml run --rm certbot

Write-Host "🔄 6. Redémarrage avec SSL..." -ForegroundColor Yellow
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d

Write-Host "⏳ 7. Vérification du déploiement..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Tests de santé
Write-Host "🔍 Tests de santé..." -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri "https://$Domain/health" -Method GET -TimeoutSec 10 | Out-Null
    Write-Host "✅ Backend: OK" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend: ERREUR" -ForegroundColor Red
}

try {
    Invoke-WebRequest -Uri "https://$Domain" -Method GET -TimeoutSec 10 | Out-Null
    Write-Host "✅ Frontend: OK" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend: ERREUR" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 Déploiement terminé!" -ForegroundColor Green
Write-Host "🌐 Votre application est disponible à: https://$Domain" -ForegroundColor Cyan
Write-Host "📊 API: https://$Domain/api/" -ForegroundColor Cyan
Write-Host "💚 Health: https://$Domain/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Commandes utiles:" -ForegroundColor Yellow
Write-Host "   - Voir les logs: docker compose -f docker-compose.prod.yml logs -f"
Write-Host "   - Redémarrer: docker compose -f docker-compose.prod.yml restart"
Write-Host "   - Arrêter: docker compose -f docker-compose.prod.yml down"