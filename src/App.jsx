import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Inventory from "./pages/Inventory";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rutas públicas SIN Navbar */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Layout para rutas protegidas */}
          <Route path="/*" element={<MainLayout />} />
          
          {/* Redirección por defecto */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

// Layout principal con Navbar y rutas protegidas
function MainLayout() {
  const location = useLocation();
  
  return (
    <>
      {/* El Navbar maneja su propia lógica para ocultarse en login/register */}
      <Navbar />
      
      <div className="pt-16 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <Routes>
          {/* Rutas protegidas dentro del layout */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/products" element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          } />
          
          <Route path="/inventory" element={
            <ProtectedRoute>
              <Inventory />
            </ProtectedRoute>
          } />
          
          {/* Redirección para rutas no encontradas dentro del layout */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        
        {/* Botón de debug flotante (opcional) */}
        <button
          onClick={() => {
            console.log("=== DEBUG ===");
            console.log("Token:", localStorage.getItem("access_token"));
            console.log("User:", localStorage.getItem("user"));
            console.log("Pathname:", location.pathname);
            alert("Ver consola para debug");
          }}
          className="fixed bottom-4 right-4 bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 z-50"
          title="Debug"
        >
          🔧
        </button>
      </div>
    </>
  );
}