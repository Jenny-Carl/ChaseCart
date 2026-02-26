# Dockerfile pour Backend
FROM node:20-alpine

# Installer curl pour le healthcheck
RUN apk add --no-cache curl

# Créer le répertoire de l'application
WORKDIR /app

# Copier les fichiers de configuration
COPY backend/package*.json ./

# Supprimer le package-lock.json pour éviter les conflits
RUN rm -f package-lock.json

# Installer les dépendances (sans --omit=dev pour inclure toutes les dépendances Firebase)
RUN npm install --legacy-peer-deps

# Copier le code source
COPY backend .

# Créer un utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Changer la propriété des fichiers
RUN chown -R nodejs:nodejs /app
USER nodejs

# Exposer le port
EXPOSE 5000

# Variables d'environnement
ENV NODE_ENV=production

# Commande de démarrage
CMD ["npm", "start"]