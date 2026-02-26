#!/bin/bash

# Script de déploiement pour la production ChaseCart
# Usage: ./deploy-production.sh

set -e

echo "🚀 Déploiement ChaseCart en Production"
echo "====================================="

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "docker-compose.prod.yml" ]; then
    echo "❌ Erreur: docker-compose.prod.yml non trouvé"
    echo "Assurez-vous d'être dans le répertoire docker/"
    exit 1
fi

# Vérifier que le fichier .env existe
if [ ! -f ".env" ]; then
    echo "❌ Erreur: Fichier .env non trouvé"
    echo "Copiez .env.production vers .env et configurez vos variables"
    exit 1
fi

# Charger les variables d'environnement
source .env

echo "📦 1. Construction des images Docker..."
docker compose -f docker-compose.prod.yml build --no-cache

echo "🔄 2. Arrêt des services existants..."
docker compose -f docker-compose.prod.yml down

echo "🏗️  3. Création des répertoires nécessaires..."
mkdir -p ssl ssl-challenge logs

echo "🔐 4. Configuration SSL initiale..."
# Démarrage temporaire nginx sans SSL pour Let's Encrypt
docker compose -f docker-compose.prod.yml up -d nginx

echo "⏳ Attente que nginx soit prêt..."
sleep 10

echo "📜 5. Génération des certificats SSL..."
docker compose -f docker-compose.prod.yml run --rm certbot

echo "🔄 6. Redémarrage avec SSL..."
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d

echo "⏳ 7. Vérification du déploiement..."
sleep 30

# Tests de santé
echo "🔍 Tests de santé..."
if curl -f https://$DOMAIN/health > /dev/null 2>&1; then
    echo "✅ Backend: OK"
else
    echo "❌ Backend: ERREUR"
fi

if curl -f https://$DOMAIN > /dev/null 2>&1; then
    echo "✅ Frontend: OK"
else
    echo "❌ Frontend: ERREUR"
fi

echo ""
echo "🎉 Déploiement terminé!"
echo "🌐 Votre application est disponible à: https://$DOMAIN"
echo "📊 API: https://$DOMAIN/api/"
echo "💚 Health: https://$DOMAIN/health"
echo ""
echo "📋 Commandes utiles:"
echo "   - Voir les logs: docker compose -f docker-compose.prod.yml logs -f"
echo "   - Redémarrer: docker compose -f docker-compose.prod.yml restart"
echo "   - Arrêter: docker compose -f docker-compose.prod.yml down"