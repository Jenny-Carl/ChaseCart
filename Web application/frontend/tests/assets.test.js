// Test des utilitaires d'assets
import { describe, it, expect, beforeAll } from 'vitest';
import { getAssetPath, getAsset, assetFiles } from '../src/utils/assets.js';
import fs from 'fs';
import path from 'path';

describe('Assets Utilities', () => {
  
  describe('getAssetPath', () => {
    it('should return production path when in production mode', () => {
      // Mock production environment
      const originalEnv = import.meta.env;
      import.meta.env = { ...originalEnv, PROD: true };
      
      const result = getAssetPath('test.png');
      expect(result).toBe('/assets/test.png');
      
      // Restore original environment
      import.meta.env = originalEnv;
    });

    it('should return development path when in development mode', () => {
      // Mock development environment
      const originalEnv = import.meta.env;
      import.meta.env = { ...originalEnv, PROD: false };
      
      const result = getAssetPath('test.png');
      expect(result).toBe('/src/assets/test.png');
      
      // Restore original environment
      import.meta.env = originalEnv;
    });
  });

  describe('assetFiles', () => {
    it('should contain all expected asset keys', () => {
      const expectedKeys = [
        'admin', 'avatar', 'cart',
        'card1', 'card2', 'card3',
        'category1', 'category2', 'category3', 'category4',
        'header', 'header2',
        'instagram1', 'instagram2', 'instagram3', 'instagram4', 'instagram5', 'instagram6',
        'supermarket', 'supermarket1', 'pre', 'react', 'githubCover'
      ];
      
      expectedKeys.forEach(key => {
        expect(assetFiles).toHaveProperty(key);
        expect(typeof assetFiles[key]).toBe('string');
      });
    });

    it('should have valid file extensions', () => {
      const validExtensions = ['.png', '.jpg', '.jpeg', '.svg', '.gif', '.webp'];
      
      Object.values(assetFiles).forEach(filename => {
        const ext = path.extname(filename).toLowerCase();
        expect(validExtensions.includes(ext)).toBe(true);
      });
    });
  });

  describe('getAsset', () => {
    it('should return correct asset path for valid keys', () => {
      const result = getAsset('admin');
      expect(result).toContain('admin.png');
    });

    it('should return null for invalid keys', () => {
      const result = getAsset('nonexistent');
      expect(result).toBeNull();
    });

    it('should work with all defined asset keys', () => {
      Object.keys(assetFiles).forEach(key => {
        const result = getAsset(key);
        expect(result).not.toBeNull();
        expect(typeof result).toBe('string');
      });
    });
  });
});

describe('Assets File System', () => {
  const assetsDir = path.join(process.cwd(), 'src', 'assets');

  beforeAll(() => {
    // Vérifier que le dossier assets existe
    expect(fs.existsSync(assetsDir)).toBe(true);
  });

  it('should have all referenced assets in the file system', () => {
    Object.values(assetFiles).forEach(filename => {
      const filePath = path.join(assetsDir, filename);
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });

  it('should not have any unused assets', () => {
    const filesInDir = fs.readdirSync(assetsDir);
    const referencedFiles = Object.values(assetFiles);
    
    filesInDir.forEach(file => {
      if (!['.DS_Store', 'Thumbs.db'].includes(file)) {
        expect(referencedFiles.includes(file)).toBe(true);
      }
    });
  });

  it('should have assets with reasonable file sizes', () => {
    Object.values(assetFiles).forEach(filename => {
      const filePath = path.join(assetsDir, filename);
      const stats = fs.statSync(filePath);
      
      // Assets should not be larger than 5MB
      expect(stats.size).toBeLessThan(5 * 1024 * 1024);
      
      // Assets should not be empty
      expect(stats.size).toBeGreaterThan(0);
    });
  });
});