// src/services/auth.js
import api from "./axios";

export const login = async (email, password) => {
  const formData = new URLSearchParams();
  formData.append("username", email.trim());
  formData.append("password", password);

  try {
    const { data } = await api.post("/auth/token", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    // Guardar token si decides usar autenticación más adelante
    if (data.access_token) {
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("token", data.access_token);
    }
    
    return data;
  } catch (error) {
    console.error("Error en login:", error.response?.data || error.message);
    throw error;
  }
};

export const register = async (user) => {
  const { data } = await api.post("/auth/register", user);
  return data;
};

// Estas funciones pueden ser innecesarias si no usas autenticación
export const getProfile = async () => {
  try {
    const { data } = await api.get("/auth/me");
    return data;
  } catch (error) {
    console.error("Error obteniendo perfil:", error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("token");
  window.location.href = "/login";
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("access_token") || localStorage.getItem("token");
  return !!token;
};

export const getToken = () => {
  return localStorage.getItem("access_token") || localStorage.getItem("token");
};

// Función para validar si el backend está funcionando
export const checkApiHealth = async () => {
  try {
    const response = await api.get("/");
    return response.status === 200;
  } catch (error) {
    console.error("API no responde:", error);
    return false;
  }
};