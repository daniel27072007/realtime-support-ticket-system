import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { doc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)

// function to send registered users to firestore
export async function registerUserFirestore(uid, email, role) {
  try{
    const userRef = doc(db, "users", uid)
    await setDoc(userRef, {
      email: email,
      role: role, //must be "client" or "agent"
      createdAt: serverTimestamp()  
    })
    console.log("Usuário salvo no Firestore com sucesso!");
    return { success: true };
  } catch (error) {
    console.error("Erro ao salvar usuário no Firestore:", error);
    throw error;
  }
}