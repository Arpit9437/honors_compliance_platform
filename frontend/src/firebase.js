// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "honors-project-4efdb.firebaseapp.com",
  projectId: "honors-project-4efdb",
  storageBucket: "honors-project-4efdb.firebasestorage.app",
  messagingSenderId: "1073705679211",
  appId: "1:1073705679211:web:42355e8b6147763ca0f42e"
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();