import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { doc, getFirestore, serverTimestamp, setDoc, getDoc, addDoc, collection, query, where, onSnapshot, orderBy } from "firebase/firestore";

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

//Function to listen in real time the tickets of certain user
export async function subscribeClientTickets(clientId, callback){ // nao entendi callback
  try {
    const ticketsQuery = query(collection(db, "tickets"), where("clientId", "==", clientId), orderBy("createdAt", "desc"))
    const unsubscribe = onSnapshot(ticketsQuery, (snapshot) => { //nao entendi
      const tickets = snapshot.docs.map(doc => ({ //nao entendi
        id: doc.id, //nao entendi
        ...doc.data() //nao entendi
      })) 
      callback(tickets) //nao entendi
    })
    return unsubscribe
  } catch (error) {
    console.error("Error when seaching client's tickets:", error);
    throw error;
  }
}


//this function creates the ticket
//ticketData must be like this
// {
//   title:
//   description:
//   status: "open" "in-progress"
//   priority: "Low" "Medium" "High" "Crucial"
//   clientId:
//   clientName:
//   agentId:
// }
export async function createTicket(ticketData) {
  try {
    const docRef = await addDoc(collection(db, "tickets"), {
      ...ticketData,
      createdAt: serverTimestamp()
    })
    console.log("Ticket created with success.")
    return { success: true, id: docRef.id}
  } catch (error) {
    console.error("Error creating the ticket:", error);
    throw error;
  }
}

//this function sends the new messages in the subcollection. we need ticketId to know what room that message is from
//messageData must be like this
// {
//   text:
//   senderId:
//   senderName:
//   senderRole: "client" "agent"
// }
export async function sendMessages(ticketId, messageData) {
  try {
    const docRef = await addDoc(collection(db, "tickets", ticketId, "messages"), {
      ...messageData,
      createdAt: serverTimestamp()
    })
    console.log("message sent with success.")
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error("Error sending the message:", error);
    throw error;
  }
}