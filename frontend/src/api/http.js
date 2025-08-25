import axios from "axios";
import { configBackendURL } from "../config";

const http = axios.create({
  baseURL: configBackendURL || "http://localhost:12000",
  withCredentials: true,
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
   return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
 
export default http;
