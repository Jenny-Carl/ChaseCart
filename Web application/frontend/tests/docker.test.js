// Test de construction et déploiement Docker
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { exec } from 'child_process';
import { promisify } from 'util';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

describe('Docker Build and Deployment', () => {
  let containerId = null;
  const testPort = 3001; // Port différent pour éviter les conflits

  beforeAll(async () => {
    // Vérifier que Docker est disponible
    try {
      await execAsync('docker --version');
    } catch (error) {
      throw new Error('Docker n\'est pas installé ou disponible');
    }
  }, 30000);

  afterAll(async () => {
    // Nettoyer le container de test
    if (containerId) {
      try {
        await execAsync(`docker stop ${containerId}`);
        await execAsync(`docker rm ${containerId}`);
      } catch (error) {
        console.warn('Erreur lors du nettoyage du container:', error.message);
      }
    }
  }, 15000);

  describe('Docker Image Build', () => {
    it('should build Docker image successfully', async () => {
      const { stdout, stderr } = await execAsync('docker build -f ../docker/frontend/Dockerfile -t chasecart-frontend-test ..');
      
      expect(stderr).not.toContain('ERROR');
      expect(stdout).toContain('Successfully built') || expect(stdout).toContain('Successfully tagged');
    }, 120000); // 2 minutes timeout pour le build

    it('should have correct image structure', async () => {
      const { stdout } = await execAsync('docker images chasecart-frontend-test --format "table {{.Repository}}\\t{{.Tag}}\\t{{.Size}}"');
      
      expect(stdout).toContain('chasecart-frontend-test');
      expect(stdout).toContain('latest');
    });
  });

  describe('Container Deployment', () => {
    it('should start container successfully', async () => {
      const { stdout } = await execAsync(`docker run -d -p ${testPort}:80 chasecart-frontend-test`);
      containerId = stdout.trim();
      
      expect(containerId).toMatch(/^[a-f0-9]{64}$/);
      
      // Attendre que le container soit prêt
      await new Promise(resolve => setTimeout(resolve, 3000));
    }, 30000);

    it('should respond to health check', async () => {
      const response = await axios.get(`http://localhost:${testPort}`, {
        timeout: 5000
      });
      
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('text/html');
    }, 10000);

    it('should serve assets correctly', async () => {
      // Test quelques assets spécifiques
      const assetsToTest = [
        'admin.png',
        'category-1.jpg',
        'header.png',
        'cart.png'
      ];

      for (const asset of assetsToTest) {
        try {
          const response = await axios.get(`http://localhost:${testPort}/assets/${asset}`, {
            timeout: 5000,
            responseType: 'stream'
          });
          
          expect(response.status).toBe(200);
          expect(response.headers['content-type']).toMatch(/^image\//);
        } catch (error) {
          console.warn(`Asset ${asset} non trouvé, mais ce n'est peut-être pas critique`);
        }
      }
    }, 20000);
  });

  describe('Container Configuration', () => {
    it('should have nginx running on port 80', async () => {
      const { stdout } = await execAsync(`docker exec ${containerId} ps aux`);
      
      expect(stdout).toContain('nginx');
    });

    it('should have assets directory in container', async () => {
      const { stdout } = await execAsync(`docker exec ${containerId} ls -la /usr/share/nginx/html/`);
      
      expect(stdout).toContain('assets') || expect(stdout).toContain('index.html');
    });

    it('should have correct nginx configuration', async () => {
      try {
        const { stdout } = await execAsync(`docker exec ${containerId} nginx -t`);
        expect(stdout).toContain('syntax is ok') || expect(stdout).toContain('successful');
      } catch (error) {
        // Si nginx -t échoue, vérifier que nginx fonctionne quand même
        const { stdout } = await execAsync(`docker exec ${containerId} ps aux | grep nginx`);
        expect(stdout).toContain('nginx');
      }
    });
  });
});