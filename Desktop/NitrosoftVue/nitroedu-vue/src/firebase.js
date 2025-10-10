// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore' 

const firebaseConfig = {
  apiKey: "AIzaSyD_iYpje0F17fF-O26jk-d9ImAEc2fCP_A",
  authDomain: "nitroedu-bbe53.firebaseapp.com",
  databaseURL: "https://nitroedu-bbe53-default-rtdb.firebaseio.com",
  projectId: "nitroedu-bbe53",
  storageBucket: "nitroedu-bbe53.firebasestorage.app",
  messagingSenderId: "758285076680",
  appId: "1:758285076680:web:e99e0cfe93748f1daebdfd"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
