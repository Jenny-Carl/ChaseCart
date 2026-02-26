// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Votre configuration Firebase Web
const firebaseConfig = {
  apiKey: "AIzaSyD0zh_y0_4QJWQXWqPvOdGjHE3Ua31ixnA",
  authDomain: "chasecart-2329d.firebaseapp.com",
  projectId: "chasecart-2329d",
  storageBucket: "chasecart-2329d.firebasestorage.app",
  messagingSenderId: "895944263153",
  appId: "1:895944263153:web:03f83c344334b7b97db050",
  measurementId: "G-1M6WPJMBKP"
};

// Initialise Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);      
export const db = getFirestore(app);   
export const analytics = getAnalytics(app);
export function useAuth() {
  return auth;
}
