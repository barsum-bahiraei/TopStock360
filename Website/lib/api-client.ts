import axios from "axios";
import { clearAuthTokenIfExpired, getAuthToken } from "./auth-token";
import { normalizePublicUrl } from "./public-url";

export const apiClient = axios.create({
  baseURL: normalizePublicUrl(process.env.NEXT_PUBLIC_API_BASE_URL, "http://5.10.249.19:8080"),
  headers: {
    Accept: "application/json",
  },
  timeout: 10_000,
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) clearAuthTokenIfExpired();
    return Promise.reject(error);
  },
);
