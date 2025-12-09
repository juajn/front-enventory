import api from "./axios";

export const login = async (email, password) => {
  const form = new URLSearchParams();
  form.append("username", email.trim());
  form.append("password", password);

  try {
    const { data } = await api.post("/auth/token", form, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    // Guardar token con ambos nombres para compatibilidad
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("token", data.access_token); // También como 'token'
    
    return data;
  } catch (error) {
    console.error("Error en login:", error.response?.data || error.message);
    throw error;
  }
};

export const register = async (user) => {
  const { data } = await api.post("/auth/register", user, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return data;
};

export const getProfile = async () => {
  try {
    const { data } = await api.get("/users/me");
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