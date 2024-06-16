import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCO3mkeBSKAAV8N8kUncZmGAVJyb6Jd5dU",
  authDomain: "maste-auth.firebaseapp.com",
  projectId: "maste-auth",
  storageBucket: "maste-auth.appspot.com",
  messagingSenderId: "418346622122",
  appId: "1:418346622122:web:70dfec2a08d14ccb8784d3",
  measurementId: "G-SY4J3S60EN",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
