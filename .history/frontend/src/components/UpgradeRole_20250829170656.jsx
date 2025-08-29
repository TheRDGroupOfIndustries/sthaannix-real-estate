import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  UserCheck,
  Building,
  Briefcase,
  UploadCloud,
  ArrowRight,
  CreditCard,
  Phone,
  MessageCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import http from "../api/http"; // Assuming 'http' is correctly configured for API calls

export default function UpgradeRole() {
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [formData, setFormData] = useState({
    amount: "1500",
    utrNumber: "",
    proofFile: null,
    whatsappNumber: "", // New state for WhatsApp number
  });
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const roleOptions = [
    {
      name: "Owner",
      value: "owner",
      icon: UserCheck,
      color: "from-green-500 to-green-600",
    },
    {
      name: "Broker",
      value: "broker",
      icon: Briefcase,
      color: "from-purple-500 to-purple-600",
    },
    {
      name: "Builder",
      value: "builder",
      icon: Building,
      color: "from-blue-500 to-blue-600",
    },
  ];

  const paymentOptions = [
    {
      name: "UPI",
      value: "upi",
      icon: CreditCard,
      color: "from-blue-500 to-blue-600",
    },
    {
      name: "Bank Account",
      value: "account",
      icon: Phone,
      color: "from-green-500 to-green-600",
    },
    {
      name: "WhatsApp",
      value: "whatsapp",
      icon: MessageCircle,
      color: "from-purple-500 to-purple-600",
    },
  ];

  // Handles the selection of a new role
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setSelectedPaymentMethod(""); // Reset payment method when a new role is selected
    // Reset all form data specific to payment methods
    setFormData({
      amount: "1500",
      utrNumber: "",
      proofFile: null,
      whatsappNumber: "",
    });
  };

  // Handles the selection of a payment method
  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
    // Reset UTR number, proof file, and WhatsApp number when a new payment method is selected
    setFormData((prev) => ({
      ...prev,
      utrNumber: "",
      proofFile: null,
      whatsappNumber: "",
    }));
  };

  // Handles changes in text input fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handles changes in the file input field for payment proof
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, proofFile: file }));
    }
  };

  // Handles the form submission
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   if (!token) {
  //     toast.error("You must be logged in to upgrade your role.");
  //     setLoading(false);
  //     return;
  //   }

  //   const data = new FormData();
  //   data.append("newRole", selectedRole);
  //   data.append("amount", formData.amount);
  //   data.append("paymentMethod", selectedPaymentMethod); // ✅ FIX

  //   if (
  //     selectedPaymentMethod === "upi" ||
  //     selectedPaymentMethod === "account"
  //   ) {
  //     if (!formData.utrNumber) {
  //       toast.error("UTR Number is required for this payment method.");
  //       setLoading(false);
  //       return;
  //     }
  //     data.append("utrNumber", formData.utrNumber);
  //   } else if (selectedPaymentMethod === "whatsapp") {
  //     if (!formData.whatsappNumber) {
  //       toast.error("WhatsApp number is required for this payment method.");
  //       setLoading(false);
  //       return;
  //     }
  //     data.append("whatsappNumber", formData.whatsappNumber);
  //   }

  //   if (formData.proofFile) {
  //     data.append("proof", formData.proofFile);
  //   } else {
  //     toast.error("Payment proof image is required.");
  //     setLoading(false);
  //     return;
  //   }

  //   try {
  //     const response = await http.post("/user/role-upgrade", data, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });
  //     toast.success(response.data.message);

  //     // reset
  //     setSelectedRole("");
  //     setSelectedPaymentMethod("");
  //     setFormData({
  //       amount: "1500",
  //       utrNumber: "",
  //       proofFile: null,
  //       whatsappNumber: "",
  //     });
  //   } catch (error) {
  //     console.error("Role upgrade request error:", error);
  //     toast.error(
  //       error.response?.data?.message || "An error occurred during submission."
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

// Handles the form submission
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  if (!token) {
    toast.error("You must be logged in to upgrade your role.");
    setLoading(false);
    return;
  }

  const data = new FormData();
  data.append("newRole", selectedRole);
  data.append("amount", formData.amount);
  data.append("paymentMethod", selectedPaymentMethod);

  if (selectedPaymentMethod === "upi" || selectedPaymentMethod === "account") {
    if (!formData.utrNumber) {
      toast.error("UTR Number is required for this payment method.");
      setLoading(false);
      return;
    }

    // ✅ Validate length (12–22 characters)
    if (formData.utrNumber.length < 12 || formData.utrNumber.length > 22) {
      toast.error("UTR Number must be between 12 and 22 characters.");
      setLoading(false);
      return;
    }

    // ✅ Validate format (letters + digits only)
    const utrRegex = /^[A-Za-z0-9]+$/;
    if (!utrRegex.test(formData.utrNumber)) {
      toast.error("UTR Number must contain only letters and numbers.");
      setLoading(false);
      return;
    }

    data.append("utrNumber", formData.utrNumber);
  } else if (selectedPaymentMethod === "whatsapp") {
    if (!formData.whatsappNumber) {
      toast.error("WhatsApp number is required for this payment method.");
      setLoading(false);
      return;
    }
    data.append("whatsappNumber", formData.whatsappNumber);
  }

  if (formData.proofFile) {
    data.append("proof", formData.proofFile);
  } else {
    toast.error("Payment proof image is required.");
    setLoading(false);
    return;
  }

  try {
    const response = await http.post("/user/role-upgrade", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    toast.success(response.data.message);

    // reset
    setSelectedRole("");
    setSelectedPaymentMethod("");
    setFormData({
      amount: "1500",
      utrNumber: "",
      proofFile: null,
      whatsappNumber: "",
    });
  } catch (error) {
    console.error("Role upgrade request error:", error);
    toast.error(
      error.response?.data?.message || "An error occurred during submission."
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto bg-white rounded-xl shadow-lg"
    >
      <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
        Upgrade Your Role
      </h2>
      <p className="text-gray-600 text-base mb-6">
        Select a new role to access additional features. A one-time payment is
        required to process your request.
      </p>
      <hr className="my-6 border-gray-200" />

      {/* Role Selection */}
      <div className="space-y-4 mb-8">
        <label className="block text-lg font-semibold text-gray-800 mb-4">
          Select Your New Role
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {roleOptions.map((role) => (
            <motion.button
              key={role.value}
              type="button"
              onClick={() => handleRoleSelect(role.value)}
              whileHover={{
                scale: 1.03,
                boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
              }}
              whileTap={{ scale: 0.98 }}
              className={`p-5 rounded-2xl transition-all duration-300 border-2 ${
                selectedRole === role.value
                  ? `border-blue-500 bg-blue-50 shadow-lg`
                  : `border-gray-200 hover:border-blue-300 hover:bg-gray-50`
              }`}
            >
              <div
                className={`flex flex-col items-center justify-center space-y-3 text-center`}
              >
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-white bg-gradient-to-br ${role.color} shadow-md`}
                >
                  <role.icon className="w-7 h-7" />
                </div>
                <span className={`font-bold text-lg text-gray-800`}>
                  {role.name}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
      <hr className="my-6 border-gray-200" />

      {/* Payment Method Selection */}
      {selectedRole && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
          className="space-y-6 overflow-hidden mb-8"
        >
          <div className="space-y-4">
            <label className="block text-lg font-semibold text-gray-800 mb-4">
              Select Payment Method
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {paymentOptions.map((method) => (
                <motion.button
                  key={method.value}
                  type="button"
                  onClick={() => handlePaymentMethodSelect(method.value)}
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-5 rounded-2xl transition-all duration-300 border-2 ${
                    selectedPaymentMethod === method.value
                      ? `border-blue-500 bg-blue-50 shadow-lg`
                      : `border-gray-200 hover:border-blue-300 hover:bg-gray-50`
                  }`}
                >
                  <div
                    className={`flex flex-col items-center justify-center space-y-3 text-center`}
                  >
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center text-white bg-gradient-to-br ${method.color} shadow-md`}
                    >
                      <method.icon className="w-7 h-7" />
                    </div>
                    <span className={`font-bold text-lg text-gray-800`}>
                      {method.name}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Payment Information Form */}
      {selectedRole && selectedPaymentMethod && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
          className="space-y-6 overflow-hidden mt-4"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 p-3 bg-gray-50 rounded-lg">
              <span className="text-base font-medium text-gray-700">
                Selected Role:
              </span>
              <span className="font-extrabold text-blue-600 text-lg">
                {roleOptions.find((r) => r.value === selectedRole)?.name}
              </span>
              <span className="text-base font-medium text-gray-700 sm:ml-auto">
                Payment Method:
              </span>
              <span className="font-extrabold text-blue-600 text-lg">
                {
                  paymentOptions.find((p) => p.value === selectedPaymentMethod)
                    ?.name
                }
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Payment Amount
                </label>
                <div className="relative">
                  <input
                    id="amount"
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="e.g., 1500"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors"
                    required
                    min="1500"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                    ₹
                  </span>
                </div>
              </div>

              {(selectedPaymentMethod === "upi" ||
                selectedPaymentMethod === "account") && (
                <div>
                  <label
                    htmlFor="utrNumber"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    UTR Number
                  </label>
                  <input
                    id="utrNumber"
                    type="text"
                    name="utrNumber"
                    value={formData.utrNumber}
                    onChange={handleInputChange}
                    placeholder="e.g., UTR9876543210"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors"
                    required
                  />
                </div>
              )}

              {selectedPaymentMethod === "whatsapp" && (
                <div>
                  <label
                    htmlFor="whatsappNumber"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Your WhatsApp Number
                  </label>
                  <input
                    id="whatsappNumber"
                    type="tel" // Use type="tel" for phone numbers
                    name="whatsappNumber"
                    value={formData.whatsappNumber}
                    onChange={handleInputChange}
                    placeholder="e.g., +919876543210"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-colors"
                    required
                  />
                </div>
              )}
            </div>

            {/* Payment Proof Upload (always shown if a payment method is selected) */}
            {/* {selectedPaymentMethod && (
              <div>
                <label
                  htmlFor="proofFile"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Upload Payment Proof (Screenshot)
                </label>
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-5 text-center cursor-pointer hover:bg-gray-50 transition-colors duration-200">
                  <input
                    id="proofFile"
                    type="file"
                    name="proofFile"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept="image/*"
                    required
                  />
                  <div className="flex flex-col items-center space-y-3">
                    <UploadCloud className="w-9 h-9 text-gray-400" />
                    <p className="text-base text-gray-500">
                      {formData.proofFile
                        ? `File Selected: ${formData.proofFile.name}`
                        : "Click to upload your payment screenshot"}
                    </p>
                    <p className="text-xs text-gray-400">
                      Accepted formats: JPG, PNG, GIF
                    </p>
                  </div>
                </div>
              </div>
            )} */}
            {/* Payment Proof Upload (always shown if a payment method is selected) */}
            {selectedPaymentMethod && (
              <div>
                <label
                  htmlFor="proofFile"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Upload Payment Proof (Screenshot)
                </label>
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-5 text-center cursor-pointer hover:bg-gray-50 transition-colors duration-200">
                  <input
                    id="proofFile"
                    type="file"
                    name="proofFile"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept="image/*"
                    required
                  />
                  <div className="flex flex-col items-center space-y-3">
                    <UploadCloud className="w-9 h-9 text-gray-400" />
                    <p className="text-base text-gray-500">
                      {formData.proofFile
                        ? `File Selected: ${formData.proofFile.name}`
                        : "Click to upload your payment screenshot"}
                    </p>
                    <p className="text-xs text-gray-400">
                      Accepted formats: JPG, PNG, GIF
                    </p>
                  </div>
                </div>

                {/* ✅ Image Preview */}
                {formData.proofFile && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                    <img
                      src={URL.createObjectURL(formData.proofFile)}
                      alt="Payment Proof Preview"
                      className="w-full max-h-80 object-contain rounded-lg shadow"
                    />
                  </div>
                )}
              </div>
            )}


            {selectedPaymentMethod === "whatsapp" && (
              <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500 shadow-sm">
                <p className="text-sm text-yellow-800 font-medium">
                  After submitting this form with your payment proof, please
                  also send the payment screenshot to our official WhatsApp
                  number for faster verification.
                </p>
                <p className="text-sm text-yellow-800 mt-1">
                  (Example: +91 XXXXXXXXXX - Replace with actual number)
                </p>
              </div>
            )}

            <motion.button
              type="submit"
              whileTap={{ scale: 0.98 }}
              className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors duration-200 shadow-md disabled:bg-blue-300 disabled:cursor-not-allowed"
              disabled={
                loading ||
                !selectedRole ||
                !selectedPaymentMethod ||
                !formData.proofFile ||
                (selectedPaymentMethod === "upi" ||
                selectedPaymentMethod === "account"
                  ? !formData.utrNumber
                  : false) ||
                (selectedPaymentMethod === "whatsapp"
                  ? !formData.whatsappNumber
                  : false)
              }
            >
              {loading ? (
                <>
                  <div className="loader ease-linear rounded-full border-2 border-t-2 border-gray-200 h-5 w-5 animate-spin"></div>
                  <span>Submitting Request...</span>
                </>
              ) : (
                <>
                  <span>Submit Request</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      )}
    </motion.div>
  );
}
