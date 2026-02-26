# Script PowerShell pour pousser les images vers Docker Hub
# Repository: eapata8/cegcapstoneproject

Write-Host "🚀 Pushing ChaseCart Images to Docker Hub..." -ForegroundColor Green

# Variables
$DOCKER_REGISTRY = "eapata8/cegcapstoneproject"
$TAG = "latest"

# Aller dans le répertoire Docker
Set-Location $PSScriptRoot

# Vérifier si Docker est accessible
try {
    docker info | Out-Null
    Write-Host "✅ Docker daemon accessible" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker n'est pas accessible!" -ForegroundColor Red
    Write-Host "💡 Assurez-vous que Docker Desktop est démarré" -ForegroundColor Yellow
    Read-Host "Appuyez sur Entrée pour continuer..."
    exit 1
}

# Connexion à Docker Hub
Write-Host "🔐 Docker Hub login..." -ForegroundColor Blue
docker login

# Build et push Frontend
Write-Host "📦 Building and pushing Frontend..." -ForegroundColor Blue
docker build -f frontend/Dockerfile -t "${DOCKER_REGISTRY}:frontend-${TAG}" ..
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors du build frontend" -ForegroundColor Red
    Read-Host "Appuyez sur Entrée pour continuer..."
    exit 1
}

# Tag latest pour le frontend
docker tag "${DOCKER_REGISTRY}:frontend-${TAG}" "${DOCKER_REGISTRY}:latest"

# Push frontend
Write-Host "🚀 Pushing Frontend..." -ForegroundColor Blue
docker push "${DOCKER_REGISTRY}:frontend-${TAG}"
docker push "${DOCKER_REGISTRY}:latest"

# Build et push Backend
Write-Host "📦 Building and pushing Backend..." -ForegroundColor Blue
docker build -f backend/Dockerfile -t "${DOCKER_REGISTRY}:backend-${TAG}" ..
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors du build backend" -ForegroundColor Red
    Read-Host "Appuyez sur Entrée pour continuer..."
    exit 1
}

# Push backend
Write-Host "🚀 Pushing Backend..." -ForegroundColor Blue
docker push "${DOCKER_REGISTRY}:backend-${TAG}"

# Afficher le résumé
Write-Host ""
Write-Host "✅ Images successfully pushed to Docker Hub!" -ForegroundColor Green
Write-Host "🌐 Repository: https://hub.docker.com/r/eapata8/cegcapstoneproject" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Pushed images:" -ForegroundColor Blue
Write-Host "   - ${DOCKER_REGISTRY}:frontend-${TAG}" -ForegroundColor Cyan
Write-Host "   - ${DOCKER_REGISTRY}:backend-${TAG}" -ForegroundColor Cyan
Write-Host "   - ${DOCKER_REGISTRY}:latest" -ForegroundColor Cyan

Write-Host ""
Write-Host "🔄 To deploy with these images, run:" -ForegroundColor Yellow
Write-Host "   docker compose pull && docker compose up -d" -ForegroundColor Cyan

Read-Host "Appuyez sur Entrée pour continuer..."