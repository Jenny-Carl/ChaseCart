// Test du script d'optimisation des assets
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import AssetOptimizer from '../scripts/optimize-assets.js';

describe('Asset Optimization Script', () => {
  const testAssetsDir = path.join(process.cwd(), 'test-assets');
  const testPublicDir = path.join(process.cwd(), 'test-public');
  const testDataDir = path.join(process.cwd(), 'test-data');

  beforeAll(() => {
    // Créer un environnement de test avec quelques assets fictifs
    if (!fs.existsSync(testAssetsDir)) {
      fs.mkdirSync(testAssetsDir, { recursive: true });
    }

    // Créer quelques fichiers de test
    const testFiles = [
      { name: 'test-image.png', content: 'fake-png-content' },
      { name: 'test-photo.jpg', content: 'fake-jpg-content' },
      { name: 'test-icon.svg', content: '<svg>test</svg>' },
      { name: 'readme.txt', content: 'not an image' }
    ];

    testFiles.forEach(file => {
      fs.writeFileSync(path.join(testAssetsDir, file.name), file.content);
    });
  });

  afterAll(() => {
    // Nettoyer les fichiers de test
    [testAssetsDir, testPublicDir, testDataDir].forEach(dir => {
      if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
      }
    });
  });

  describe('copyAssets method', () => {
    it('should copy assets to public directory', () => {
      // Mock des chemins pour le test
      const originalJoin = path.join;
      path.join = (...args) => {
        if (args.includes('../src/assets')) {
          return testAssetsDir;
        }
        if (args.includes('../public/assets')) {
          return testPublicDir;
        }
        return originalJoin(...args);
      };

      AssetOptimizer.copyAssets();

      // Vérifier que les fichiers ont été copiés
      expect(fs.existsSync(testPublicDir)).toBe(true);
      expect(fs.existsSync(path.join(testPublicDir, 'test-image.png'))).toBe(true);
      expect(fs.existsSync(path.join(testPublicDir, 'test-photo.jpg'))).toBe(true);

      // Restaurer path.join
      path.join = originalJoin;
    });

    it('should maintain file content integrity', () => {
      const originalFile = path.join(testAssetsDir, 'test-image.png');
      const copiedFile = path.join(testPublicDir, 'test-image.png');

      const originalContent = fs.readFileSync(originalFile, 'utf8');
      const copiedContent = fs.readFileSync(copiedFile, 'utf8');

      expect(originalContent).toBe(copiedContent);
    });
  });

  describe('generateAssetList method', () => {
    it('should generate asset list JSON file', () => {
      // Mock des chemins pour le test
      const originalJoin = path.join;
      path.join = (...args) => {
        if (args.includes('../src/assets')) {
          return testAssetsDir;
        }
        if (args.includes('../src/data/assetList.json')) {
          return path.join(testDataDir, 'assetList.json');
        }
        if (args.includes('../src/data')) {
          return testDataDir;
        }
        return originalJoin(...args);
      };

      AssetOptimizer.generateAssetList();

      // Vérifier que le fichier JSON a été créé
      const assetListPath = path.join(testDataDir, 'assetList.json');
      expect(fs.existsSync(assetListPath)).toBe(true);

      // Vérifier le contenu
      const assetList = JSON.parse(fs.readFileSync(assetListPath, 'utf8'));
      expect(Array.isArray(assetList)).toBe(true);
      expect(assetList).toContain('test-image.png');
      expect(assetList).toContain('test-photo.jpg');
      expect(assetList).toContain('test-icon.svg');
      expect(assetList).not.toContain('readme.txt'); // Pas un fichier image

      // Restaurer path.join
      path.join = originalJoin;
    });

    it('should only include image files', () => {
      const assetListPath = path.join(testDataDir, 'assetList.json');
      const assetList = JSON.parse(fs.readFileSync(assetListPath, 'utf8'));

      assetList.forEach(filename => {
        const ext = path.extname(filename).toLowerCase();
        expect(['.jpg', '.jpeg', '.png', '.svg', '.webp', '.gif']).toContain(ext);
      });
    });
  });

  describe('Error handling', () => {
    it('should handle missing source directory gracefully', () => {
      const nonExistentDir = path.join(process.cwd(), 'non-existent-assets');
      
      // Mock pour pointer vers un dossier inexistant
      const originalJoin = path.join;
      path.join = (...args) => {
        if (args.includes('../src/assets')) {
          return nonExistentDir;
        }
        return originalJoin(...args);
      };

      expect(() => {
        AssetOptimizer.generateAssetList();
      }).toThrow();

      // Restaurer path.join
      path.join = originalJoin;
    });
  });
});