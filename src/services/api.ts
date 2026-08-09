import axios from "axios";
import { useAuthStore } from "../stores/auth.store";
import refreshApi from "./refreshapi";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// ====================== REQUEST ======================

api.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// ====================== RESPONSE ======================

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      error.response?.data.code === 1102 &&
      !originalRequest._retry 
      
    ) {
      originalRequest._retry = true;

      try {
        const res = await refreshApi.post("/refresh");

        const newAccessToken = res.data.result.accessToken;

        useAuthStore.getState().setAccessToken(newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        console.log('lỗi được gọi từ api.ts')
        useAuthStore.getState().logout();
        useAuthStore.getState().setAuthExpired(true);

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;