import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const { logout } = useAuth();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      setError("");
      setLoading(true);
      localStorage.removeItem("currentUser");
      localStorage.removeItem("currentRole");
      await logout();
      navigate("/login");
    } catch {
      setError("Failed to log out");
    }

    setLoading(false);
  }

    useEffect(() => {
    handleLogout();
  }, []); // Runs once on mount
  return (
    <>
   </>
  );
}
