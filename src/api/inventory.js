import api from "./axios";

export const fetchInventory = async (productId) => {
  const { data } = await api.get(`/inventory/${productId}`);
  return data;
};

export const updateInventory = async (payload) => {
  const { data } = await api.post("/inventory", payload);
  return data;
};

export const adjustInventory = async (productId, delta) => {
  const { data } = await api.patch(`/inventory/${productId}`, { quantity: delta });
  return data;
};
