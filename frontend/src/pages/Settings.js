import React, { useState, useEffect } from "react";
import { getAuth, updatePassword } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { CdsButton } from "@cds/react/button";
import "./Settings.css";
import { db, auth } from "../firebaseAuth/firebase"; // Ensure this path is correct

const Settings = () => {
  const [password, setPassword] = useState("");
  const [newsletter, setNewsletter] = useState(false);
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [userRole, setUserRoleState] = useState("");
  const [image, setImage] = useState("");
  const [headline, setHeadline] = useState("");
  const [text, setText] = useState("");
  const [currentDate, setCurrentDate] = useState(
    new Date().toISOString().split("T")[0]
  );

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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
      try {
        await setDoc(doc(db, "homeContent", "latest"), {
          image,
          headline,
          text,
          currentDate,
        });
        setMessage("Content updated successfully.");
      } catch (error) {
        setMessage(`Error: ${error.message}`);
      }
    } else {
      setMessage("No user is signed in.");
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
      <form onSubmit={handleFormSubmit}>
        <div>
          <label>
            Image URL:
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Headline:
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Text:
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
              style={{ height: "200px", width: "460px" }}
            />
          </label>
        </div>
        <div>
          <label>
            Current Date:
            <input
              type="text"
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
              required
            />
          </label>
        </div>
        <CdsButton type="submit">Update Content</CdsButton>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Settings;
