// src/services/products.js
import api from "./axios";

export const fetchProducts = async (skip = 0, limit = 100) => {
  try {
    const { data } = await api.get("/products/", {
      params: { skip, limit }
    });
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const createProduct = async (productData) => {
  try {
    const { data } = await api.post("/products/", productData);
    return data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

export const getProduct = async (productId) => {
  try {
    const { data } = await api.get(`/products/${productId}`);
    return data;
  } catch (error) {
    console.error("Error getting product:", error);
    throw error;
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    const { data } = await api.put(`/products/${productId}`, productData);
    return data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    const { data } = await api.delete(`/products/${productId}`);
    return data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

// Buscar producto por SKU
export const searchProductBySKU = async (sku) => {
  try {
    const products = await fetchProducts();
    return products.find(product => product.sku === sku);
  } catch (error) {
    console.error("Error searching product:", error);
    throw error;
  }
};