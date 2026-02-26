// Utilitaire simple pour les assets dans Docker
export const getAssetPath = (filename) => {
  // En production (Docker), les assets sont servis depuis /assets/
  if (import.meta.env.PROD) {
    return `/assets/${filename}`;
  }
  // En développement, utiliser le chemin local
  return `/src/assets/${filename}`;
};

// Assets disponibles
export const assetFiles = {
  // UI Elements
  admin: 'admin.png',
  avatar: 'avatar.png',
  cart: 'cart.png',
  
  // Cards
  card1: 'card-1.png',
  card2: 'card-2.png', 
  card3: 'card-3.png',
  
  // Categories
  category1: 'category-1.jpg',
  category2: 'category-2.jpg',
  category3: 'category-3.jpg',
  category4: 'category-4.jpg',
  
  // Headers
  header: 'header.png',
  header2: 'header2.png',
  
  // Instagram
  instagram1: 'instagram-1.jpg',
  instagram2: 'instagram-2.jpg',
  instagram3: 'instagram-3.jpg',
  instagram4: 'instagram-4.jpg',
  instagram5: 'instagram-5.jpg',
  instagram6: 'instagram-6.jpg',
  
  // Other
  supermarket: 'supermarket.jpg',
  supermarket1: 'supermarket1.png',
  pre: 'pre.svg',
  react: 'react.svg',
  githubCover: 'github-cover.png'
};

// Helper pour obtenir une URL d'asset
export const getAsset = (assetKey) => {
  const filename = assetFiles[assetKey];
  return filename ? getAssetPath(filename) : null;
};