// run-all-tests.js
// Script pour exécuter tous les tests du backend

const { spawn } = require('child_process');
const path = require('path');

const tests = [
  {
    name: 'Check APIs',
    file: 'check-apis.js',
    description: 'Vérifie les APIs Firebase et les permissions'
  },
  {
    name: 'Test Firestore',
    file: 'testfirestore.js',
    description: 'Test basique de lecture Firestore'
  },
  {
    name: 'Diagnose Firebase',
    file: 'diagnose-firebase.js',
    description: 'Diagnostic complet de la connexion Firebase'
  },
  {
    name: 'Service Account Test',
    file: 'service-account-test.js',
    description: 'Test de configuration du compte de service'
  },
  {
    name: 'Performance Test',
    file: 'performance-test.js',
    description: 'Test de performance Firebase'
  }
];

console.log('🧪 Exécution de tous les tests backend');
console.log('=====================================\n');

async function runTest(test) {
  return new Promise((resolve, reject) => {
    console.log(`🔄 Exécution du test: ${test.name}`);
    console.log(`📝 Description: ${test.description}`);
    console.log(`📁 Fichier: ${test.file}`);
    console.log('─'.repeat(50));

    const child = spawn('node', [path.join('tests', test.file)], {
      cwd: path.resolve(__dirname, '..'),
      stdio: 'inherit',
      shell: true
    });

    child.on('close', (code) => {
      console.log('\n' + '─'.repeat(50));
      if (code === 0) {
        console.log(`✅ Test "${test.name}" terminé avec succès\n`);
        resolve({ test: test.name, success: true });
      } else {
        console.log(`❌ Test "${test.name}" a échoué (code: ${code})\n`);
        resolve({ test: test.name, success: false, code });
      }
    });

    child.on('error', (error) => {
      console.log(`❌ Erreur lors de l'exécution du test "${test.name}":`, error.message);
      reject(error);
    });
  });
}

async function runAllTests() {
  const results = [];
  
  for (const test of tests) {
    try {
      const result = await runTest(test);
      results.push(result);
    } catch (error) {
      results.push({ test: test.name, success: false, error: error.message });
    }
  }

  // Résumé des résultats
  console.log('\n🎯 RÉSUMÉ DES TESTS');
  console.log('==================');
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Tests réussis: ${successful.length}/${results.length}`);
  console.log(`❌ Tests échoués: ${failed.length}/${results.length}\n`);
  
  if (successful.length > 0) {
    console.log('🟢 Tests réussis:');
    successful.forEach(r => console.log(`   ✅ ${r.test}`));
    console.log('');
  }
  
  if (failed.length > 0) {
    console.log('🔴 Tests échoués:');
    failed.forEach(r => console.log(`   ❌ ${r.test}${r.code ? ` (code: ${r.code})` : ''}`));
    console.log('');
  }
  
  const successRate = (successful.length / results.length) * 100;
  
  if (successRate === 100) {
    console.log('🎉 Tous les tests sont passés avec succès !');
  } else if (successRate >= 80) {
    console.log('🟡 La plupart des tests sont passés.');
  } else {
    console.log('🔴 Plusieurs tests ont échoué. Vérifiez la configuration.');
  }
  
  process.exit(failed.length > 0 ? 1 : 0);
}

runAllTests().catch(error => {
  console.error('❌ Erreur critique:', error);
  process.exit(1);
});