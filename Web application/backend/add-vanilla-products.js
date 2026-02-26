// Script pour ajouter les produits Vanilla perfume et Vanilla hand cream dans Firebase

const admin = require('firebase-admin');
const path = require('path');

// Charger le service account key
const serviceAccount = require('./src/serviceAccountKey.json');

// Initialiser Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'chasecart-2329d.appspot.com'
  });
}

const db = admin.firestore();

// Nouveaux produits à ajouter
const newProducts = [
  {
    name: 'Vanilla Perfume',
    category: 'personal-care',
    description: 'Luxurious vanilla-scented perfume with long-lasting fragrance. Perfect for daily wear with notes of warm vanilla and subtle floral undertones.',
    price: 24.99,
    oldPrice: 29.99,
    image: 'https://uottawa-my.sharepoint.com/personal/rapat078_uottawa_ca/_layouts/15/guestaccess.aspx?share=EftLZ5JKFn9MuQj10iNquqYBGcGn721zEn8e-IWIppiDVQ&e=o7RKWa',
    author: 'ChaseCart Admin',
    scanCode: 'VANILLA-PERF-001',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    name: 'Vanilla Hand Cream',
    category: 'personal-care',
    description: 'Nourishing vanilla hand cream that hydrates and softens skin. Enriched with shea butter and vitamin E for ultimate moisturization.',
    price: 8.99,
    oldPrice: 12.99,
    image: 'https://uottawa-my.sharepoint.com/personal/rapat078_uottawa_ca/_layouts/15/guestaccess.aspx?share=Ea9kEIVeqORJhw7GXzCzjFcBCHetHKUoq0qV0j5sfPCiYg&e=b5siu7',
    author: 'ChaseCart Admin',
    scanCode: 'VANILLA-HAND-002',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }
];

// Fonction pour ajouter les produits
async function addProducts() {
  console.log('🚀 Starting to add products to Firebase...\n');
  
  try {
    const results = [];
    
    for (const product of newProducts) {
      console.log(`📦 Adding product: ${product.name}`);
      
      // Ajouter le produit à Firestore
      const docRef = await db.collection('products').add(product);
      
      console.log(`✅ Product "${product.name}" added with ID: ${docRef.id}`);
      console.log(`   - Category: ${product.category}`);
      console.log(`   - Price: $${product.price}`);
      console.log(`   - Scan Code: ${product.scanCode}\n`);
      
      results.push({
        id: docRef.id,
        name: product.name,
        success: true
      });
    }
    
    console.log('✨ All products added successfully!\n');
    console.log('📊 Summary:');
    results.forEach(result => {
      console.log(`   ✓ ${result.name} (ID: ${result.id})`);
    });
    
    console.log('\n🔍 You can now search for these products in your app!');
    console.log('   - Search by name: "vanilla"');
    console.log('   - Browse category: "personal-care"');
    console.log('   - Scan codes: VANILLA-PERF-001, VANILLA-HAND-002');
    
  } catch (error) {
    console.error('❌ Error adding products:', error);
    throw error;
  } finally {
    // Fermer la connexion
    process.exit(0);
  }
}

// Exécuter le script
console.log('═══════════════════════════════════════════════════');
console.log('  ChaseCart - Add Vanilla Products Script');
console.log('═══════════════════════════════════════════════════\n');

addProducts().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
