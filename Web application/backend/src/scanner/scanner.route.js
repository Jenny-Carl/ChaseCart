const express = require('express');
const router = express.Router();
const db = require('../firebase');

// Valider un code scanné et récupérer les infos du produit
router.post('/validate-scan-code', async (req, res) => {
  try {
    const { scanCode } = req.body;
    
    if (!scanCode || typeof scanCode !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Code de scan manquant ou invalide'
      });
    }
    
    // Nettoyer le code (enlever espaces, etc.)
    const cleanCode = scanCode.trim().toUpperCase();
    
    console.log(`🔍 Recherche du produit avec le code: ${cleanCode}`);
    
    // Chercher le produit avec ce scanCode
    const productsSnapshot = await db.collection('products')
      .where('scanCode', '==', cleanCode)
      .limit(1)
      .get();
    
    if (productsSnapshot.empty) {
      console.log(`❌ Aucun produit trouvé pour le code: ${cleanCode}`);
      return res.status(404).json({
        success: false,
        message: 'Code de scan non reconnu',
        scanCode: cleanCode
      });
    }
    
    // Récupérer les données du produit
    const productDoc = productsSnapshot.docs[0];
    const productData = productDoc.data();
    
    console.log(`✅ Produit trouvé: ${productData.name}`);
    
    res.json({
      success: true,
      message: 'Code de scan valide',
      product: {
        id: productDoc.id,
        name: productData.name,
        price: productData.price,
        category: productData.category,
        image: productData.image,
        description: productData.description,
        scanCode: productData.scanCode
      },
      scanCode: cleanCode,
      scannedAt: new Date()
    });
    
  } catch (error) {
    console.error('❌ Erreur validation code scan:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la validation',
      error: error.message
    });
  }
});

// Confirmer un produit dans le panier via scan
router.post('/confirm-cart-item', async (req, res) => {
  try {
    const { scanCode, userId, cartId } = req.body;
    
    if (!scanCode || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Code de scan et ID utilisateur requis'
      });
    }
    
    const cleanCode = scanCode.trim().toUpperCase();
    
    // 1. Valider le code scanné
    const productsSnapshot = await db.collection('products')
      .where('scanCode', '==', cleanCode)
      .limit(1)
      .get();
    
    if (productsSnapshot.empty) {
      return res.status(404).json({
        success: false,
        message: 'Code de scan non reconnu'
      });
    }
    
    const productDoc = productsSnapshot.docs[0];
    const productId = productDoc.id;
    const productData = productDoc.data();
    
    // 2. Chercher l'item dans le panier de l'utilisateur
    const cartRef = cartId 
      ? db.collection('carts').doc(cartId)
      : db.collection('users').doc(userId).collection('cart');
    
    let cartItemsSnapshot;
    if (cartId) {
      // Panier avec ID spécifique
      cartItemsSnapshot = await cartRef.collection('items')
        .where('productId', '==', productId)
        .limit(1)
        .get();
    } else {
      // Panier utilisateur
      cartItemsSnapshot = await cartRef
        .where('productId', '==', productId)
        .limit(1)
        .get();
    }
    
    if (cartItemsSnapshot.empty) {
      return res.status(404).json({
        success: false,
        message: `Le produit "${productData.name}" n'est pas dans le panier`,
        product: {
          id: productId,
          name: productData.name
        }
      });
    }
    
    // 3. Marquer l'item comme confirmé
    const cartItemDoc = cartItemsSnapshot.docs[0];
    const cartItemData = cartItemDoc.data();
    
    await cartItemDoc.ref.update({
      confirmed: true,
      confirmedAt: new Date(),
      confirmedBy: 'scan',
      scanCode: cleanCode
    });
    
    console.log(`✅ Produit confirmé dans le panier: ${productData.name}`);
    
    res.json({
      success: true,
      message: `Produit "${productData.name}" confirmé dans le panier`,
      product: {
        id: productId,
        name: productData.name,
        price: productData.price,
        quantity: cartItemData.quantity
      },
      cartItem: {
        ...cartItemData,
        confirmed: true,
        confirmedAt: new Date(),
        confirmedBy: 'scan'
      }
    });
    
  } catch (error) {
    console.error('❌ Erreur confirmation panier:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la confirmation',
      error: error.message
    });
  }
});

// Obtenir le statut du panier (produits confirmés/non confirmés)
router.get('/cart-status/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { cartId } = req.query;
    
    // Récupérer les items du panier
    let cartItemsSnapshot;
    if (cartId) {
      cartItemsSnapshot = await db.collection('carts').doc(cartId).collection('items').get();
    } else {
      cartItemsSnapshot = await db.collection('users').doc(userId).collection('cart').get();
    }
    
    const items = [];
    let confirmedCount = 0;
    let totalItems = 0;
    
    for (const doc of cartItemsSnapshot.docs) {
      const itemData = doc.data();
      
      // Récupérer les détails du produit
      const productDoc = await db.collection('products').doc(itemData.productId).get();
      const productData = productDoc.exists ? productDoc.data() : null;
      
      const item = {
        id: doc.id,
        productId: itemData.productId,
        quantity: itemData.quantity,
        confirmed: itemData.confirmed || false,
        confirmedAt: itemData.confirmedAt || null,
        product: productData ? {
          name: productData.name,
          price: productData.price,
          image: productData.image,
          scanCode: productData.scanCode
        } : null
      };
      
      items.push(item);
      totalItems++;
      if (item.confirmed) confirmedCount++;
    }
    
    res.json({
      success: true,
      cart: {
        userId,
        cartId: cartId || null,
        items,
        summary: {
          totalItems,
          confirmedItems: confirmedCount,
          pendingItems: totalItems - confirmedCount,
          allConfirmed: confirmedCount === totalItems && totalItems > 0
        }
      }
    });
    
  } catch (error) {
    console.error('❌ Erreur statut panier:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du statut',
      error: error.message
    });
  }
});

module.exports = router;