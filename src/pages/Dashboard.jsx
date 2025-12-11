// src/pages/Dashboard.jsx
import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("🏠 Dashboard - Usuario:", user);
    console.log("🏠 Dashboard - Autenticado:", isAuthenticated);
    
    // Si no hay usuario pero hay token, intentar recuperar de localStorage
    if (!user && isAuthenticated) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        console.log("🔄 Recuperando usuario de localStorage");
      }
    }
  }, [user, isAuthenticated]);

  // Si no hay usuario, mostrar mensaje
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg shadow-xl rounded-2xl p-8 border border-white/20">
            <h1 className="text-3xl font-bold text-center text-yellow-400 mb-4">
              ⚠ Información de Usuario no Disponible
            </h1>
            <p className="text-gray-300 text-center mb-6">
              No se pudo cargar la información del usuario.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="mx-auto block px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
            >
              Volver al Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 text-white">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl mx-auto"
      >
        {/* Tarjeta de bienvenida */}
        <div className="bg-white/10 backdrop-blur-lg shadow-xl rounded-2xl p-8 border border-white/20">
          <h1 className="text-4xl font-bold tracking-wide">
            Bienvenido,{" "}
            <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              {user.full_name || user.email || "Usuario"}
            </span>
          </h1>

          <p className="mt-4 text-gray-300 text-lg">
            Sistema avanzado de gestión de inventario.
          </p>
          
          {/* Información del usuario */}
          <div className="mt-6 p-4 bg-black/30 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">Información de la cuenta:</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Email:</span>
                <p className="text-white">{user.email || "No disponible"}</p>
              </div>
              <div>
                <span className="text-gray-400">ID:</span>
                <p className="text-white">{user.id || "No disponible"}</p>
              </div>
              <div>
                <span className="text-gray-400">Superusuario:</span>
                <p className="text-white">{user.is_superuser ? "Sí" : "No"}</p>
              </div>
              <div>
                <span className="text-gray-400">Activo:</span>
                <p className="text-white">{user.is_active ? "Sí" : "No"}</p>
              </div>
            </div>
          </div>
        </div>

        

        {/* Acciones rápidas */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/products')}
            className="p-4 bg-blue-600/30 hover:bg-blue-600/50 rounded-xl border border-blue-500/30 transition-all"
          >
            <div className="text-2xl mb-2">📦</div>
            <h3 className="font-semibold">Gestionar Productos</h3>
          </button>
          <button
            onClick={() => navigate('/inventory')}
            className="p-4 bg-green-600/30 hover:bg-green-600/50 rounded-xl border border-green-500/30 transition-all"
          >
            <div className="text-2xl mb-2">📊</div>
            <h3 className="font-semibold">Ver Inventario</h3>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

