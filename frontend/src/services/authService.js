import axios from "axios";
import { API_URL  } from "../App";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL:API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Register user (send OTP)
export const registerUser = (userData) => {
  return api.post("/user/register", userData);
};

// Verify OTP and complete registration
export const verifyOtp = (email, otp) => {
  return api.post("/user/verify-otp", { email, otp });
};

// Login user
export const loginUser = (loginData) => {
  return api.post("/user/login", loginData);
};



export default {
  registerUser,
  verifyOtp,
  loginUser,
//   getUserInfo,
};