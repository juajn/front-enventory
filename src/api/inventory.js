// src/services/inventory.js
import api from "./axios";

export const fetchInventory = async (productId) => {
  try {
    const { data } = await api.get(`/inventory/${productId}`);
    return data;
  } catch (error) {
    console.error(`Error fetching inventory for product ${productId}:`, error);
    throw error;
  }
};

export const createOrUpdateInventory = async (inventoryData) => {
  try {
    const { data } = await api.post("/inventory/", inventoryData);
    return data;
  } catch (error) {
    console.error("Error creating/updating inventory:", error);
    throw error;
  }
};

export const adjustInventory = async (productId, delta) => {
  try {
    const { data } = await api.patch(`/inventory/${productId}`, { 
      quantity: delta 
    });
    return data;
  } catch (error) {
    console.error(`Error adjusting inventory for product ${productId}:`, error);
    throw error;
  }
};

// Obtener todo el inventario
export const fetchAllInventory = async (skip = 0, limit = 100) => {
  try {
    // Si tu backend tiene este endpoint
    const { data } = await api.get("/inventory/", {
      params: { skip, limit }
    });
    return data;
  } catch (error) {
    console.error("Error fetching all inventory:", error);
    // Si el endpoint no existe, puedes obtener productos y luego su inventario
    throw error;
  }
};

// Obtener productos con stock bajo
export const getLowStockProducts = async (threshold = 10) => {
  try {
    // Esto dependerá de si tu backend tiene este endpoint
    const allInventory = await fetchAllInventory();
    return allInventory.filter(item => item.quantity <= threshold);
  } catch (error) {
    console.error("Error getting low stock products:", error);
    throw error;
  }
};