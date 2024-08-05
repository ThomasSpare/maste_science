import React, { createContext, useState, useEffect, useContext } from "react";
import { auth } from "../firebaseAuth/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getAuthStatus, logout as firebaseLogout } from "../Auth/Auth"; // Ensure this path is correct

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return unsubscribe;
  }, []);

  async function initializeUser(user) {
    if (user) {
      setCurrentUser({ ...user });
      setIsLoggedIn(true);
    } else {
      setCurrentUser(null);
      setIsLoggedIn(false);
    }
    setLoading(false);
  }

  const value = {
    currentUser,
    isLoggedIn,
    loading,
  };

  const logout = async () => {
    try {
      await firebaseLogout();
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
