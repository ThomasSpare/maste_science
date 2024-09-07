import React from "react";
import { useAuth } from "../Auth/useAuth";

const Dashboard = () => {
  const { user, logout, hasRole } = useAuth();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user.name}</p>
      {hasRole("admin") && <p>You have admin access</p>}
      <button onClick={() => logout({ returnTo: window.location.origin })}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
