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
});
 
export default http;
