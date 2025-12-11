import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  fetchProducts, 
  createProduct, 
  deleteProduct, 
  updateProduct,
  searchProductBySKU 
} from "../api/products";
import { FaTrash, FaEdit, FaEye, FaPlus, FaSearch, FaSync } from "react-icons/fa";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    sku: "",
    price: "",
    description: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Cargar productos
  const loadProducts = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      console.log("📦 Cargando productos...");
      const data = await fetchProducts();
      console.log(`✅ ${data.length} productos cargados`);
      setProducts(data);
    } catch (err) {
      console.error("❌ Error cargando productos:", err);
      setErrorMsg("Error cargando productos. Verifica la conexión con la API.");
    } finally {
      setLoading(false);
    }
  };

  // Crear o actualizar producto
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    // Validaciones
    if (!form.name || !form.sku || !form.price) {
      setErrorMsg("Nombre, SKU y Precio son obligatorios.");
      return;
    }

    if (isNaN(form.price) || Number(form.price) <= 0) {
      setErrorMsg("El precio debe ser un número mayor a 0.");
      return;
    }

    setSubmitting(true);
    try {
      const productData = {
        name: form.name.trim(),
        sku: form.sku.trim().toUpperCase(),
        price: Number(form.price),
        description: form.description?.trim() || ""
      };

      if (editingId) {
        // Actualizar producto existente
        console.log(`🔄 Actualizando producto ID: ${editingId}`);
        const updated = await updateProduct(editingId, productData);
        setProducts(products.map(p => p.id === editingId ? updated : p));
        setSuccessMsg(`✅ Producto "${productData.name}" actualizado correctamente`);
      } else {
        // Crear nuevo producto
        console.log("➕ Creando nuevo producto...");
        const newProduct = await createProduct(productData);
        setProducts([...products, newProduct]);
        setSuccessMsg(`✅ Producto "${productData.name}" creado correctamente`);
      }

      // Limpiar formulario
      setForm({ name: "", sku: "", price: "", description: "" });
      setEditingId(null);

      // Auto-ocultar mensaje de éxito
      setTimeout(() => setSuccessMsg(""), 3000);
      
    } catch (err) {
      console.error("❌ Error en operación:", err);
      
      // Manejo detallado de errores
      if (err.response?.data?.detail) {
        setErrorMsg(`Error: ${err.response.data.detail}`);
      } else if (err.message.includes("SKU ya existe")) {
        setErrorMsg("❌ El SKU ya existe. Usa un SKU único.");
      } else if (err.message.includes("Network Error")) {
        setErrorMsg("🔌 Error de conexión. Verifica que la API esté funcionando.");
      } else {
        setErrorMsg("Error en la operación. Intenta nuevamente.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Eliminar producto
  const handleDelete = async (id, name) => {
    if (!window.confirm(`¿Estás seguro de eliminar el producto "${name}"?`)) return;
    
    try {
      console.log(`🗑️ Eliminando producto ID: ${id}`);
      await deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
      setSuccessMsg(`✅ Producto "${name}" eliminado correctamente`);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error("❌ Error eliminando producto:", err);
      setErrorMsg("Error eliminando producto. Intenta nuevamente.");
    }
  };

  // Editar producto
  const handleEdit = (product) => {
    setForm({
      name: product.name,
      sku: product.sku,
      price: product.price.toString(),
      description: product.description || ""
    });
    setEditingId(product.id);
    setSuccessMsg(`✏️ Editando producto: ${product.name}`);
    
    // Scroll suave al formulario
    document.getElementById("product-form").scrollIntoView({ behavior: "smooth" });
  };

  // Ver detalles del producto
  const handleViewDetails = (product) => {
    setSelectedProduct(selectedProduct?.id === product.id ? null : product);
  };

  // Buscar productos
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Cargar productos al montar
  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 tracking-wide text-white drop-shadow">
            📦 Gestión de Productos
          </h1>
          <p className="text-gray-300">
            Administra el catálogo de productos del inventario
          </p>
          <div className="flex items-center gap-4 mt-4">
            <div className="text-sm text-gray-400">
              <span className="text-green-400 font-bold">{products.length}</span> productos registrados
            </div>
            <button
              onClick={loadProducts}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
            >
              <FaSync className={loading ? "animate-spin" : ""} />
              {loading ? "Cargando..." : "Actualizar"}
            </button>
          </div>
        </motion.div>

        {/* Mensajes */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-600/20 border border-red-600/40 text-red-200 p-4 rounded-xl mb-6"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">⚠</span>
                <span>{errorMsg}</span>
                <button
                  onClick={() => setErrorMsg("")}
                  className="ml-auto text-red-300 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </motion.div>
          )}

          {successMsg && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-green-600/20 border border-green-600/40 text-green-200 p-4 rounded-xl mb-6"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">✅</span>
                <span>{successMsg}</span>
                <button
                  onClick={() => setSuccessMsg("")}
                  className="ml-auto text-green-300 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Formulario */}
        <motion.div
          id="product-form"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/20 mb-8"
        >
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <FaPlus />
            {editingId ? "✏️ Editar Producto" : "➕ Crear Producto"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Nombre *</label>
                <input
                  value={form.name}
                  placeholder="Ej: Laptop Gaming"
                  className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Codigo *</label>
                <input
                  value={form.sku}
                  placeholder="Ej: LP-GAM-001"
                  className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setForm({ ...form, sku: e.target.value.toUpperCase() })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Precio ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  placeholder="Ej: 999.99"
                  className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    editingId
                      ? "bg-yellow-600 hover:bg-yellow-700"
                      : "bg-green-600 hover:bg-green-700"
                  } ${submitting ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <FaSync className="animate-spin" />
                      {editingId ? "Actualizando..." : "Creando..."}
                    </span>
                  ) : editingId ? (
                    "📝 Actualizar Producto"
                  ) : (
                    "➕ Crear Producto"
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">Descripción</label>
              <textarea
                value={form.description}
                placeholder="Describe el producto..."
                rows="3"
                className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            {editingId && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setForm({ name: "", sku: "", price: "", description: "" });
                    setEditingId(null);
                    setSuccessMsg("✖️ Modo edición cancelado");
                  }}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancelar Edición
                </button>
              </div>
            )}
          </form>
        </motion.div>

        {/* Lista de productos */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/20"
        >
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <FaEye />
              Listado de Productos
            </h2>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, Codigo o descripción..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <span className="text-sm text-gray-400">
                {filteredProducts.length} de {products.length}
              </span>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-300">Cargando productos...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">📦</div>
              <p className="text-gray-400 text-lg mb-2">
                {searchTerm ? "No se encontraron productos con ese criterio" : "No hay productos registrados"}
              </p>
              <p className="text-gray-500">¡Crea tu primer producto usando el formulario de arriba!</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full">
                <thead className="bg-white/10 text-gray-300">
                  <tr>
                    <th className="p-4 text-left">Producto</th>
                    <th className="p-4 text-left">Codigo</th>
                    <th className="p-4 text-left">Precio</th>
                    <th className="p-4 text-left">Descripción</th>
                    <th className="p-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <React.Fragment key={product.id}>
                      <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-400">ID: {product.id}</div>
                        </td>
                        <td className="p-4">
                          <code className="bg-black/30 px-2 py-1 rounded text-sm">{product.sku}</code>
                        </td>
                        <td className="p-4">
                          <span className="text-lg font-bold text-green-400">
                            ${Number(product.price).toFixed(2)}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="max-w-xs truncate" title={product.description}>
                            {product.description || <span className="text-gray-500 italic">Sin descripción</span>}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleViewDetails(product)}
                              className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                              title="Ver detalles"
                            >
                              <FaEye />
                            </button>
                            <button
                              onClick={() => handleEdit(product)}
                              className="p-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id, product.name)}
                              className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                              title="Eliminar"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                      
                      {/* Detalles expandidos */}
                      {selectedProduct?.id === product.id && (
                        <tr className="bg-black/20">
                          <td colSpan="5" className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-black/30 rounded-lg">
                              <div>
                                <h4 className="font-semibold text-gray-300 mb-2">Información Detallada</h4>
                                <p><strong>ID:</strong> {product.id}</p>
                                <p><strong>CODIGO:</strong> <code>{product.sku}</code></p>
                                <p><strong>Precio:</strong> ${Number(product.price).toFixed(2)}</p>
                              </div>
                              <div className="md:col-span-2">
                                <h4 className="font-semibold text-gray-300 mb-2">Descripción Completa</h4>
                                <p className="text-gray-300">{product.description || "Sin descripción"}</p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pie de tabla */}
          {!loading && filteredProducts.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-sm text-gray-400">
              <div>
                Mostrando <span className="text-white font-semibold">{filteredProducts.length}</span> productos
              </div>
              <div className="flex items-center gap-4">
                <div className="text-xs">
                  <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span>
                  Precio: ${products.reduce((sum, p) => sum + Number(p.price), 0).toFixed(2)}
                </div>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  ↑ Volver arriba
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Instrucciones */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl"
        >
          <h3 className="font-semibold text-blue-300 mb-2">💡 Información útil</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• El SKU debe ser único para cada producto</li>
            <li>• Puedes buscar productos por nombre, SKU o descripción</li>
            <li>• Haz click en el ícono 👁️ para ver detalles del producto</li>
            <li>• Usa el ícono ✏️ para editar un producto existente</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}