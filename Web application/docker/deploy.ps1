# Script de déploiement ChaseCart - Déploiement ordonné
# Démarre le backend, puis le frontend, puis nginx avec vérifications

Write-Host "🚀 Déploiement de ChaseCart..." -ForegroundColor Green

# Aller dans le répertoire Docker
Set-Location $PSScriptRoot

# Vérifier si Docker est installé
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker trouvé: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker n'est pas installé ou pas accessible!" -ForegroundColor Red
    exit 1
}

# Arrêter les containers existants
Write-Host "🛑 Arrêt des containers existants..." -ForegroundColor Blue
docker compose down

# Rebuild si nécessaire
$rebuild = Read-Host "Rebuilder les images? (y/N)"
if ($rebuild -eq "y" -or $rebuild -eq "Y") {
    Write-Host "🔨 Rebuild du backend..." -ForegroundColor Blue
    docker compose build backend
    
    Write-Host "🔨 Rebuild du frontend..." -ForegroundColor Blue
    docker compose build frontend
}

# Démarrer le backend en premier
Write-Host "🚀 Démarrage du backend..." -ForegroundColor Blue
docker compose up -d backend

# Attendre que le backend soit prêt
Write-Host "⏳ Attente que le backend soit prêt..." -ForegroundColor Yellow
$backendReady = $false
$maxAttempts = 30
$attempts = 0

while (-not $backendReady -and $attempts -lt $maxAttempts) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5000/health" -UseBasicParsing -TimeoutSec 2
        if ($response.StatusCode -eq 200) {
            $backendReady = $true
            Write-Host "✅ Backend prêt!" -ForegroundColor Green
        }
    } catch {
        $attempts++
        Write-Host "⏳ Tentative $attempts/$maxAttempts..." -ForegroundColor Yellow
        Start-Sleep -Seconds 2
    }
}

if (-not $backendReady) {
    Write-Host "❌ Le backend n'est pas prêt après $maxAttempts tentatives" -ForegroundColor Red
    docker compose logs backend
    exit 1
}

# Démarrer le frontend
Write-Host "🎨 Démarrage du frontend..." -ForegroundColor Blue
docker compose up -d frontend

# Démarrer nginx
Write-Host "🌐 Démarrage du reverse proxy..." -ForegroundColor Blue
docker compose up -d nginx

# Attendre un peu pour la stabilisation
Write-Host "⏳ Stabilisation des services..." -ForegroundColor Blue
Start-Sleep -Seconds 5

# Vérifier le statut final
Write-Host "📊 Statut des services:" -ForegroundColor Blue
docker compose ps

# Vérifier les services
Write-Host "`n🔍 Vérification des services..." -ForegroundColor Blue

# Test Backend
try {
    $backendResponse = Invoke-WebRequest -Uri "http://localhost:5000/health" -UseBasicParsing
    Write-Host "✅ Backend: Réponse OK (Code: $($backendResponse.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend: Erreur de connexion" -ForegroundColor Red
}

# Test Frontend
try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing
    Write-Host "✅ Frontend: Réponse OK (Code: $($frontendResponse.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend: Erreur de connexion" -ForegroundColor Red
}

# Afficher les URLs d'accès
Write-Host "`n🌐 Application URLs:" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "Nginx:    http://localhost:80" -ForegroundColor Cyan

Write-Host "`n📝 Commandes utiles:" -ForegroundColor Yellow
Write-Host "   docker compose logs -f          # Voir les logs" -ForegroundColor Cyan
Write-Host "   docker compose down             # Arrêter" -ForegroundColor Cyan
Write-Host "   docker compose restart          # Redémarrer" -ForegroundColor Cyan

Write-Host "`n🎉 Déploiement terminé!" -ForegroundColor Green
Read-Host "Appuyez sur Entrée pour continuer..."