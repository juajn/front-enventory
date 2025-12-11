import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaBox, FaPlus, FaMinus, FaSync, FaHistory, FaSearch } from "react-icons/fa";
import { 
  fetchAllInventory, 
  fetchInventory, 
  adjustInventory, 
  createOrUpdateInventory,
  getLowStockProducts 
} from "../api/inventory";
import { fetchProducts } from "../api/products";

export default function Inventory() {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [adjustment, setAdjustment] = useState({ productId: "", delta: 0 });
  const [newInventory, setNewInventory] = useState({ productId: "", quantity: "" });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [lowStockThreshold, setLowStockThreshold] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // Cargar datos iniciales
  const loadData = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      console.log("📊 Cargando inventario y productos...");
      
      // Cargar productos
      const productsData = await fetchProducts();
      setProducts(productsData);
      
      // Cargar inventario
      // Nota: Si tu backend no tiene endpoint para todo el inventario,
      // necesitarás cargar producto por producto
      try {
        const inventoryData = await fetchAllInventory();
        setInventoryItems(inventoryData);
      } catch (err) {
        console.log("⚠ No se pudo cargar todo el inventario, cargando individualmente...");
        // Cargar inventario para cada producto
        const inventoryPromises = productsData.map(async (product) => {
          try {
            const inv = await fetchInventory(product.id);
            return inv;
          } catch {
            return { product_id: product.id, quantity: 0 };
          }
        });
        const inventoryResults = await Promise.all(inventoryPromises);
        setInventoryItems(inventoryResults.filter(item => item));
      }
      
      console.log(`✅ ${productsData.length} productos cargados`);
      
    } catch (err) {
      console.error("❌ Error cargando datos:", err);
      setErrorMsg("Error cargando datos del inventario.");
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar
  useEffect(() => {
    loadData();
  }, []);

  // Ajustar inventario
  const handleAdjust = async (e) => {
    e.preventDefault();
    if (!adjustment.productId || adjustment.delta === 0) {
      setErrorMsg("Selecciona un producto y especifica la cantidad a ajustar.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");
    try {
      const prevQuantity = inventoryItems.find(i => i.product_id == adjustment.productId)?.quantity || 0;
      
      console.log(`🔄 Ajustando inventario: Producto ${adjustment.productId}, Delta: ${adjustment.delta}`);
      const updated = await adjustInventory(adjustment.productId, adjustment.delta);
      
      // Actualizar lista local
      setInventoryItems(prev => 
        prev.map(item => 
          item.product_id == adjustment.productId ? updated : item
        )
      );
      
      const productName = products.find(p => p.id == adjustment.productId)?.name || adjustment.productId;
      setSuccessMsg(`✅ Inventario de "${productName}" ajustado: ${prevQuantity} → ${updated.quantity}`);
      
      // Limpiar formulario
      setAdjustment({ productId: "", delta: 0 });
      
      // Auto-ocultar mensaje
      setTimeout(() => setSuccessMsg(""), 3000);
      
    } catch (err) {
      console.error("❌ Error ajustando inventario:", err);
      setErrorMsg("Error ajustando inventario. Verifica que el producto exista.");
    } finally {
      setSubmitting(false);
    }
  };

  // Crear/Actualizar inventario
  const handleCreateUpdate = async (e) => {
    e.preventDefault();
    if (!newInventory.productId || newInventory.quantity === "") {
      setErrorMsg("Selecciona un producto y especifica la cantidad.");
      return;
    }

    if (isNaN(newInventory.quantity) || newInventory.quantity < 0) {
      setErrorMsg("La cantidad debe ser un número positivo.");
      return;
    }

    setSubmitting(true);
    try {
      console.log(`📝 Configurando inventario: Producto ${newInventory.productId}, Cantidad: ${newInventory.quantity}`);
      const updated = await createOrUpdateInventory({
        product_id: newInventory.productId,
        quantity: parseInt(newInventory.quantity)
      });
      
      // Actualizar lista local
      setInventoryItems(prev => {
        const exists = prev.findIndex(i => i.product_id == newInventory.productId);
        if (exists >= 0) {
          const newArray = [...prev];
          newArray[exists] = updated;
          return newArray;
        } else {
          return [...prev, updated];
        }
      });
      
      const productName = products.find(p => p.id == newInventory.productId)?.name || newInventory.productId;
      setSuccessMsg(`✅ Inventario de "${productName}" establecido a ${updated.quantity}`);
      
      // Limpiar formulario
      setNewInventory({ productId: "", quantity: "" });
      
      setTimeout(() => setSuccessMsg(""), 3000);
      
    } catch (err) {
      console.error("❌ Error configurando inventario:", err);
      setErrorMsg("Error configurando inventario. Verifica los datos.");
    } finally {
      setSubmitting(false);
    }
  };

  // Filtrar productos con bajo stock
  const lowStockItems = inventoryItems.filter(item => 
    item.quantity <= lowStockThreshold && item.quantity > 0
  );

  const outOfStockItems = inventoryItems.filter(item => item.quantity === 0);
  
  const filteredItems = inventoryItems.filter(item => {
    const product = products.find(p => p.id == item.product_id);
    return product && (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Obtener nombre del producto
  const getProductName = (productId) => {
    const product = products.find(p => p.id == productId);
    return product ? product.name : `Producto #${productId}`;
  };

  // Obtener SKU del producto
  const getProductSKU = (productId) => {
    const product = products.find(p => p.id == productId);
    return product ? product.sku : "N/A";
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 tracking-wide text-white drop-shadow flex items-center gap-3">
                <FaBox className="text-blue-400" />
                Gestión de Inventario
              </h1>
              <p className="text-gray-300">
                Control de stock y existencias de productos
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={loadData}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
              >
                <FaSync className={loading ? "animate-spin" : ""} />
                {loading ? "Actualizando..." : "Actualizar"}
              </button>
            </div>
          </div>
          
          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 p-4 rounded-xl border border-white/20">
              <div className="text-2xl font-bold text-green-400">
                {inventoryItems.reduce((sum, item) => sum + item.quantity, 0)}
              </div>
              <div className="text-sm text-gray-300">Total en Stock</div>
            </div>
            <div className="bg-white/10 p-4 rounded-xl border border-white/20">
              <div className="text-2xl font-bold text-blue-400">
                {inventoryItems.length}
              </div>
              <div className="text-sm text-gray-300">Productos con Stock</div>
            </div>
            <div className="bg-white/10 p-4 rounded-xl border border-white/20">
              <div className="text-2xl font-bold text-yellow-400">
                {lowStockItems.length}
              </div>
              <div className="text-sm text-gray-300">Bajo Stock</div>
            </div>
            <div className="bg-white/10 p-4 rounded-xl border border-white/20">
              <div className="text-2xl font-bold text-red-400">
                {outOfStockItems.length}
              </div>
              <div className="text-sm text-gray-300">Sin Stock</div>
            </div>
          </div>
        </motion.div>

        {/* Mensajes */}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
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

        {/* Formularios de gestión */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Ajustar inventario */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/20"
          >
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <FaPlus className="text-green-400" /> <FaMinus className="text-red-400" />
              Ajustar Stock
            </h2>
            
            <form onSubmit={handleAdjust} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Producto</label>
                <select
                  value={adjustment.productId}
                  onChange={(e) => setAdjustment({ ...adjustment, productId: e.target.value })}
                  className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Seleccionar producto...</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} ({product.sku})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Cantidad a Ajustar (positivo para agregar, negativo para restar)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={adjustment.delta}
                    onChange={(e) => setAdjustment({ ...adjustment, delta: parseInt(e.target.value) || 0 })}
                    className="flex-1 p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: +5 o -3"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setAdjustment({ ...adjustment, delta: 5 })}
                    className="px-4 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                    title="Agregar 5"
                  >
                    +5
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustment({ ...adjustment, delta: -1 })}
                    className="px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                    title="Restar 1"
                  >
                    -1
                  </button>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors ${
                  submitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {submitting ? "Procesando..." : "Aplicar Ajuste"}
              </button>
            </form>
          </motion.div>

          {/* Establecer inventario */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/20"
          >
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <FaBox className="text-blue-400" />
              Establecer Stock
            </h2>
            
            <form onSubmit={handleCreateUpdate} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Producto</label>
                <select
                  value={newInventory.productId}
                  onChange={(e) => setNewInventory({ ...newInventory, productId: e.target.value })}
                  className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Seleccionar producto...</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} ({product.sku})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-gray-300 mb-2">Cantidad Exacta</label>
                <input
                  type="number"
                  min="0"
                  value={newInventory.quantity}
                  onChange={(e) => setNewInventory({ ...newInventory, quantity: e.target.value })}
                  className="w-full p-3 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: 100"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors ${
                  submitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {submitting ? "Procesando..." : "Establecer Stock"}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Lista de inventario */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/20"
        >
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-2xl font-semibold">📋 Stock Actual</h2>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar producto..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-300">Alerta bajo stock:</label>
                <input
                  type="number"
                  min="0"
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(parseInt(e.target.value) || 0)}
                  className="w-16 p-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-300">Cargando inventario...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">📦</div>
              <p className="text-gray-400 text-lg mb-2">
                {searchTerm ? "No se encontraron productos con ese criterio" : "No hay productos en inventario"}
              </p>
              <p className="text-gray-500">¡Agrega productos al inventario usando los formularios de arriba!</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full">
                <thead className="bg-white/10 text-gray-300">
                  <tr>
                    <th className="p-4 text-left">Producto</th>
                    <th className="p-4 text-left">Codigo</th>
                    <th className="p-4 text-left">Stock Actual</th>
                    <th className="p-4 text-left">Estado</th>
                    <th className="p-4 text-center">Acciones Rápidas</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => {
                    const productName = getProductName(item.product_id);
                    const sku = getProductSKU(item.product_id);
                    const quantity = item.quantity;
                    
                    let status = "";
                    let statusColor = "";
                    
                    if (quantity === 0) {
                      status = "Sin Stock";
                      statusColor = "bg-red-500/20 text-red-300";
                    } else if (quantity <= lowStockThreshold) {
                      status = `Bajo Stock (≤${lowStockThreshold})`;
                      statusColor = "bg-yellow-500/20 text-yellow-300";
                    } else {
                      status = "Disponible";
                      statusColor = "bg-green-500/20 text-green-300";
                    }
                    
                    return (
                      <tr key={item.id || item.product_id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <div className="font-medium">{productName}</div>
                        </td>
                        <td className="p-4">
                          <code className="bg-black/30 px-2 py-1 rounded text-sm">{sku}</code>
                        </td>
                        <td className="p-4">
                          <div className={`text-2xl font-bold ${
                            quantity === 0 ? 'text-red-400' :
                            quantity <= lowStockThreshold ? 'text-yellow-400' : 'text-green-400'
                          }`}>
                            {quantity}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-sm ${statusColor}`}>
                            {status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => setAdjustment({ productId: item.product_id, delta: 1 })}
                              className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                              title="Agregar 1"
                            >
                              +1
                            </button>
                            <button
                              onClick={() => setAdjustment({ productId: item.product_id, delta: -1 })}
                              className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                              title="Restar 1"
                            >
                              -1
                            </button>
                            <button
                              onClick={() => setSelectedProduct(selectedProduct?.product_id === item.product_id ? null : item)}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                              title="Ver detalles"
                            >
                              👁️
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Alertas de bajo stock */}
          {lowStockItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-xl"
            >
              <h3 className="font-semibold text-yellow-300 mb-3 flex items-center gap-2">
                ⚠ Alertas de Bajo Stock (≤{lowStockThreshold})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {lowStockItems.slice(0, 6).map(item => (
                  <div key={item.id} className="bg-yellow-900/30 p-3 rounded-lg">
                    <div className="font-medium">{getProductName(item.product_id)}</div>
                    <div className="text-sm text-yellow-200">Stock: {item.quantity}</div>
                  </div>
                ))}
              </div>
              {lowStockItems.length > 6 && (
                <p className="text-sm text-yellow-400 mt-2">
                  ...y {lowStockItems.length - 6} productos más con bajo stock
                </p>
              )}
            </motion.div>
          )}

          {/* Pie de tabla */}
          {!loading && filteredItems.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/10 text-sm text-gray-400">
              Mostrando <span className="text-white font-semibold">{filteredItems.length}</span> productos en inventario
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
          <h3 className="font-semibold text-blue-300 mb-2">💡 Cómo usar el inventario</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• <strong>Ajustar Stock:</strong> Agrega o resta unidades del stock existente</li>
            <li>• <strong>Establecer Stock:</strong> Define la cantidad exacta de unidades</li>
            <li>• Los productos con stock ≤ al umbral aparecen en alertas amarillas</li>
            <li>• Los productos sin stock aparecen en rojo</li>
            <li>• Usa las acciones rápidas (+1, -1) para ajustes rápidos</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}