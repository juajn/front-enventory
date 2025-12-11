// src/context/AuthContext.jsx - Versión corregida
import React, { createContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Función para verificar autenticación
  const checkAuth = useCallback(() => {
    try {
      const token = localStorage.getItem("access_token") || localStorage.getItem("token");
      const userData = localStorage.getItem("user");
      
      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        console.log("✅ Usuario autenticado desde localStorage:", parsedUser.email);
        return true;
      } else {
        console.log("⚠ No hay datos de autenticación en localStorage");
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error('❌ Error checking auth:', error);
      setUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Verificar al cargar
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const loginSuccess = (userData) => {
    console.log("🎯 loginSuccess llamado con:", userData);
    
    if (userData) {
      // Guardar en localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      // Actualizar estado
      setUser(userData);
    }
  };

  const logout = () => {
    console.log("🚪 Cerrando sesión...");
    localStorage.removeItem("access_token");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  
  const isAuthenticated = useCallback(() => {
    const token = localStorage.getItem("access_token") || localStorage.getItem("token");
    const hasUser = localStorage.getItem("user");
    return !!(token && hasUser);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginSuccess,
        logout,
        checkAuth,
        isAuthenticated  
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};