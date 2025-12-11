// src/services/axios.js
import axios from "axios";

// Configuración base - usa la misma URL en todas partes
const API_BASE_URL = "https://inventoryapi.adsodigital.sbs/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// NOTA: Ya no necesitamos interceptor de token si el backend no requiere autenticación
// Pero lo dejamos por si decides volver a activar la autenticación

// Interceptor para debug (opcional)
api.interceptors.request.use((config) => {
  console.log(`🌐 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  return config;
});

// Interceptor de respuesta para manejo de errores
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("❌ Error en la solicitud:", {
      status: error.response?.status,
      message: error.response?.data?.detail || error.message,
      url: error.config?.url,
    });
    
    // Si quieres mantener redirección para 401 (aunque ya no debería ocurrir)
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    
    return Promise.reject(error);
  }
);

export default api;
export { API_BASE_URL };