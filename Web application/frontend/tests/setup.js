// Setup pour les tests
import { beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';

// Configuration globale pour les tests
global.TEST_TIMEOUT = 30000;

// Mock de l'environnement Vite si nécessaire
global.import = {
  meta: {
    env: {
      PROD: false,
      DEV: true
    }
  }
};

beforeAll(() => {
  console.log('🧪 Initialisation des tests Docker Assets...');
  
  // Vérifier que nous sommes dans le bon répertoire
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    throw new Error('Tests doivent être exécutés depuis le répertoire frontend');
  }
  
  // Vérifier que Docker est disponible (si les tests Docker sont exécutés)
  if (process.env.RUN_DOCKER_TESTS !== 'false') {
    try {
      require('child_process').execSync('docker --version', { stdio: 'ignore' });
      console.log('✅ Docker détecté');
    } catch (error) {
      console.warn('⚠️  Docker non disponible - certains tests seront ignorés');
      process.env.DOCKER_AVAILABLE = 'false';
    }
  }
});

afterAll(() => {
  console.log('🧹 Nettoyage après les tests...');
  
  // Nettoyer les fichiers temporaires de test
  const tempDirs = ['test-assets', 'test-public', 'test-data'];
  tempDirs.forEach(dir => {
    const dirPath = path.join(process.cwd(), dir);
    if (fs.existsSync(dirPath)) {
      try {
        fs.rmSync(dirPath, { recursive: true, force: true });
        console.log(`🗑️  Supprimé: ${dir}`);
      } catch (error) {
        console.warn(`⚠️  Impossible de supprimer ${dir}:`, error.message);
      }
    }
  });
});