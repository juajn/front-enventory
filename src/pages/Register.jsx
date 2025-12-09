import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register as registerUser } from "../api/auth"; 

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [full_name, setName] = useState(""); 
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (password !== confirm) {
      setErrorMsg("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      const data = await registerUser({
        email,
        password,
        full_name,
      });

      alert("Cuenta creada correctamente. Ahora puedes iniciar sesión.");
      navigate("/login");
    } catch (error) {
      setErrorMsg("Error creando la cuenta. Verifique los datos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
        
        {/* Título */}
        <h1 className="text-4xl font-extrabold text-center text-white mb-6 drop-shadow-lg">
          Crear Cuenta
        </h1>

        {/* Error */}
        {errorMsg && (
          <div className="bg-red-500/20 text-red-300 border border-red-400/40 p-3 rounded mb-4 text-center">
            {errorMsg}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="text-gray-200 font-semibold">Nombre</label>
            <input
              type="text"
              required
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-inner"
              placeholder="Juan Pérez"
            />
          </div>

          <div>
            <label className="text-gray-200 font-semibold">Correo</label>
            <input
              type="email"
              required
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-inner"
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div>
            <label className="text-gray-200 font-semibold">Contraseña</label>
            <input
              type="password"
              required
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-inner"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="text-gray-200 font-semibold">Confirmar Contraseña</label>
            <input
              type="password"
              required
              onChange={(e) => setConfirm(e.target.value)}
              className="mt-1 w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-inner"
              placeholder="••••••••"
            />
          </div>

          <button
            disabled={loading}
            className={`w-full py-3 text-lg font-semibold rounded-lg bg-green-600 hover:bg-green-700 text-white shadow-lg transition-all duration-200 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Creando cuenta..." : "Registrarse"}
          </button>
        </form>

        <p className="text-center text-gray-300 mt-5">
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Iniciar Sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
