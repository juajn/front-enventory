import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { user } = useContext(AuthContext);

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
              {user.full_name}
            </span>
          </h1>

          <p className="mt-4 text-gray-300 text-lg">
            Sistema avanzado de gestión de inventario.
          </p>
        </div>

        {/* Tarjetas de estado */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <StatCard title="Productos" value="120" icon="📦" color="from-blue-500 to-purple-500" />
          <StatCard title="Movimientos" value="58" icon="📊" color="from-green-500 to-teal-500" />
          <StatCard title="Alertas" value="4" icon="⚠️" color="from-red-500 to-orange-500" />
        </div>
      </motion.div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      className={`p-6 rounded-xl shadow-lg bg-gradient-to-br ${color} text-white`}
    >
      <div className="text-5xl mb-3">{icon}</div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </motion.div>
  );
}
