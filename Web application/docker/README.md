# ChaseCart Docker Scripts

Scripts essentiels pour le déploiement de l'application ChaseCart.

## 📁 Structure

```
docker/
├── backend/               # Configuration Docker backend
├── frontend/              # Configuration Docker frontend  
├── nginx/                 # Configuration Nginx
├── docker-compose.yml     # Orchestration développement
├── docker-compose.prod.yml # Orchestration production
├── deploy.ps1             # Script de déploiement développement
├── deploy-production.ps1  # Script de déploiement production
├── test-production.ps1    # Test configuration production
├── push.ps1              # Script pour pousser vers Docker Hub
├── test-api.ps1          # Script de test de l'API
├── .env.production       # Template variables production
└── DEPLOYMENT_GUIDE.md   # Guide complet de déploiement
```

## 🚀 Scripts Disponibles

### Développement

#### `deploy.ps1` - Déploiement Développement
Déploie l'application localement pour le développement :
```powershell
.\deploy.ps1
```

#### `test-api.ps1` - Tests de l'API
Teste tous les endpoints et services :
```powershell
.\test-api.ps1
```

### Production

#### `deploy-production.ps1` - Déploiement Production
Déploie l'application sur un serveur de production avec SSL :
```powershell
.\deploy-production.ps1 -Domain "votredomaine.com" -Email "votre@email.com"
```

#### `test-production.ps1` - Test Configuration Production
Teste la configuration de production localement :
```powershell
.\test-production.ps1
```

### Docker Hub

#### `push.ps1` - Publication Docker Hub
Pousse les images vers Docker Hub :
```powershell
.\push.ps1
```

## 🌐 Déploiement sur Domaine Custom

Pour déployer sur www.chasecart.com ou votre domaine :

1. **Consultez le guide complet** : [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

2. **Configuration rapide** :
   ```powershell
   # 1. Configurer les variables
   cp .env.production .env
   # Éditez .env avec vos valeurs Firebase
   
   # 2. Déployer
   .\deploy-production.ps1 -Domain "votredomaine.com" -Email "votre@email.com"
   ```

## 🌐 URLs de l'Application

### Développement
- **Application principale** : http://localhost:80
- **API** : http://localhost:80/api/products
- **Health check** : http://localhost:80/health
- **Frontend direct** : http://localhost:3000
- **Backend direct** : http://localhost:5000

### Production
- **Application principale** : https://votredomaine.com
- **API** : https://votredomaine.com/api/
- **Health check** : https://votredomaine.com/health

## 🛠️ Commandes Docker Utiles

```powershell
# Développement
docker compose logs -f
docker compose down
docker compose restart [service]
docker compose ps

# Production  
docker compose -f docker-compose.prod.yml logs -f
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml restart [service]
docker compose -f docker-compose.prod.yml ps
```

## 🔐 Configuration SSL Automatique

Le déploiement production inclut :
- Certificats SSL Let's Encrypt automatiques
- Redirection HTTP → HTTPS
- Renouvellement automatique des certificats
- Configuration de sécurité moderne

## 📊 Monitoring et Logs

```powershell
# Voir les logs en temps réel
docker compose -f docker-compose.prod.yml logs -f

# Logs spécifiques
docker compose -f docker-compose.prod.yml logs nginx
docker compose -f docker-compose.prod.yml logs backend
docker compose -f docker-compose.prod.yml logs frontend

# Statut des services
docker compose -f docker-compose.prod.yml ps
```