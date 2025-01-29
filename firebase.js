// Import Firebase SDKs
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAaar_mUUrR50scGLgGUP3C6n4c8jO7-ic",

  authDomain: "safeher-d647d.firebaseapp.com",

  projectId: "safeher-d647d",

  storageBucket: "safeher-d647d.firebasestorage.app",

  messagingSenderId: "229117584279",

  appId: "1:229117584279:web:e6f66b64fa97f8841edad2",

  measurementId: "G-RZMTMEM1CJ"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Firestore database instance

export { db };
