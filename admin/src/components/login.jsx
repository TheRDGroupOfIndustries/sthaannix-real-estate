import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Backendurl } from "../config/constants.js"

const Login = () => {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const setUserSession = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email.trim() || !password.trim()) {
      toast.error("Please enter both email and password");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${Backendurl}/user/login`, {
        email,
        password,
      });
      console.log("res: ",response);
      

      if (response.status==200) {
        setUserSession(response.data.token, response.data.user);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(user));

        toast.success("Login successful!");

        const role = response.data.user.role?.toLowerCase();
         if (role === "admin") {
        navigate("/admin");
      } else if (["broker", "builder", "owner"].includes(role)) {
        // Check payment status
        if (user.paymentStatus === "approved") {
          navigate("/dashboard");
        } else {
          // Payment pending or cancelled
          navigate("/payment");
        }
      } else {
        // fallback
        navigate("/login");
      }
    } else {
      toast.error(response.data.message || "Invalid credentials");
    }
  } catch (error) {
    console.error("Login error:", error);
    toast.error("An error occurred during login");
  } finally {
    setLoading(false);
  }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-gray-600">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your password"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div>
            <motion.button
              type="submit"
              whileTap={{ scale: 0.95 }}
              disabled={loading}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </motion.button>
          </div>
        </form>

        <div className="text-center text-sm">
          <span className="text-gray-600">Don't have an account? </span>
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;