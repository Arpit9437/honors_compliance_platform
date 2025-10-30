// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "compliance-platform-eedbb.firebaseapp.com",
  projectId: "compliance-platform-eedbb",
  storageBucket: "compliance-platform-eedbb.firebasestorage.app",
  messagingSenderId: "356962555469",
  appId: "1:356962555469:web:16f06e653103fdd504ae04"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();