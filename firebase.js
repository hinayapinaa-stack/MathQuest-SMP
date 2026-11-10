import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Konfigurasi Firebase MathQuest SMP
const firebaseConfig = {
  apiKey: "AIzaSyC4u6geKkTOQkHXmMocgdpf3GJCfoXnRi8",
  authDomain: "mathquest-smp.firebaseapp.com",
  projectId: "mathquest-smp",
  storageBucket: "mathquest-smp.firebasestorage.app",
  messagingSenderId: "1037599149663",
  appId: "1:1037599149663:web:fd5b8c19af6d96b4d455ea",
  measurementId: "G-LLV0SCKQY9"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
