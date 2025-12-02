import { useAuthStore } from "@/stores/useAuthStore";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (!error.response) {
      toast.error(
        "Erro de conexão. Verifique sua internet ou tente novamente mais tarde."
      );
    } else if (error.response.status >= 500) {
      toast.error("Erro interno do servidor. Tente novamente mais tarde.");
    }

    return Promise.reject(error);
  }
);
