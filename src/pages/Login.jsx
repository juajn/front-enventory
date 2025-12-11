import React, { useState, useContext } from "react";
import { login } from "../api/auth";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const { loginSuccess } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      console.log("🔐 Iniciando login con:", email);
      
      // Intentar login real
      const data = await login(email, password);
      console.log("✅ Respuesta del login:", data);
      
      // Preparar datos del usuario para guardar
      let userData = {};
      
      // Si la respuesta contiene información del usuario
      if (data.user_id || data.email) {
        userData = {
          id: data.user_id || Date.now(),
          email: data.email || email,
          full_name: data.full_name || email.split('@')[0],
          is_superuser: data.is_superuser || false,
          is_active: data.is_active || true,
          access_token: data.access_token || null
        };
      } else {
        // Si la respuesta no tiene datos de usuario, crear uno básico
        userData = {
          id: Date.now(),
          email: email,
          full_name: email.split('@')[0],
          is_superuser: false,
          is_active: true,
          access_token: data.access_token || null
        };
      }
      
      console.log("👤 Datos de usuario preparados:", userData);
      
      // Guardar en localStorage
      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("token", data.access_token);
        console.log("🔑 Token guardado:", data.access_token.substring(0, 20) + "...");
      }
      
      localStorage.setItem("user", JSON.stringify(userData));
      console.log("💾 Usuario guardado en localStorage");
      
      // Mostrar confirmación visual
      showSuccessMessage();
      
      // Notificar al contexto que el login fue exitoso
      // Pasar los datos completos del usuario
      await loginSuccess(userData);
      
      // Esperar un momento para mostrar la animación de éxito
      setTimeout(() => {
        console.log("🔄 Redirigiendo a /dashboard");
        navigate("/dashboard");
      }, 1500);
      
    } catch (err) {
      console.error("❌ ERROR EN LOGIN COMPLETO:", err);
      
      // Manejo detallado de errores
      if (err.response?.data?.detail) {
        setErrorMsg(`Error: ${err.response.data.detail}`);
      } else if (err.message.includes("Network Error") || err.message.includes("Failed to fetch")) {
        setErrorMsg("❌ Error de conexión con el servidor. Verifica que la API esté funcionando.");
      } else if (err.response?.status === 401) {
        setErrorMsg("🔐 Credenciales incorrectas");
      } else if (err.response?.status === 404) {
        setErrorMsg("⚠ Endpoint no encontrado. Verifica la URL de la API.");
      } else if (err.message.includes("No se recibió respuesta")) {
        setErrorMsg("⚠ El servidor no respondió correctamente.");
      } else {
        setErrorMsg(`Error: ${err.message}`);
      }
      
      // Si el error parece ser del backend, ofrecer modo demo
      if (err.response?.status >= 500 || err.message.includes("Network Error")) {
        setTimeout(() => {
          if (window.confirm("¿Parece que hay problemas con el servidor. ¿Deseas entrar en modo demo?")) {
            enterDemoMode();
          }
        }, 1000);
      }
      
    } finally {
      setLoading(false);
    }
  };

  // Función para mostrar mensaje de éxito
  const showSuccessMessage = () => {
    // Puedes agregar una animación aquí
    console.log("🎉 Login exitoso!");
  };

  // Función para entrar en modo demo
  const enterDemoMode = () => {
    console.log("🚀 Activando modo demo...");
    
    const demoUser = {
      id: 999,
      email: "demo@inventory.com",
      full_name: "Usuario Demo",
      is_superuser: true,
      is_active: true,
      access_token: "demo-token-" + Date.now()
    };
    
    // Guardar datos demo
    localStorage.setItem("access_token", demoUser.access_token);
    localStorage.setItem("token", demoUser.access_token);
    localStorage.setItem("user", JSON.stringify(demoUser));
    
    // Mostrar mensaje
    setErrorMsg("✅ Modo demo activado. Redirigiendo...");
    
    // Notificar al contexto
    loginSuccess(demoUser);
    
    // Redirigir después de un momento
    setTimeout(() => {
      navigate("/dashboard");
    }, 1000);
  };

  // Función para probar con credenciales de prueba
  const handleTestCredentials = () => {
    setEmail("admin@inventory.com");
    setPassword("admin123");
    setErrorMsg("✅ Credenciales de prueba cargadas. Haz click en 'Entrar'.");
  };

  // Función para probar conexión a la API
  const testApiConnection = async () => {
    try {
      console.log("🧪 Probando conexión con la API...");
      const response = await fetch("https://inventoryapi.adsodigital.sbs/");
      const data = await response.text();
      console.log("✅ API conectada:", data);
      setErrorMsg(`✅ API conectada: ${data.substring(0, 50)}...`);
    } catch (error) {
      console.error("❌ Error conectando a la API:", error);
      setErrorMsg("❌ No se pudo conectar con la API. Verifica la URL.");
    }
  };

  // Función para limpiar localStorage
  const clearStorage = () => {
    localStorage.clear();
    setErrorMsg("🧹 localStorage limpiado. Recarga la página.");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
          
          {/* Encabezado */}
          <div className="text-center mb-8">
            <motion.h1 
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="text-4xl font-extrabold text-white mb-2"
            >
              Inventory System
            </motion.h1>
            <p className="text-gray-300 text-sm">
              Sistema de gestión de inventario
            </p>
            <p className="text-gray-400 text-xs mt-1">
              API: inventoryapi.adsodigital.sbs
            </p>
          </div>

          {/* Mensaje de error/success */}
          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className={`mb-4 p-3 rounded text-center ${
                errorMsg.includes('✅') || errorMsg.includes('Modo demo')
                  ? 'bg-green-500/20 text-green-300 border border-green-400/40'
                  : 'bg-red-500/20 text-red-300 border border-red-400/40'
              }`}
            >
              {errorMsg}
            </motion.div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-200 font-semibold mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                placeholder="usuario@ejemplo.com"
                autoComplete="email"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-gray-200 font-semibold mb-2">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={loading}
              />
            </div>

            

            {/* Botón principal */}
            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-3 text-lg font-semibold rounded-lg shadow-lg transition-all ${
                loading 
                  ? "bg-blue-400 cursor-not-allowed opacity-70" 
                  : "bg-blue-600 hover:bg-blue-700 hover:shadow-xl"
              } text-white`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Ingresando...
                </span>
              ) : (
                "Entrar"
              )}
            </motion.button>
          </form>

          {/* Enlaces y footer */}
          <div className="mt-6 pt-6 border-t border-white/20">
            <p className="text-center text-gray-300">
              ¿No tienes cuenta?{" "}
              <Link 
                to="/register" 
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
              >
                Regístrate aquí
              </Link>
            </p>
            
            
          </div>

          
        </div>

        {/* Créditos */}
        <p className="text-center text-gray-500 text-xs mt-4">
          Inventory System v1.0 • {new Date().getFullYear()}
        </p>
      </motion.div>

      {/* Efectos de fondo */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -inset-[10px] opacity-50">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}