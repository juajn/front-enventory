import React, { createContext, useEffect, useState } from "react";
import { getProfile } from "../api/auth";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      const profile = await getProfile();
      setUser(profile);
    } catch (_) {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
