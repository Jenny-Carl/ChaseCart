// diagnose-firebase.js
const admin = require('firebase-admin');

async function diagnoseFirebase() {
  try {
    console.log('🔍 Diagnosing Firebase connection...\n');
    
    // Test 1: Check service account loading
    console.log('1. Loading service account...');
    const serviceAccount = require('../src/serviceAccountKey.json');
    console.log('✅ Service account loaded');
    console.log(`   Project ID: ${serviceAccount.project_id}`);
    console.log(`   Client Email: ${serviceAccount.client_email}\n`);
    
    // Test 2: Initialize Firebase Admin
    console.log('2. Initializing Firebase Admin...');
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    }
    console.log('✅ Firebase Admin initialized\n');
    
    // Test 3: Get Firestore instance
    console.log('3. Getting Firestore instance...');
    const db = admin.firestore();
    console.log('✅ Firestore instance created\n');
    
    // Test 4: Try to access Firestore (simple collection list)
    console.log('4. Testing Firestore access...');
    
    // Try to create a test document first
    console.log('   a) Attempting to write a test document...');
    const testRef = db.collection('test').doc('connection-test');
    await testRef.set({
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      message: 'Connection test',
      source: 'diagnose-firebase.js'
    });
    console.log('   ✅ Test document written successfully');
    
    // Try to read it back
    console.log('   b) Attempting to read the test document...');
    const testDoc = await testRef.get();
    if (testDoc.exists) {
      console.log('   ✅ Test document read successfully');
      console.log('   📄 Document data:', testDoc.data());
    } else {
      console.log('   ⚠️  Test document not found');
    }
    
    // Try to read from users collection
    console.log('   c) Attempting to read users collection...');
    const usersSnapshot = await db.collection('users').limit(1).get();
    console.log(`   ✅ Users collection accessible (${usersSnapshot.size} documents found)`);
    
    // Clean up test document
    console.log('   d) Cleaning up test document...');
    await testRef.delete();
    console.log('   ✅ Test document deleted\n');
    
    console.log('🎉 All Firebase tests passed! Connection is working properly.');
    
  } catch (error) {
    console.error('❌ Firebase diagnosis failed:');
    console.error(`   Error: ${error.message}`);
    console.error(`   Code: ${error.code}`);
    
    if (error.code === 16) {
      console.log('\n💡 Suggestions for UNAUTHENTICATED error:');
      console.log('   1. Check Firestore security rules in Firebase Console');
      console.log('   2. Verify service account has proper permissions');
      console.log('   3. Ensure project is active and billing is enabled');
      console.log('   4. Check if Firestore is enabled for this project');
    }
  }
}

diagnoseFirebase();