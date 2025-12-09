import { useEffect, useState } from "react";
import { fetchProducts, createProduct, deleteProduct } from "../api/products";
import React, { useContext } from "react";
export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    sku: "",
    price: "",
    description: ""
  });

  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Cargar productos
  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      console.error("Error cargando productos:", err);
      setErrorMsg("Error cargando productos.");
    } finally {
      setLoading(false);
    }
  };

  // Crear producto
  const submit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!form.name || !form.sku || !form.price || !form.description) {
      setErrorMsg("Todos los campos son obligatorios.");
      return;
    }

    setCreating(true);
    try {
      await createProduct({
        name: form.name,
        sku: form.sku,
        price: Number(form.price),
        description: form.description
      });

      // Limpiar formulario
      setForm({ name: "", sku: "", price: "", description: "" });

      // Recargar productos
      await load();
    } catch (err) {
      console.error("Error creando producto:", err);

      // Manejo detallado del error enviado desde api/products.js
      try {
        const parsed = JSON.parse(err.message);
        const error = parsed.body?.detail || parsed.body;
        setErrorMsg(error || "Error creando producto.");
      } catch {
        setErrorMsg("Error creando producto.");
      }
    } finally {
      setCreating(false);
    }
  };

  // Eliminar producto
  const remove = async (id) => {
    if (!confirm("¿Eliminar producto?")) return;
    try {
      await deleteProduct(id);
      await load();
    } catch (err) {
      console.error("Error eliminando producto:", err);
      setErrorMsg("Error eliminando producto.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold mb-6 tracking-wide text-white drop-shadow">
          Gestión de Productos
        </h1>

        {/* mensaje de error */}
        {errorMsg && (
          <div className="bg-red-600/30 border border-red-600 text-red-200 p-3 rounded-lg mb-4">
            {errorMsg}
          </div>
        )}

        {/* Formulario */}
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/20 mb-10">
          <h2 className="text-2xl font-semibold mb-4">Crear Producto</h2>

          <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-4 gap-4">

            <input
              value={form.name}
              placeholder="Nombre"
              className="bg-white/20 p-3 rounded-lg text-white placeholder-gray-300 border border-white/30
                         focus:ring-2 focus:ring-blue-400 outline-none"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              value={form.sku}
              placeholder="SKU"
              className="bg-white/20 p-3 rounded-lg text-white placeholder-gray-300 border border-white/30 
                         focus:ring-2 focus:ring-blue-400 outline-none"
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
            />

            <input
              type="number"
              value={form.price}
              placeholder="Precio"
              className="bg-white/20 p-3 rounded-lg text-white placeholder-gray-300 border border-white/30 
                         focus:ring-2 focus:ring-blue-400 outline-none"
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />

            <button
              disabled={creating}
              className={`bg-green-600 hover:bg-green-700 transition px-4 py-2 rounded-lg font-semibold shadow-lg ${
                creating ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {creating ? "Creando..." : "Crear"}
            </button>

            <textarea
              value={form.description}
              placeholder="Descripción"
              className="bg-white/20 p-3 rounded-lg text-white placeholder-gray-300 border border-white/30 
                         focus:ring-2 focus:ring-blue-400 outline-none col-span-1 md:col-span-4"
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </form>
        </div>

        {/* Tabla */}
        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/20 overflow-x-auto">
          <h2 className="text-2xl font-semibold mb-4">Listado de Productos</h2>

          {loading ? (
            <p className="text-gray-300">Cargando productos...</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-white/10 text-gray-300 border-b border-white/20">
                <tr>
                  <th className="p-3">Nombre</th>
                  <th className="p-3">SKU</th>
                  <th className="p-3">Precio</th>
                  <th className="p-3">Descripción</th>
                  <th className="p-3 text-center">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-white/10 hover:bg-white/5 transition">
                    <td className="p-3">{p.name}</td>
                    <td className="p-3">{p.sku}</td>
                    <td className="p-3">${p.price}</td>
                    <td className="p-3">{p.description}</td>

                    <td className="p-3 text-center">
                      <button
                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg shadow-md transition"
                        onClick={() => remove(p.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}

                {products.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center p-6 text-gray-400">
                      No hay productos registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}
