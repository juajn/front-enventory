// src/components/Navbar.jsx - Versión simplificada
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaBox, FaSignOutAlt, FaUser, FaHome, FaBoxes, FaWarehouse } from "react-icons/fa";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useContext(AuthContext); // ¡isAuthenticated es una función!
  const navigate = useNavigate();
  const location = useLocation();
  const [mounted, setMounted] = useState(false);

  // Estado local para controlar si el usuario está autenticado
  const [authStatus, setAuthStatus] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Usar la función isAuthenticated del contexto
    const status = isAuthenticated();
    setAuthStatus(status);
    
    console.log("🔧 Navbar - Estado:", {
      user: user,
      isAuthenticated: status,
      location: location.pathname
    });
    
  }, [user, location, isAuthenticated]);

  const handleLogout = () => {
    console.log("🚪 Ejecutando logout desde Navbar");
    logout();
    navigate("/login");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  // No mostrar navbar en páginas de login/register
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  // Si no está montado aún, no renderizar
  if (!mounted) {
    return null;
  }

  // Usar el usuario del contexto o de localStorage
  const currentUser = user || (localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-900/90 backdrop-blur-lg border-b border-gray-700 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo y menú izquierdo */}
          <div className="flex items-center">
            <Link to={authStatus ? "/dashboard" : "/login"} className="flex items-center text-xl font-bold text-white">
              <FaBox className="mr-2 text-blue-400" />
              Inventory System
            </Link>
            
            {/* Menú de navegación - solo si está autenticado */}
            {authStatus && (
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  to="/dashboard"
                  className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                    location.pathname === '/dashboard' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <FaHome className="mr-2" />
                  Dashboard
                </Link>
                <Link
                  to="/products"
                  className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                    location.pathname === '/products' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <FaBoxes className="mr-2" />
                  Productos
                </Link>
                <Link
                  to="/inventory"
                  className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                    location.pathname === '/inventory' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <FaWarehouse className="mr-2" />
                  Inventario
                </Link>
              </div>
            )}
          </div>
          
          {/* Sección derecha */}
          <div className="flex items-center space-x-4">
            {authStatus ? (
              <>
                {/* Información del usuario */}
                <div className="hidden md:flex items-center space-x-3">
                  <div className="text-gray-300">
                    <span className="text-sm">Hola, </span>
                    <span className="font-semibold text-blue-300">
                      {currentUser?.full_name || currentUser?.email?.split('@')[0] || "Usuario"}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg">
                    {currentUser?.email ? currentUser.email[0].toUpperCase() : "U"}
                  </div>
                </div>
                
                {/* Menú móvil usuario */}
                <div className="md:hidden">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                    {currentUser?.email ? currentUser.email[0].toUpperCase() : "U"}
                  </div>
                </div>
                
                {/* Botón de logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors shadow-lg hover:shadow-xl"
                >
                  <FaSignOutAlt className="mr-2" />
                  <span className="hidden sm:inline">Cerrar Sesión</span>
                </button>
              </>
            ) : (
              /* Si no está autenticado */
              <div className="flex items-center space-x-4">
                <div className="text-yellow-400 text-sm flex items-center">
                  <span className="animate-pulse mr-2">⚠</span>
                  <span>Sesión no iniciada</span>
                </div>
                <button
                  onClick={handleLogin}
                  className="flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors shadow-lg hover:shadow-xl"
                >
                  <FaUser className="mr-2" />
                  Iniciar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {authStatus && (
        <div className="md:hidden border-t border-gray-700 bg-gray-900/95">
          <div className="px-4 py-3 flex justify-around">
            <Link
              to="/dashboard"
              className={`flex flex-col items-center px-3 py-2 rounded-md transition-colors ${
                location.pathname === '/dashboard' 
                  ? 'text-blue-400' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <FaHome className="text-xl mb-1" />
              <span className="text-xs">Dashboard</span>
            </Link>
            <Link
              to="/products"
              className={`flex flex-col items-center px-3 py-2 rounded-md transition-colors ${
                location.pathname === '/products' 
                  ? 'text-blue-400' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <FaBoxes className="text-xl mb-1" />
              <span className="text-xs">Productos</span>
            </Link>
            <Link
              to="/inventory"
              className={`flex flex-col items-center px-3 py-2 rounded-md transition-colors ${
                location.pathname === '/inventory' 
                  ? 'text-blue-400' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <FaWarehouse className="text-xl mb-1" />
              <span className="text-xs">Inventario</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}