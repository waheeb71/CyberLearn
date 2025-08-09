// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {

apiKey: "AIzaSyBcOvpfciwEx5_ieBNqqXCApmeUfU3UIHI",
  authDomain: "cyberlirn.firebaseapp.com",
  projectId: "cyberlirn",
  storageBucket: "cyberlirn.firebasestorage.app",
  messagingSenderId: "388613022037",
  appId: "1:388613022037:web:8c26f10bb1ed561bbd4fdc",
  measurementId: "G-H9MW9HHSHX"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
