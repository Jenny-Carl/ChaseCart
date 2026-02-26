# Tests pour Docker Assets

Ce dossier contient tous les tests pour valider la configuration Docker et la gestion des assets.

## Types de Tests

### 1. **Test de Build Docker**
- Validation que l'image Docker se construit correctement
- Vérification que les assets sont inclus

### 2. **Test des Assets** 
- Validation que tous les assets sont présents
- Test de l'utilitaire assets.js

### 3. **Test de Déploiement**
- Validation que le container démarre correctement
- Test des endpoints d'assets

### 4. **Test d'Intégration**
- Test complet Docker + Assets + Application

## Commandes

```bash
# Exécuter tous les tests
npm test

# Test spécifique
npm run test:docker
npm run test:assets
npm run test:integration
```