// src/pages/Login.jsx
import React, { useState, useContext } from "react";
import { login, getProfile } from "../api/auth";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const data = await login(email, password);

      localStorage.setItem("token", data.access_token);

      const profile = await getProfile();
      setUser(profile);
      navigate("/dashboard");
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      setErrorMsg("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
        
        <h1 className="text-4xl font-extrabold text-center text-white mb-6">
          Inventory System
        </h1>

        {errorMsg && (
          <div className="bg-red-500/20 text-red-300 border border-red-400/40 p-3 rounded mb-4 text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-gray-200 font-semibold">Correo</label>
            <input
              type="email"
              required
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div>
            <label className="text-gray-200 font-semibold">Contraseña</label>
            <input
              type="password"
              required
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="••••••••"
            />
          </div>

          <button
            disabled={loading}
            className={`w-full py-3 text-lg font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Ingresando..." : "Entrar"}
          </button>
        </form>

        <p className="text-center text-gray-300 mt-5">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="text-blue-400 hover:underline">
            Registrarse
          </Link>
        </p>
      </div>
    </div>
  );
}
