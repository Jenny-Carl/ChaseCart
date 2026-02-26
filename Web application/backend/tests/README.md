# Tests Backend - Capstone Project

Ce dossier contient tous les tests pour le backend de l'application ChaseCart.

## Structure des tests

```
tests/
├── check-apis.js              # Vérification des APIs Firebase
├── diagnose-firebase.js       # Diagnostic complet Firebase
├── performance-test.js        # Tests de performance
├── service-account-test.js    # Test du compte de service
├── testfirestore.js          # Test basique Firestore
├── run-all-tests.js          # Script pour exécuter tous les tests
├── RESUME-COMPLET-TESTS.md   # Documentation complète des tests
└── README.md                 # Ce fichier
```

## Comment exécuter les tests

### Exécuter tous les tests
```bash
cd "Web application/backend"
node tests/run-all-tests.js
```

### Exécuter un test spécifique
```bash
cd "Web application/backend"
node tests/[nom-du-test].js
```

## Tests disponibles

### 1. check-apis.js
**Description :** Vérifie que les APIs Firebase nécessaires sont activées et fournit des instructions pour les activer.

**Usage :**
```bash
node tests/check-apis.js
```

**Ce qu'il fait :**
- Affiche la liste des APIs requis
- Analyse la clé de service account
- Fournit des liens vers les consoles Google Cloud

### 2. testfirestore.js
**Description :** Test basique de lecture de la collection users dans Firestore.

**Usage :**
```bash
node tests/testfirestore.js
```

**Ce qu'il fait :**
- Se connecte à Firebase
- Lit la collection 'users'
- Affiche les utilisateurs trouvés

### 3. diagnose-firebase.js
**Description :** Diagnostic complet de la connexion Firebase avec tests d'écriture et de lecture.

**Usage :**
```bash
node tests/diagnose-firebase.js
```

**Ce qu'il fait :**
- Charge et valide le service account
- Initialise Firebase Admin
- Teste l'écriture/lecture de documents
- Nettoie les données de test

### 4. service-account-test.js
**Description :** Test approfondi de la configuration du compte de service Firebase.

**Usage :**
```bash
node tests/service-account-test.js
```

**Ce qu'il fait :**
- Valide les champs requis du service account
- Teste les opérations admin (listage des collections)
- Teste des méthodes d'authentification alternatives

### 5. performance-test.js
**Description :** Test de performance des opérations Firebase avec métriques détaillées.

**Usage :**
```bash
node tests/performance-test.js
```

**Ce qu'il fait :**
- Mesure le temps d'initialisation
- Teste les performances de lecture/écriture
- Effectue des tests de charge
- Fournit une évaluation de performance

## Prérequis

### Variables d'environnement
Aucune variable d'environnement spécifique n'est requise car les tests utilisent directement le fichier `serviceAccountKey.json`.

### Fichiers requis
- `src/serviceAccountKey.json` : Clé de service Firebase
- `src/firebase.js` : Configuration Firebase

### Dépendances
- `firebase-admin`
- Node.js (version 14+)

## Résolution de problèmes

### Erreur "Cannot find module"
- Vérifiez que vous exécutez les tests depuis le répertoire `backend`
- Assurez-vous que le fichier `src/serviceAccountKey.json` existe

### Erreur UNAUTHENTICATED
- Vérifiez que le service account a les bonnes permissions
- Regénérez la clé de service si nécessaire
- Vérifiez que les APIs Firebase sont activées

### Erreur MODULE_NOT_FOUND pour firebase-admin
```bash
npm install firebase-admin
```

## Scripts npm

Vous pouvez ajouter ces scripts dans votre `package.json` :

```json
{
  "scripts": {
    "test": "node tests/run-all-tests.js",
    "test:firestore": "node tests/testfirestore.js",
    "test:diagnose": "node tests/diagnose-firebase.js",
    "test:performance": "node tests/performance-test.js",
    "test:service": "node tests/service-account-test.js",
    "test:check": "node tests/check-apis.js"
  }
}
```

## Statut des tests

Les tests ont été organisés et les chemins d'importation ont été corrigés. Tous les tests devraient maintenant fonctionner correctement lorsqu'ils sont exécutés depuis le répertoire `backend`.

### Corrections apportées
- ✅ Chemins d'importation corrigés pour `serviceAccountKey.json`
- ✅ Chemins d'importation corrigés pour `firebase.js`
- ✅ Tests organisés dans le dossier `tests/`
- ✅ Script d'exécution globale créé

### Tests validés
- ✅ check-apis.js
- ✅ testfirestore.js
- ✅ diagnose-firebase.js
- ✅ service-account-test.js
- ✅ performance-test.js