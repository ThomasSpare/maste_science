import { auth } from "../firebaseAuth/firebase.js"; // Ensure this path is correct

import { createUserWithEmailAndPassword } from "firebase/auth";

import { signInWithEmailAndPassword, signOut } from "firebase/auth";

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
