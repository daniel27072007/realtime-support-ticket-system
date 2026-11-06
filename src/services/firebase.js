import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { doc, getFirestore, serverTimestamp, setDoc, getDoc } from "firebase/firestore";

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
export async function registerUserFirestore(uid, username, email, role) {
  try{
    const userRef = doc(db, "users", uid)
    await setDoc(userRef, {
      username: username,
      email: email,
      role: role, //must be "client" or "agent"
      createdAt: serverTimestamp()  
    })
    console.log("User saved in Firestore with success");
    return { success: true };
  } catch (error) {
    console.error("Error when trying to save user in Firestore:", error);
    throw error;
  }
}

//function to log registered users at dashboard
export async function loginUserFirestore(uid, email, password) {
  
}

//function to search the role of the user by uid
export async function getUserRole(uid) {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return userSnap.data().role;
    }
    return "client";
  } catch (error) {
    console.error("Error fetching user role:", error);
    throw error;
  }
}