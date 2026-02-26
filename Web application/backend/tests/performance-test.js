// performance-test.js
const { performance } = require('perf_hooks');

async function performanceTest() {
  console.log('🚀 Test de Performance Firebase\n');
  console.log('==============================\n');
  
  // Test 1: Temps d'initialisation Firebase
  console.log('📊 Test 1: Initialisation Firebase');
  const startInit = performance.now();
  
  const admin = require('firebase-admin');
  const serviceAccount = require('../src/serviceAccountKey.json');
  
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }
  
  const db = admin.firestore();
  const endInit = performance.now();
  const initTime = (endInit - startInit).toFixed(2);
  console.log(`   ⏱️  Temps d'initialisation: ${initTime} ms\n`);
  
  // Test 2: Temps de lecture des utilisateurs
  console.log('📊 Test 2: Lecture collection users');
  const startRead = performance.now();
  
  try {
    const snapshot = await db.collection('users').get();
    const endRead = performance.now();
    const readTime = (endRead - startRead).toFixed(2);
    
    console.log(`   ⏱️  Temps de lecture: ${readTime} ms`);
    console.log(`   📄 Nombre d'utilisateurs: ${snapshot.size}`);
    console.log(`   📊 Temps par utilisateur: ${(readTime / snapshot.size).toFixed(2)} ms/utilisateur\n`);
    
    // Test 3: Temps d'écriture d'un document test
    console.log('📊 Test 3: Écriture document test');
    const startWrite = performance.now();
    
    await db.collection('test').doc('performance-test').set({
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      message: 'Performance test',
      testId: Math.random().toString(36).substr(2, 9)
    });
    
    const endWrite = performance.now();
    const writeTime = (endWrite - startWrite).toFixed(2);
    console.log(`   ⏱️  Temps d'écriture: ${writeTime} ms\n`);
    
    // Test 4: Temps de lecture du document test
    console.log('📊 Test 4: Lecture document test');
    const startReadDoc = performance.now();
    
    const testDoc = await db.collection('test').doc('performance-test').get();
    
    const endReadDoc = performance.now();
    const readDocTime = (endReadDoc - startReadDoc).toFixed(2);
    console.log(`   ⏱️  Temps de lecture document: ${readDocTime} ms`);
    console.log(`   ✅ Document existant: ${testDoc.exists}\n`);
    
    // Test 5: Temps de suppression
    console.log('📊 Test 5: Suppression document test');
    const startDelete = performance.now();
    
    await db.collection('test').doc('performance-test').delete();
    
    const endDelete = performance.now();
    const deleteTime = (endDelete - startDelete).toFixed(2);
    console.log(`   ⏱️  Temps de suppression: ${deleteTime} ms\n`);
    
    // Test 6: Test de charge multiple (5 opérations simultanées)
    console.log('📊 Test 6: Test de charge (5 lectures simultanées)');
    const startBatch = performance.now();
    
    const promises = [];
    for (let i = 0; i < 5; i++) {
      promises.push(db.collection('users').limit(1).get());
    }
    
    await Promise.all(promises);
    
    const endBatch = performance.now();
    const batchTime = (endBatch - startBatch).toFixed(2);
    console.log(`   ⏱️  Temps pour 5 lectures simultanées: ${batchTime} ms`);
    console.log(`   📊 Temps moyen par lecture: ${(batchTime / 5).toFixed(2)} ms\n`);
    
    // Résumé des performances
    const totalTime = endBatch - startInit;
    console.log('🎯 RÉSUMÉ DES PERFORMANCES');
    console.log('==========================');
    console.log(`⏱️  Temps total du test: ${totalTime.toFixed(2)} ms`);
    console.log(`🚀 Initialisation: ${initTime} ms`);
    console.log(`📖 Lecture collection: ${readTime} ms`);
    console.log(`✍️  Écriture: ${writeTime} ms`);
    console.log(`📄 Lecture document: ${readDocTime} ms`);
    console.log(`🗑️  Suppression: ${deleteTime} ms`);
    console.log(`⚡ Charge multiple: ${batchTime} ms`);
    
    // Évaluation de la performance
    console.log('\n📈 ÉVALUATION DE LA PERFORMANCE');
    console.log('================================');
    
    if (totalTime < 2000) {
      console.log('🟢 EXCELLENT - Firebase très performant');
    } else if (totalTime < 5000) {
      console.log('🟡 BON - Performance acceptable');
    } else {
      console.log('🔴 LENT - Peut nécessiter une optimisation');
    }
    
    if (readTime < 500) {
      console.log('🟢 Lecture très rapide');
    } else if (readTime < 1000) {
      console.log('🟡 Lecture acceptable');
    } else {
      console.log('🔴 Lecture lente');
    }
    
  } catch (error) {
    console.error('❌ Erreur pendant le test de performance:', error.message);
  }
}

// Exécuter le test
performanceTest().then(() => {
  console.log('\n✅ Test de performance terminé');
  process.exit(0);
}).catch(error => {
  console.error('❌ Erreur:', error);
  process.exit(1);
});