import { auth, db } from "../firebaseAuth/firebase.js"; // Ensure this path is correct
import { doc, setDoc } from "firebase/firestore";
import {
  setPersistence,
  browserLocalPersistence,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

// Set persistence to browser local persistence
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    // Existing and future Auth states are now persisted in the current session only.
    // New sign-in will be persisted with session persistence.
  })
  .catch((error) => {
    console.error("Failed to set persistence:", error);
  });

// Register a new user with email and password
export async function register(email, password) {
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Log user creation success
    console.log("User created successfully:", user);

    // Store user data in Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
    });

    // Log Firestore document creation success
    console.log("User data stored in Firestore successfully");

    return user;
  } catch (error) {
    // Log errors
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    throw error; // Rethrow the error to be handled by the caller
  }
}

// Sign in with Google
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const userCredential = await signInWithPopup(auth, provider);
    return userCredential.user;
  } catch (error) {
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    throw error; // Rethrow the error to be handled by the caller
  }
};

// Login with email and password
export async function login(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Logout the current user
export async function logout() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Get the current authentication status
export async function getAuthStatus() {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(!!user);
    }, reject);
  });
}
