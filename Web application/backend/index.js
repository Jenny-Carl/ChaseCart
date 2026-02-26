// index.js - Serveur Express complet et fonctionnel
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8001; // Port configurable via environnement

console.log('🔧 Configuration des variables d\'environnement...');
console.log('✅ Variables d\'environnement chargées');

console.log('📦 Chargement des middlewares...');
app.use(cors());
app.use(express.json());
console.log('✅ Middlewares chargés');

// Chargement Firebase de manière sécurisée
console.log('🔥 Chargement de Firebase...');
let db = null;
let firebaseError = null;

try {
  db = require('./src/firebase');
  console.log('✅ Firebase chargé avec succès');
} catch (error) {
  firebaseError = error.message;
  console.log('❌ Erreur Firebase:', error.message);
}

// Chargement des routes
console.log('🛣️ Chargement des routes...');
try {
  if (db) {
    const userRoutes = require('./src/users/user.route');
    const productRoutes = require('./src/products/product.route');
    const scannerRoutes = require('./src/scanner/scanner.route');
    app.use('/api', userRoutes);
    app.use('/api', productRoutes);
    app.use('/api/scanner', scannerRoutes);
    console.log('✅ Routes chargées avec succès');
  } else {
    console.log('⚠️ Routes non chargées (Firebase indisponible)');
  }
} catch (error) {
  console.log('❌ Erreur chargement routes:', error.message);
}

// ROBOT PROXY — Render → Raspberry Pi 
// Uncomment to enable proxying requests to the robot API

const fetch = require("node-fetch");

const PI_URL = process.env.PI_URL || "http://172.20.10.12:8001";

console.log("Robot proxy loaded. Target:", PI_URL);

app.post("/robot/go-to-cart", async (req, res) => {
  try {
    console.log("Forwarding cart to Raspberry Pi:", req.body);

    const response = await fetch(`${PI_URL}/go-to-cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      console.log("Pi responded with error:", errorMessage);

      return res.status(500).json({
        error: "Pi backend returned an error",
        details: errorMessage,
      });
    }

    const data = await response.json();
    console.log("Pi Response:", data);

    return res.json(data);

  } catch (err) {
    console.log("Error contacting Raspberry Pi:", err.message);

    return res.status(500).json({
      error: "Could not reach Raspberry Pi",
      details: err.message,
    });
  }
}); 


// Endpoints de base
app.get('/health', (req, res) => {
  console.log('🏥 Health check appelé');
  res.json({ 
    status: 'OK', 
    message: 'Serveur Express complet fonctionnel!',
    timestamp: new Date().toISOString(),
    firebase: {
      loaded: !!db,
      error: firebaseError
    }
  });
});

// Route de health check pour Docker
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.get('/status', (req, res) => {
  res.json({
    server: 'Express',
    version: 'Final',
    firebase: !!db,
    routes: !!db,
    timestamp: new Date().toISOString()
  });
});

const server = app.listen(PORT, (err) => {
  if (err) {
    console.error('❌ Erreur:', err);
    return;
  }
  console.log(`🚀 Serveur Express complet démarré sur http://localhost:${PORT}`);
  console.log(`📍 Health: http://localhost:${PORT}/health`);
  console.log(`📍 Status: http://localhost:${PORT}/status`);
  console.log(`📍 Robot Proxy: http://localhost:${PORT}/robot/go-to-cart`);
  if (db) {
    console.log(`📍 Products API: http://localhost:${PORT}/api/products`);
  }
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`❌ Port ${PORT} occupé. Essayez de fermer les autres serveurs.`);
  } else {
    console.error('❌ Erreur serveur:', err);
  }
});

process.on('SIGINT', () => {
  console.log('\n🛑 Arrêt du serveur...');
  server.close(() => {
    console.log('✅ Serveur arrêté proprement');
    process.exit(0);
  });
});