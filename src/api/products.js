// src/api/products.js
import api from "./axios";

export const fetchProducts = async () => {
  try {
    const { data } = await api.get("/products");
    return data;
  } catch (err) {
    console.error("fetchProducts error:", err.response?.status, err.response?.data || err.message);
    throw err;
  }
};

export const createProduct = async (payload) => {
  try {
    // asegúrate de que payload tiene las 4 llaves: name, sku, price, description
    console.log("createProduct payload:", payload);
    const { data } = await api.post("/products", payload, {
      headers: { "Content-Type": "application/json" }, // opcional: axios lo pone automáticamente
    });
    console.log("createProduct response:", data);
    return data;
  } catch (err) {
    console.error("createProduct error:", err.response?.status, err.response?.data || err.message);
    // lanzar error con información legible
    const message = err.response?.data || err.message || "Error desconocido";
    throw new Error(JSON.stringify({ status: err.response?.status, body: message }));
  }
};

export const updateProduct = async (id, payload) => {
  try {
    const { data } = await api.put(`/products/${id}`, payload);
    return data;
  } catch (err) {
    console.error("updateProduct error:", err.response?.status, err.response?.data || err.message);
    throw err;
  }
};

export const deleteProduct = async (id) => {
  try {
    const { data } = await api.delete(`/products/${id}`);
    return data;
  } catch (err) {
    console.error("deleteProduct error:", err.response?.status, err.response?.data || err.message);
    throw err;
  }
};
