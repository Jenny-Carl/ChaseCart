// service-account-test.js
const admin = require('firebase-admin');

async function testServiceAccount() {
  try {
    console.log('🔍 Testing Service Account Configuration...\n');
    
    // Load and validate service account
    const serviceAccount = require('../src/serviceAccountKey.json');
    console.log('Service Account Details:');
    console.log(`  Project ID: ${serviceAccount.project_id}`);
    console.log(`  Client Email: ${serviceAccount.client_email}`);
    console.log(`  Private Key ID: ${serviceAccount.private_key_id}`);
    console.log(`  Auth URI: ${serviceAccount.auth_uri}`);
    console.log(`  Token URI: ${serviceAccount.token_uri}\n`);
    
    // Validate required fields
    const requiredFields = ['type', 'project_id', 'private_key', 'client_email'];
    const missingFields = requiredFields.filter(field => !serviceAccount[field]);
    
    if (missingFields.length > 0) {
      console.error('❌ Missing required fields:', missingFields);
      return;
    }
    console.log('✅ All required service account fields present\n');
    
    // Initialize Firebase Admin with explicit project ID
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id
      });
    }
    console.log('✅ Firebase Admin initialized with explicit project ID\n');
    
    // Test different Firestore operations
    const db = admin.firestore();
    
    // Test 1: Try to list collections (admin operation)
    console.log('Testing admin operations...');
    try {
      const collections = await db.listCollections();
      console.log(`✅ Successfully listed ${collections.length} collections`);
      collections.forEach(col => console.log(`   - ${col.id}`));
    } catch (error) {
      console.log(`❌ Failed to list collections: ${error.message}`);
    }
    
    console.log('\nTesting basic document operations...');
    
    // Test 2: Try a simple document read
    try {
      const testDoc = await db.collection('test').doc('simple-test').get();
      console.log('✅ Simple document read successful');
    } catch (error) {
      console.log(`❌ Simple document read failed: ${error.message}`);
      
      // If this fails, try with a different approach
      console.log('\nTrying alternative authentication method...');
      
      // Alternative: Use environment variable approach
      process.env.GOOGLE_APPLICATION_CREDENTIALS = '../src/serviceAccountKey.json';
      
      const adminAlt = require('firebase-admin');
      if (adminAlt.apps.length <= 1) {
        adminAlt.initializeApp({
          projectId: serviceAccount.project_id
        }, 'alternative');
      }
      
      const dbAlt = adminAlt.app('alternative').firestore();
      try {
        const testDocAlt = await dbAlt.collection('test').doc('alt-test').get();
        console.log('✅ Alternative authentication method worked!');
      } catch (altError) {
        console.log(`❌ Alternative method also failed: ${altError.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Service account test failed:', error.message);
    
    // Provide specific troubleshooting based on error
    if (error.message.includes('UNAUTHENTICATED')) {
      console.log('\n🔧 Troubleshooting UNAUTHENTICATED error:');
      console.log('1. Verify the service account key is valid and not expired');
      console.log('2. Check if the service account has the "Firebase Admin SDK Service Agent" role');
      console.log('3. Ensure Firestore API is enabled for the project');
      console.log('4. Verify the project ID matches your Firebase project');
      console.log('5. Check if the service account was generated for the correct project');
    }
  }
}

testServiceAccount();