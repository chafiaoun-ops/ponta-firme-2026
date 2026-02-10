import * as firebaseApp from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// PARA O DONO DO APP:
// 1. Vá em console.firebase.google.com
// 2. Crie um projeto novo "Ponta Firme"
// 3. Adicione um App Web
// 4. Copie as configurações e cole abaixo em 'firebaseConfig'
// 5. No console do Firebase, vá em Firestore Database > Rules e altere para:
//    allow read, write: if true; (para teste rápido)

const firebaseConfig = {
  apiKey: "AIzaSyD45uX-2qRvVpPw5vBoK4DnpC-RoSV_gcE",
  authDomain: "ponta-firme-carnaval.firebaseapp.com",
  projectId: "ponta-firme-carnaval",
  storageBucket: "ponta-firme-carnaval.firebasestorage.app",
  messagingSenderId: "671168610299",
  appId: "1:671168610299:web:76760ae3bf384c4bc6d55e"
};

// Check if config is still placeholder
const isConfigured = firebaseConfig.apiKey !== "API_KEY_AQUI";

let db: any = null;

if (isConfigured) {
  try {
    // Use namespace import compatibility with casting to avoid type errors
    // Use (firebaseApp as any).initializeApp to handle potential type definition mismatches
    const app = (firebaseApp as any).initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("Firebase conectado!");
  } catch (e) {
    console.error("Erro ao conectar Firebase:", e);
  }
} else {
  console.warn("Firebase não configurado. Rodando em modo Local (localStorage).");
}

export { db };