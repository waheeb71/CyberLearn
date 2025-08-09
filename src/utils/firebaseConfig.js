// firebaseConfig.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database"; // لازم تضيف هذا

const firebaseConfig = {
  apiKey: "AIzaSyBcOvpfciwEx5_ieBNqqXCApmeUfU3UIHI",
  authDomain: "cyberlirn.firebaseapp.com",
  projectId: "cyberlirn",
  storageBucket: "cyberlirn.firebasestorage.app",
  messagingSenderId: "388613022037",
  databaseURL: "https://cyberlirn-default-rtdb.firebaseio.com",
  appId: "1:388613022037:web:8c26f10bb1ed561bbd4fdc",
  measurementId: "G-H9MW9HHSHX"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
export const database = getDatabase(app);
export { db };
