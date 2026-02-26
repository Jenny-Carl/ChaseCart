// firebase.js
const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config(); // charge les variables depuis .env

try {
  let credential;

  // Method 1: Use individual environment variables (recommended for Render)
  if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
    console.log('Using Firebase credentials from individual environment variables');
    const serviceAccount = {
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID || "chasecart-2329d",
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
      universe_domain: "googleapis.com"
    };
    credential = admin.credential.cert(serviceAccount);
  }
  // Method 2: Use JSON string (backup method)
  else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    console.log('Using Firebase credentials from JSON environment variable');
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    credential = admin.credential.cert(serviceAccount);
  } 
  // Method 3: Fallback to service account file (for local development)
  else {
    console.log('Using Firebase credentials from serviceAccountKey.json file');
    const serviceAccount = require('./serviceAccountKey.json');
    credential = admin.credential.cert(serviceAccount);
  }
  
  admin.initializeApp({
    credential: credential
  });
  
  console.log('Firebase Admin initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase Admin:', error.message);
  console.error('Make sure Firebase environment variables are set correctly on Render');
  process.exit(1);
}

const db = admin.firestore();

module.exports = db;
