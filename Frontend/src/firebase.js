// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "blog-app-mern-ef00e.firebaseapp.com",
  projectId: "blog-app-mern-ef00e",
  storageBucket: "blog-app-mern-ef00e.firebasestorage.app",
  messagingSenderId: "579409779722",
  appId: "1:579409779722:web:ad138587fad2220c6753f3",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
