// Import Firebase SDKs
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDVoLggLqOfezH3O5kUrrZ5nHBOYH7Q7KI",
  authDomain: "safeher-489de.firebaseapp.com",
  projectId: "safeher-489de",
  storageBucket: "safeher-489de.appspot.com",
  messagingSenderId: "738459165140",
  appId: "1:738459165140:web:6befeff60f344470fdb641",
  measurementId: "G-CHHKXHYEML"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Firestore database instance

export { db };
