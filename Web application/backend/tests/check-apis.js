// check-apis.js
// This script helps verify which APIs might need to be enabled

console.log('🔍 API Enablement Checklist for Firebase Project: chasecart-2329d');
console.log('================================================\n');

console.log('Please verify these APIs are enabled in Google Cloud Console:');
console.log('URL: https://console.cloud.google.com/apis/dashboard?project=chasecart-2329d\n');

console.log('Required APIs:');
console.log('✓ Cloud Firestore API');
console.log('✓ Firebase Management API');
console.log('✓ Cloud Resource Manager API');
console.log('✓ Identity and Access Management (IAM) API');
console.log('✓ Service Usage API\n');

console.log('To enable these APIs:');
console.log('1. Go to: https://console.cloud.google.com/apis/library?project=chasecart-2329d');
console.log('2. Search for each API name');
console.log('3. Click "Enable" for each one\n');

console.log('Service Account Permissions Check:');
console.log('=====================================');
console.log('Go to: https://console.cloud.google.com/iam-admin/iam?project=chasecart-2329d');
console.log('Find: firebase-adminsdk-fbsvc@chasecart-2329d.iam.gserviceaccount.com');
console.log('\nRequired roles:');
console.log('✓ Firebase Admin SDK Administrator Service Agent');
console.log('✓ Cloud Datastore User (or Editor/Owner)');
console.log('✓ Service Account Token Creator (if needed)\n');

console.log('Alternative Quick Fix:');
console.log('=====================');
console.log('If you want to test immediately, you can:');
console.log('1. Go to Firebase Console → Project Settings → Service Accounts');
console.log('2. Generate a new private key');
console.log('3. Replace the serviceAccountKey.json file');
console.log('4. This ensures you have the latest key with proper permissions');

// Test if we can at least validate the key format
try {
  const serviceAccount = require('../src/serviceAccountKey.json');
  const keyDateInfo = Buffer.from(serviceAccount.private_key_id, 'hex');
  console.log('\n🔍 Service Account Key Analysis:');
  console.log(`   Key ID: ${serviceAccount.private_key_id}`);
  console.log(`   Generated for: ${serviceAccount.client_email}`);
  console.log(`   Project: ${serviceAccount.project_id}`);
  
  // Check if private key format looks correct
  if (serviceAccount.private_key.includes('BEGIN PRIVATE KEY') && 
      serviceAccount.private_key.includes('END PRIVATE KEY')) {
    console.log('   ✅ Private key format appears valid');
  } else {
    console.log('   ❌ Private key format may be corrupted');
  }
} catch (error) {
  console.log(`❌ Could not analyze service account key: ${error.message}`);
}