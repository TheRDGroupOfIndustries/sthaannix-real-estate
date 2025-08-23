import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:12000";

const api = axios.create({
  baseURL: API_BASE_URL,
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
