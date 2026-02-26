#!/bin/bash

# Script de build robuste pour Render Static Site
echo "🧹 Nettoyage des dépendances..."
rm -rf node_modules package-lock.json

echo "📦 Installation des dépendances avec cache nettoyé..."
npm cache clean --force

echo "🔧 Installation avec legacy peer deps..."
npm install --legacy-peer-deps

echo "🏗️ Build de l'application..."
npm run build

echo "✅ Build terminé avec succès!"