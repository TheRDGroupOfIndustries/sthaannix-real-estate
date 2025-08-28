import axios from "axios";
import { configBackendURL } from "../config";

const http = axios.create({
  baseURL: configBackendURL,
  withCredentials: true,
}); 

http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // Mark as retried to avoid infinite loops

      localStorage.removeItem("token");
      localStorage.removeItem("user"); // Assuming you store user details as 'user'

      console.warn("Session expired or unauthorized. Logging out...");
      window.location.href = "/login";

      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);
export default http;
