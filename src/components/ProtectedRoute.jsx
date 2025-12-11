// src/components/ProtectedRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { loading, isAuthenticated } = useContext(AuthContext);

  console.log("🛡️ ProtectedRoute - Estado:", {
    loading,
    isAuthenticated,
    hasToken: !!localStorage.getItem('access_token'),
    hasUser: !!localStorage.getItem('user')
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-white text-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          Verificando autenticación...
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    console.log("❌ No autenticado, redirigiendo a /login");
    return <Navigate to="/login" replace />;
  }

  console.log("✅ Acceso permitido");
  return children;
}