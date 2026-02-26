#!/usr/bin/env node

// Script de test complet pour Docker Assets
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class TestRunner {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      skipped: 0
    };
  }

  async runCommand(command, args = [], options = {}) {
    return new Promise((resolve, reject) => {
      console.log(`🚀 Exécution: ${command} ${args.join(' ')}`);
      
      const proc = spawn(command, args, {
        stdio: 'inherit',
        shell: true,
        ...options
      });

      proc.on('close', (code) => {
        if (code === 0) {
          resolve(code);
        } else {
          reject(new Error(`Command failed with code ${code}`));
        }
      });

      proc.on('error', (error) => {
        reject(error);
      });
    });
  }

  async runTest(testName, testCommand) {
    console.log(`\n📋 Test: ${testName}`);
    console.log('='.repeat(50));
    
    try {
      await this.runCommand('npm', ['run', testCommand]);
      console.log(`✅ ${testName} - RÉUSSI`);
      this.results.passed++;
      return true;
    } catch (error) {
      console.log(`❌ ${testName} - ÉCHEC`);
      console.error(error.message);
      this.results.failed++;
      return false;
    }
  }

  async checkPrerequisites() {
    console.log('🔍 Vérification des prérequis...\n');
    
    // Vérifier Node.js
    try {
      await this.runCommand('node', ['--version']);
      console.log('✅ Node.js disponible');
    } catch (error) {
      throw new Error('Node.js n\'est pas installé');
    }

    // Vérifier npm
    try {
      await this.runCommand('npm', ['--version']);
      console.log('✅ npm disponible');
    } catch (error) {
      throw new Error('npm n\'est pas disponible');
    }

    // Vérifier Docker (optionnel)
    try {
      await this.runCommand('docker', ['--version']);
      console.log('✅ Docker disponible');
      process.env.DOCKER_AVAILABLE = 'true';
    } catch (error) {
      console.log('⚠️  Docker non disponible - tests Docker seront ignorés');
      process.env.DOCKER_AVAILABLE = 'false';
    }

    // Vérifier que les dépendances sont installées
    if (!fs.existsSync('node_modules')) {
      console.log('📦 Installation des dépendances...');
      await this.runCommand('npm', ['install']);
    }
  }

  async runAllTests() {
    console.log('🧪 SUITE DE TESTS DOCKER ASSETS');
    console.log('================================\n');

    try {
      await this.checkPrerequisites();

      console.log('\n🏁 Début des tests...\n');

      // Test des utilitaires d'assets
      await this.runTest('Tests des Assets Utilities', 'test:assets');

      // Test du script d'optimisation
      await this.runTest('Tests du Script d\'Optimisation', 'test:optimize');

      // Tests Docker (si Docker est disponible)
      if (process.env.DOCKER_AVAILABLE === 'true') {
        await this.runTest('Tests Docker Build & Deploy', 'test:docker');
        await this.runTest('Tests d\'Intégration Complète', 'test:integration');
      } else {
        console.log('⏭️  Tests Docker ignorés (Docker non disponible)');
        this.results.skipped += 2;
      }

    } catch (error) {
      console.error('💥 Erreur lors de l\'exécution des tests:', error.message);
      this.results.failed++;
    }

    this.printSummary();
  }

  printSummary() {
    console.log('\n📊 RÉSUMÉ DES TESTS');
    console.log('==================');
    console.log(`✅ Réussis: ${this.results.passed}`);
    console.log(`❌ Échecs: ${this.results.failed}`);
    console.log(`⏭️  Ignorés: ${this.results.skipped}`);
    console.log(`📝 Total: ${this.results.passed + this.results.failed + this.results.skipped}`);

    if (this.results.failed === 0) {
      console.log('\n🎉 Tous les tests sont passés avec succès !');
      process.exit(0);
    } else {
      console.log('\n⚠️  Certains tests ont échoué.');
      process.exit(1);
    }
  }
}

// Exécuter les tests
if (require.main === module) {
  const runner = new TestRunner();
  runner.runAllTests().catch(error => {
    console.error('💥 Erreur fatale:', error.message);
    process.exit(1);
  });
}

module.exports = TestRunner;