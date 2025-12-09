import { useState } from "react";
import { adjustInventory } from "../api/inventory";

export default function Inventory() {
  const [productId, setProductId] = useState("");
  const [delta, setDelta] = useState(0);

  const submit = async (e) => {
    e.preventDefault();
    await adjustInventory(productId, delta);
    alert("Inventario actualizado");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">Inventario</h1>

      <form onSubmit={submit}>
        <input className="border p-2 mr-2" placeholder="ID Producto"
          onChange={e => setProductId(e.target.value)} />

        <input className="border p-2 mr-2" placeholder="Cantidad (+/-)"
          onChange={e => setDelta(parseInt(e.target.value))} />

        <button className="bg-blue-600 text-white px-4 py-2">
          Actualizar
        </button>
      </form>
    </div>
  );
}
