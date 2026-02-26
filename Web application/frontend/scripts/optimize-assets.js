// Script d'optimisation des assets pour Docker (version simplifiée)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class AssetOptimizer {
  
  static copyAssets() {
    const assetsDir = path.join(__dirname, '../src/assets');
    const publicDir = path.join(__dirname, '../public/assets');
    
    // Créer le dossier de destination s'il n'existe pas
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // Copier tous les assets vers public/assets
    const files = fs.readdirSync(assetsDir);
    
    files.forEach(file => {
      const srcPath = path.join(assetsDir, file);
      const destPath = path.join(publicDir, file);
      
      if (fs.statSync(srcPath).isFile()) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied: ${file}`);
      }
    });
  }
  
  static generateAssetList() {
    const assetsDir = path.join(__dirname, '../src/assets');
    const outputPath = path.join(__dirname, '../src/data/assetList.json');
    
    const files = fs.readdirSync(assetsDir);
    const assetList = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.svg', '.webp', '.gif'].includes(ext);
    });
    
    // Créer le dossier data s'il n'existe pas
    const dataDir = path.dirname(outputPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(assetList, null, 2));
    console.log('Asset list generated:', assetList.length, 'files');
  }
}

// Exécuter la préparation des assets
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('Preparing assets for Docker build...');
  AssetOptimizer.copyAssets();
  AssetOptimizer.generateAssetList();
  console.log('Assets preparation completed!');
}

export default AssetOptimizer;