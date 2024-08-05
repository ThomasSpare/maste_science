import { auth } from "../firebaseAuth/firebase.js"; // Ensure this path is correct
import {
  setPersistence,
  browserLocalPersistence,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

setPersistence(auth, browserLocalPersistence)
  .then(() => {
    // Existing and future Auth states are now persisted in the current session only.
    // New sign-in will be persisted with session persistence.
  })
  .catch((error) => {
    console.error("Failed to set persistence:", error);
  });

export async function register(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    throw error; // Rethrow the error to be handled by the caller
  }
}

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

export async function logout() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getAuthStatus() {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(!!user);
    }, reject);
  });
}
