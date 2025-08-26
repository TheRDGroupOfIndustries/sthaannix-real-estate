export const Backendurl =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:12000";

import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { HelmetProvider } from "react-helmet-async";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Properties from "./pages/Properties";
import PropertyDetails from "./components/properties/propertydetail";
import Aboutus from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./components/login";
import Signup from "./components/signup";
import ForgotPassword from "./components/forgetpassword";
import ResetPassword from "./components/resetpassword";
import PropertiesInquiry from "./components/PropertiesInquiry";
import UserProfile from "./components/UserProfile";
import Footer from "./components/footer";
import NotFoundPage from "./components/Notfound";
import { AuthProvider } from "./context/AuthContext";

import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "react-hot-toast";

const App = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.reload();
    }, 5 * 60 * 1000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <HelmetProvider>
      <Toaster position="top-right" reverseOrder={false} />
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset" element={<ResetPassword />} />
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/inquiry-properties" element={<PropertiesInquiry />} />
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<Properties />} />
            <Route
              path="/properties/single/:id"
              element={<PropertyDetails />}
            />
            <Route path="/about" element={<Aboutus />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Footer />
          <ToastContainer />
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
};

export default App;
