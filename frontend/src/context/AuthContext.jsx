import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { configBackendURL } from "../config";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // This useEffect now only runs once on mount to check the authentication status.
  useEffect(() => {
    checkAuthStatus();
  }, []); // Empty dependency array means this effect runs only once when the component mounts.

  const checkAuthStatus = async () => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    // Immediately set state from localStorage to prevent a flicker
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    if (token) {
      try {
        // Construct the URL safely to avoid double slashes.
        // It's a good practice to normalize the URL.
        const url = `${configBackendURL.replace(/\/+$/, "")}/me/get`;

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data) {
          setUser(response.data);
          setIsLoggedIn(true);
          localStorage.setItem("user", JSON.stringify(response.data));
        } else {
          throw new Error("Invalid response");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        // Clear all stored data on a 401 Unauthorized error or any other error.
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        setUser(null);
        delete axios.defaults.headers.common["Authorization"];
      }
    }
    setLoading(false);
  };

  const login = async (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setIsLoggedIn(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);