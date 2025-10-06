// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase config (copy from Firebase Console → Project Settings → Web App SDK snippet)
const firebaseConfig = {
  apiKey: "AIzaSyBVHESkuuE5e2CIJviyPbq-2Jnn8tbJwQw",
  authDomain: "mebrainplanner.firebaseapp.com",
  projectId: "mebrainplanner",
  storageBucket: "mebrainplanner.firebasestorage.app",
  messagingSenderId: "743174659343",
  appId: "1:743174659343:web:de3ece79b3cd49f518f27a",
  measurementId: "G-G6208N8EV4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore database
const db = getFirestore(app);

// Export database
export { db };