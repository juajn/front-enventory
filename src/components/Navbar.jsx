import React from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between">
      <h1 className="text-xl font-bold">Inventory System</h1>

      {user && (
        <div className="flex gap-4">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/products">Productos</Link>
          <Link to="/inventory">Inventario</Link>
          <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
