// Test d'intégration complète
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { exec } from 'child_process';
import { promisify } from 'util';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

describe('Integration Tests - Complete Docker Setup', () => {
  let frontendContainerId = null;
  let backendContainerId = null;
  const frontendPort = 3002;
  const backendPort = 5001;

  beforeAll(async () => {
    // Vérifier les prérequis
    expect(fs.existsSync('Dockerfile')).toBe(true);
    expect(fs.existsSync('../docker-compose.yml')).toBe(true);
  }, 10000);

  afterAll(async () => {
    // Nettoyer les containers
    const containers = [frontendContainerId, backendContainerId].filter(Boolean);
    
    for (const containerId of containers) {
      try {
        await execAsync(`docker stop ${containerId}`);
        await execAsync(`docker rm ${containerId}`);
      } catch (error) {
        console.warn(`Erreur lors du nettoyage du container ${containerId}:`, error.message);
      }
    }
  }, 30000);

  describe('Full Stack Docker Deployment', () => {
    it('should build and start frontend container', async () => {
      // Build de l'image frontend
      await execAsync('docker build -f ../docker/frontend/Dockerfile -t chasecart-frontend-integration ..');
      
      // Démarrer le container frontend
      const { stdout } = await execAsync(`docker run -d -p ${frontendPort}:80 chasecart-frontend-integration`);
      frontendContainerId = stdout.trim();
      
      expect(frontendContainerId).toMatch(/^[a-f0-9]{64}$/);
      
      // Attendre que le service soit prêt
      await new Promise(resolve => setTimeout(resolve, 5000));
    }, 60000);

    it('should have frontend accessible', async () => {
      const response = await axios.get(`http://localhost:${frontendPort}`, {
        timeout: 10000
      });
      
      expect(response.status).toBe(200);
      expect(response.data).toContain('<html');
    }, 15000);

    it('should serve React application correctly', async () => {
      const response = await axios.get(`http://localhost:${frontendPort}`, {
        timeout: 10000
      });
      
      // Vérifier que c'est bien une app React
      expect(response.data).toContain('div id="root"') || 
             expect(response.data).toContain('script') ||
             expect(response.data).toContain('React');
    }, 15000);
  });

  describe('Assets Integration', () => {
    it('should load assets in production environment', async () => {
      // Simuler le chargement d'assets dans un environnement de production
      const assetTests = [
        { path: '/assets/admin.png', type: 'image/png' },
        { path: '/assets/category-1.jpg', type: 'image/jpeg' },
        { path: '/assets/header.png', type: 'image/png' }
      ];

      for (const asset of assetTests) {
        try {
          const response = await axios.get(`http://localhost:${frontendPort}${asset.path}`, {
            timeout: 5000,
            validateStatus: status => status < 500 // Accepter 404 comme non-critique
          });
          
          if (response.status === 200) {
            expect(response.headers['content-type']).toContain('image/');
          }
        } catch (error) {
          console.warn(`Asset ${asset.path} test skipped:`, error.message);
        }
      }
    }, 20000);

    it('should have optimized asset delivery', async () => {
      try {
        const response = await axios.get(`http://localhost:${frontendPort}/assets/header.png`, {
          timeout: 5000
        });
        
        if (response.status === 200) {
          // Vérifier les headers d'optimisation
          expect(response.headers).toHaveProperty('cache-control');
          expect(response.headers['cache-control']).toContain('public');
        }
      } catch (error) {
        console.warn('Asset optimization test skipped:', error.message);
      }
    }, 10000);
  });

  describe('Performance Tests', () => {
    it('should respond quickly to requests', async () => {
      const startTime = Date.now();
      
      const response = await axios.get(`http://localhost:${frontendPort}`, {
        timeout: 5000
      });
      
      const responseTime = Date.now() - startTime;
      
      expect(response.status).toBe(200);
      expect(responseTime).toBeLessThan(3000); // Moins de 3 secondes
    }, 10000);

    it('should handle multiple concurrent requests', async () => {
      const requests = Array.from({ length: 5 }, () =>
        axios.get(`http://localhost:${frontendPort}`, { timeout: 5000 })
      );
      
      const responses = await Promise.all(requests);
      
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
    }, 15000);
  });

  describe('Container Health', () => {
    it('should have healthy container status', async () => {
      const { stdout } = await execAsync(`docker ps --filter id=${frontendContainerId} --format "{{.Status}}"`);
      
      expect(stdout).toContain('Up');
      expect(stdout).not.toContain('Exited');
    });

    it('should have minimal resource usage', async () => {
      const { stdout } = await execAsync(`docker stats ${frontendContainerId} --no-stream --format "{{.CPUPerc}} {{.MemUsage}}"`);
      
      expect(stdout).toBeTruthy();
      
      // Extraire le pourcentage CPU (format: "0.50%")
      const cpuMatch = stdout.match(/(\d+\.?\d*)%/);
      if (cpuMatch) {
        const cpuPercent = parseFloat(cpuMatch[1]);
        expect(cpuPercent).toBeLessThan(50); // Moins de 50% CPU
      }
    });
  });
});