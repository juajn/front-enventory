import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
        <Navbar />

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register/>} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            }
          />

          <Route
            path="/inventory"
            element={
              <ProtectedRoute>
                <Inventory />
              </ProtectedRoute>
            }
          />

          {/* Nueva ruta por defecto */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
