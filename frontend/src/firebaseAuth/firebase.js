// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // Import for Firebase Authentication

// Your web app's Firebase configuration
// Use Damrec configuration
const firebaseConfig = {
  apiKey: "AIzaSyCedsMmvgzXvEdEhbqncvlrxLBXxbtk9WU",
  authDomain: "maste-a24d6.firebaseapp.com",
  projectId: "maste-a24d6",
  storageBucket: "maste-a24d6.appspot.com",
  messagingSenderId: "941498169499",
  appId: "1:941498169499:web:745a445230b8b8b8f1ae3e",
  measurementId: "G-0P5JE8HC4Q",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // Initialize Firebase Authentication

export { auth, analytics, app };
