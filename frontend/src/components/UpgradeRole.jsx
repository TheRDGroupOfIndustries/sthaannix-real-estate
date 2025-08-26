import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import {
  UserCheck,
  Building,
  Briefcase,
  UploadCloud,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast"; 
import { Backendurl } from "../App"; 
import http from "../api/http";

export default function UpgradeRole() {
  const [selectedRole, setSelectedRole] = useState("");
  const [formData, setFormData] = useState({
    amount: "1500",
    utrNumber: "",
    proofFile: null,
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

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, proofFile: file }));
    }
  };

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
  data.append("utrNumber", formData.utrNumber);
  if (formData.proofFile) {
    data.append("proof", formData.proofFile); // Append the actual file
  }

  try {
    const response = await http.post("/user/role-upgrade", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Axios already parses JSON
    toast.success(response.data.message);

    // Clear form after submission
    setSelectedRole("");
    setFormData({ amount: "", utrNumber: "", proofFile: null });
  } catch (error) {
    console.error("Role upgrade request error:", error);
    toast.error(
      error.response?.data?.message ||
        "An error occurred during submission. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className=""
    >
      <h2 className="text-2xl font-bold text-gray-900">Upgrade Your Role</h2>
      <p className="text-gray-600 text-sm">
        Select a new role to access additional features. A one-time payment is
        required.
      </p>
      <hr />

      {/* Role Selection */}
      <div className="space-y-4 m-3">
        <label className="block text-sm font-medium text-gray-700 m-5">
          Select Your New Role
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {roleOptions.map((role) => (
            <motion.button
              key={role.value}
              type="button"
              onClick={() => handleRoleSelect(role.value)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-xl transition-all duration-200 border-2 ${
                selectedRole === role.value
                  ? `border-blue-500 bg-blue-50 shadow-md`
                  : `border-gray-200 hover:border-blue-300`
              }`}
            >
              <div
                className={`flex flex-col items-center justify-center space-y-2 text-center`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white bg-gradient-to-br ${role.color}`}
                >
                  <role.icon className="w-6 h-6" />
                </div>
                <span className={`font-semibold text-gray-800`}>
                  {role.name}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
      <hr />

      {/* Payment Information Form */}
      {selectedRole && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
          className="space-y-6 overflow-hidden"
        >
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">
              Selected Role:
            </span>
            <span className="font-bold text-blue-600">
              {roleOptions.find((r) => r.value === selectedRole)?.name}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {" "}
            {/* Wrap form fields in a <form> tag */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Amount
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="e.g., 1500"
                    className="w-full border rounded px-3 py-2 pl-9 focus:ring-2 focus:ring-blue-400"
                    required
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                    ₹
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  UTR Number (for Bank Transfer)
                </label>
                <input
                  type="text"
                  name="utrNumber"
                  value={formData.utrNumber}
                  onChange={handleInputChange}
                  placeholder="UTR9876543210"
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Payment Proof (Screenshot)
              </label>
              <div className="relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="file"
                  name="proofFile" // Use proofFile as the name for the file input
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="image/*" // Restrict to image files
                  required
                />
                <div className="flex flex-col items-center space-y-2">
                  <UploadCloud className="w-8 h-8 text-gray-400" />
                  <p className="text-sm text-gray-500">
                    {formData.proofFile
                      ? `File: ${formData.proofFile.name}`
                      : "Click to upload file"}
                  </p>
                </div>
              </div>
            </div>
            <motion.button
              type="submit" // Change to type="submit" for the form
              whileTap={{ scale: 0.98 }}
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors"
              disabled={loading || !selectedRole}
            >
              {loading ? (
                <>
                  <div className="loader ease-linear rounded-full border-2 border-t-2 border-gray-200 h-5 w-5 animate-spin"></div>
                  <span>Submitting...</span>
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
