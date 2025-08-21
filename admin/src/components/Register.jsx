// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import { User, Mail, Lock, Phone, Home, ArrowRight, Loader2 } from "lucide-react";
// import { toast } from "react-hot-toast";
// import axios from "axios";
// // import { Backendurl } from "../App";
// import { Backendurl } from "../config/constants";

// const ROLES = ["Broker", "Builder", "Owner"]; // Removed Admin
// const REGISTRATION_FEE_ROLES = ["Broker", "Builder", "Owner"];
// const REGISTRATION_FEE = 1500;

// const Register = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     phone: "",
//     role: "",
//   });
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleRoleSelect = (role) => {
//     setFormData((prev) => ({ ...prev, role }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Basic validation
//     if (
//       !formData.name.trim() ||
//       !formData.email.trim() ||
//       !formData.password.trim() ||
//       !formData.role
//     ) {
//       toast.error("Please fill all required fields and select a role");
//       return;
//     }

//     setLoading(true);

//     try {
//       // Call backend register API
//       const response = await axios.post(`${Backendurl}/user/register`, formData);
//       console.log("Register res: ",response);

//       if (response.status === 200 && response.data.email) {
//   toast.success(response.data.message || "OTP sent! Please verify.");
//   // Redirect to OTP verification page, passing the email
//   navigate("/verify-otp", { state: { email: response.data.email } });
// }

//       if (response.data.success) {
//         localStorage.setItem("token", response.data.token);
//         localStorage.setItem("user", JSON.stringify(response.data.user));

//         toast.success("Registration successful! Please complete your payment");

//         // Role-based dashboard routing
//         const role = formData.role.toLowerCase();
//         if (["broker", "builder", "owner"].includes(role)) {
//            navigate("/payment");
//         } else {
//                 // fallback if needed, but admin shouldn't register here
//                  navigate("/admin");
//                }
// }
//     } catch (error) {
//       console.error("Registration error:", error);
//       toast.error(error.response?.data?.message || "An error occurred during registration");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 p-3">
//       <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-md">
//         <div className="text-center">
//           <h2 className="text-3xl font-bold text-gray-900">Create account</h2>
//           <p className="mt-2 text-gray-600">Join our platform</p>
//         </div>

//         <form onSubmit={handleSubmit} className="mt-8 space-y-6">
//           <div className="space-y-4">
//             {/* Name */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Full name</label>
//               <div className="mt-1 relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <User className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                   placeholder="Your name"
//                   required
//                 />
//               </div>
//             </div>

//             {/* Email */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Email address</label>
//               <div className="mt-1 relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Mail className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                   placeholder="your@email.com"
//                   required
//                 />
//               </div>
//             </div>

//             {/* Password */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Password</label>
//               <div className="mt-1 relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Lock className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   type="password"
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                   placeholder="Create password"
//                   required
//                 />
//               </div>
//             </div>

//             {/* Phone */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Phone number</label>
//               <div className="mt-1 relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Phone className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   type="tel"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleChange}
//                   className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                   placeholder="+1 (123) 456-7890"
//                 />
//               </div>
//             </div>

//             {/* Role */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">I am a</label>
//               <div className="grid grid-cols-3 gap-2">
//                 {ROLES.map((roleOption) => (
//                   <button
//                     key={roleOption}
//                     type="button"
//                     onClick={() => handleRoleSelect(roleOption)}
//                     className={`py-2 px-3 rounded-md border transition-colors ${
//                       formData.role === roleOption
//                         ? "border-blue-500 bg-blue-50 text-blue-600"
//                         : "border-gray-300 hover:border-blue-300"
//                     }`}
//                   >
//                     <div className="flex flex-col items-center">
//                       <Home className="h-4 w-4 mb-1" />
//                       <span className="text-xs">{roleOption}</span>
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Registration Fee */}
//             {REGISTRATION_FEE_ROLES.includes(formData.role) && (
//               <div className="pt-3">
//                 <p className="text-center font-semibold text-sm border border-gray-600 p-2 rounded-md text-gray-800">
//                   Registration Fee : ₹{REGISTRATION_FEE}
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* Submit button */}
//           <div>
//             <motion.button
//               type="submit"
//               whileTap={{ scale: 0.95 }}
//               disabled={loading}
//               className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
//             >
//               {loading ? (
//                 <>
//                   <Loader2 className="animate-spin mr-2 h-4 w-4" />
//                   Registering...
//                 </>
//               ) : (
//                 <>
//                   Create account
//                   <ArrowRight className="ml-2 h-4 w-4" />
//                 </>
//               )}
//             </motion.button>
//           </div>
//         </form>

