import React, { useState, useEffect } from "react";
import { getAuth, updatePassword } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions"; // Import Firebase Functions
import { CdsButton } from "@cds/react/button";
import "./Settings.css";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app); // Initialize Firebase Functions

const Settings = () => {
  const [password, setPassword] = useState("");
  const [newsletter, setNewsletter] = useState(false);
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [userRole, setUserRoleState] = useState("");

  useEffect(() => {
    const fetchUserRole = async () => {
      const user = auth.currentUser;
      if (user) {
        console.log("User is signed in:", user.uid); // Debugging log
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const role = userDoc.data().role;
            console.log("Fetched user role:", role); // Debugging log
            setUserRoleState(role);
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          if (error.code === "unavailable") {
            console.error("Error fetching user role: Client is offline");
          } else {
            console.error("Error fetching user role:", error);
          }
        }
      } else {
        console.log("No user is signed in."); // Debugging log
      }
    };

    fetchUserRole();
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
      try {
        await updatePassword(user, password);
        setMessage("Password updated successfully.");
      } catch (error) {
        setMessage(`Error: ${error.message}`);
      }
    } else {
      setMessage("No user is signed in.");
    }
  };

  const handleSubscriptionChange = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
      try {
        await setDoc(
          doc(db, "users", user.uid),
          {
            newsletter,
          },
          { merge: true }
        );
        setMessage("Subscription preferences updated successfully.");
      } catch (error) {
        setMessage(`Error: ${error.message}`);
      }
    } else {
      setMessage("No user is signed in.");
    }
  };

  const handleRoleChange = async (e) => {
    e.preventDefault(); // Prevent form submission
    const user = auth.currentUser;
    if (user) {
      try {
        const token = await user.getIdToken();
        const response = await fetch("/api/updateRole", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ uid: user.uid, role }),
        });

        if (response.ok) {
          const data = await response.json();
          setMessage(data.message);
          setUserRoleState(role); // Update the local state to reflect the change
        } else {
          const errorData = await response.json();
          setMessage(`Error: ${errorData.message}`);
        }
      } catch (error) {
        console.error("Error in handleRoleChange:", error); // Debugging log
        setMessage(`Error: ${error.message}`);
      }
    } else {
      setMessage("No user is signed in.");
    }
  };

  // Example function call
  const callExampleFunction = async () => {
    const exampleFunction = httpsCallable(functions, "exampleFunction");
    try {
      const result = await exampleFunction({ text: "Hello, World!" });
      console.log("Function result:", result.data);
    } catch (error) {
      console.error("Error calling function:", error);
    }
  };

  return (
    <div className="Settings">
      <form onSubmit={handlePasswordChange}>
        <div>
          <label>
            New Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
        </div>
        <CdsButton type="submit">Change Password</CdsButton>
      </form>
      <form onSubmit={handleSubscriptionChange}>
        <div>
          <label>
            <input
              type="checkbox"
              checked={newsletter}
              onChange={(e) => setNewsletter(e.target.checked)}
            />
            Receive Newsletter
          </label>
        </div>
        <CdsButton type="submit">Update Preferences</CdsButton>
      </form>
    </div>
  );
};

export default Settings;
