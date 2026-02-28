import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

/**
 * Admin gate.
 *
 * Role resolution order:
 *   1. localStorage "currentRole"  – set after login (see index.tsx)
 *   2. If neither source has a value the user is treated as a plain "User".
 *
 * When you wire up Firebase custom-claims or a Firestore roles collection
 * you can replace the localStorage read here with an async claim check.
 */
const PrivateAdminRoutes: React.FC = () => {
  const { currentUser, userRole } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  const localRole = localStorage.getItem("currentRole");

  if (localRole !== "System Admin" && userRole !== "Admin") {
    return <Navigate to="/status/401" />;
  }

  return <Outlet />;
};

export default PrivateAdminRoutes;
