//  firbase initializeApplication
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";

// firebase auth functions
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

// firebase firestore functios
import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCUtz5awB6XDshCTzKUw_PWnc8ePw0pjhw",
  authDomain: "signup-in-form.firebaseapp.com",
  projectId: "signup-in-form",
  storageBucket: "signup-in-form.appspot.com",
  messagingSenderId: "433404649375",
  appId: "1:433404649375:web:ce4a6fd684b408bc0567aa",
  measurementId: "G-FFB80YSSZG",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// export of the variables
export {
  app,
  auth,
  db,
  getFirestore,
  collection,
  addDoc,
  setDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
};