//         <div className="text-center text-sm">
//           <span className="text-gray-600">Already have an account? </span>
//           <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
//             Sign in
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;



import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Phone,
  Home,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Backendurl } from "../config/constants";

const ROLES = ["Broker", "Builder", "Owner"];
const REGISTRATION_FEE_ROLES = ["Broker", "Builder", "Owner"];
const REGISTRATION_FEE = 1500;
const OTP_LENGTH = 6;

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const inputs = useRef([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleSelect = (role) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  // OTP input change handler
  const handleOtpChange = (e, idx) => {
    const { value } = e.target;
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[idx] = value;
      setOtp(newOtp);
      if (value && idx < OTP_LENGTH - 1) {
        inputs.current[idx + 1].focus();
      }
    }
  };

  // OTP backspace handling
  const handleOtpKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputs.current[idx - 1].focus();
    }
  };

  // Submit registration data
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password.trim() ||
      !formData.role
    ) {
      toast.error("Please fill all required fields and select a role");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${Backendurl}/user/register`, {
        ...formData,
        email: formData.email.trim(),
         role: formData.role.toLowerCase(),
        password: formData.password.trim(),
      });
      if (response.status === 200 && response.data.email) {
        toast.success(response.data.message || "OTP sent! Please verify.");
        setOtpSent(true);
      }
    } catch (error) {
      console.error("Registration Error:", error.response || error.message);
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Submit OTP for verification
const handleOtpSubmit = async (e) => {
  e.preventDefault();

  if (otp.some((digit) => !digit)) {
    toast.error("Please enter the full OTP");
    return;
  }

  setLoading(true);

  try {
    const otpValue = otp.join("");
    const response = await axios.post(`${Backendurl}/user/verify-otp`, {
      email: formData.email.trim(),
      otp: otpValue,
      password: formData.password.trim(),
       role: formData.role.toLowerCase(),
      phone: formData.phone,
      name: formData.name,
    });
      if (response.data.message) {
      toast.success("OTP verified successfully");
      navigate("/payment");
    } else {
      toast.error(res.data.message || "OTP verification failed");
    }
  } catch (err) {
    toast.error(err.response?.data?.message || "OTP verification failed");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-3">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-md">
        {!otpSent ? (
          <>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">Create account</h2>
              <p className="mt-2 text-gray-600">Join our platform</p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="mt-8 space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full name
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your name"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Create password"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone number
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+1 (123) 456-7890"
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  I am a
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {ROLES.map((roleOption) => (
                    <button
                      key={roleOption}
                      type="button"
                      onClick={() => handleRoleSelect(roleOption)}
                      className={`py-2 px-3 rounded-md border transition-colors ${
                        formData.role === roleOption
                          ? "border-blue-500 bg-blue-50 text-blue-600"
                          : "border-gray-300 hover:border-blue-300"
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <Home className="h-4 w-4 mb-1" />
                        <span className="text-xs">{roleOption}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Registration Fee */}
              {REGISTRATION_FEE_ROLES.includes(formData.role) && (
                <div className="pt-3">
                  <p className="text-center font-semibold text-sm border border-gray-600 p-2 rounded-md text-gray-800">
                    Registration Fee : ₹{REGISTRATION_FEE}
                  </p>
                </div>
              )}

              {/* Register Submit */}
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
                      Registering...
                    </>
                  ) : (
                    <>
                      Create account
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </>
        ) : (
          <>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">Verify OTP</h2>
              <p className="mt-2 text-gray-600">
                Enter the OTP sent to your email:{" "}
                <strong>{formData.email}</strong>
              </p>
            </div>
            <form
              onSubmit={handleOtpSubmit}
              className="mt-8 space-y-6 flex justify-center space-x-2"
            >
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e, idx)}
                  onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                  ref={(el) => (inputs.current[idx] = el)}
                  className="w-10 h-10 text-center border rounded text-lg"
                  inputMode="numeric"
                />
              ))}
              <div>
                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.95 }}
                  disabled={loading}
                  className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </motion.button>
              </div>
            </form>
          </>
        )}
        <div className="text-center text-sm mt-4">
          <span className="text-gray-600">Already have an account? </span>
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
