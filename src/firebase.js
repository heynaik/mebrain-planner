// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBVHESkuuE5e2CIJviyPbq-2Jnn8tbJwQw",
  authDomain: "mebrainplanner.firebaseapp.com",
  projectId: "mebrainplanner",
  storageBucket: "mebrainplanner.firebasestorage.app",
  messagingSenderId: "743174659343",
  appId: "1:743174659343:web:de3ece79b3cd49f518f27a",
  measurementId: "G-G6208N8EV4",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();