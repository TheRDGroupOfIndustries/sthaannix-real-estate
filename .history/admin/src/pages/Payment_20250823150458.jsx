import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Upload, ChevronDown, ClipboardCopy } from "lucide-react";
import { toast } from "react-hot-toast";
import { paymentsAPI } from '../api/api';

const WHATSAPP_LINK = "https://api.whatsapp.com/send?phone=997690669";

const Payment = () => {
   const [formData, setFormData] = useState({
    amount: 1500,
    paymentMethod: "",
  });
  const location = useLocation();
  const navigate = useNavigate();

  // formData passed from Register page
  // const {userData} = location.state || {};
  // if (!userData) {
  //   navigate("/register");
  //   return null;
  // }

  const [images, setImages] = useState([]);
  const [paymentRef, setPaymentRef] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("UPI"); // UPI, Account, Whatsapp
  const [showUpiDetails, setShowUpiDetails] = useState(false);
  const [loading, setLoading] = useState(false);

  const accountDetails = {
    bankName: "Example Bank",
    accountName: "Sthaanix Registrations",
    accountNumber: "1234567890",
    ifsc: "EXAMP0001234",
    upiId: "sthaanix@upi",
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 4) {
      toast.error("Maximum 4 images allowed");
      return;
    }
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const toggleUpiDetails = () => {
    setShowUpiDetails(prev => !prev);
  };

  const handleMethodChange = (method) => {
    setSelectedMethod(method);
    setShowUpiDetails(false);
  };

  // const handlePaymentSubmit = async (e) => {
  //   e.preventDefault();
    
  // const token = localStorage.getItem('token');
  // if (!token) {
  //   toast.error("Please login first");
  //   navigate("/login");
  //   return;
  // }

  //   if (!paymentRef.trim()) {
  //     toast.error("Please enter Unique Transaction Reference");
  //     return;
  //   }
  //   if (images.length === 0) {
  //     toast.error("Please upload payment proof images");
  //     return;
  //   }

  //   setLoading(true);
    
  //   // Save payment record in localStorage (append)
  //   // const paymentRecords = JSON.parse(localStorage.getItem("paymentRecords") || "[]");
  //    try {
  //   const paymentData = {
  //     id: Date.now().toString(),
  //     amount: 1500,
  //     user: formData,
  //     paymentRef: paymentRef.trim(),
  //     paymentMethod: selectedMethod,
  //     timestamp: new Date().toISOString(),
  //     images: images.map(file => URL.createObjectURL(file)),
  //     status: "pending",
  //   };

  //   const response = await paymentsAPI.submitProof(paymentData);
  //   if (response.success) {
  //       toast.success("Payment submitted successfully! Your account will be activated after verification.");
  //       navigate("/login");
  //     } 
  //     else {
  //       toast.error(response.message || "Payment submission failed");
  //     }
  //   } 
  //   catch (error) {
  //     console.error("Payment submission error:", error);
  //     toast.error(error.response?.data?.message || "Failed to submit payment. Please try again.");
  //   }
  //    finally {
  //     setLoading(false);
  //   }
  // };

  //   paymentRecords.push(newPayment);
  //   localStorage.setItem("paymentRecords", JSON.stringify(paymentRecords));

  //   setTimeout(() => {
  //     setLoading(false);
  //     toast.success("Payment submitted! Please login.");
  //     navigate("/login");
  //   }, 1500);
  // };

const handlePaymentSubmit = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");
  if (!token) {
    toast.error("Please login first");
    navigate("/login");
    return;
  }

  const utrNumber = paymentRef?.trim();
  if (!utrNumber) {
    toast.error("Please enter Unique Transaction Reference");
    return;
  }

  if (!images || images.length === 0) {
    toast.error("Please upload payment proof images");
    return;
  }

  setLoading(true);

  try {
    const formDataToSend = new FormData();
    formDataToSend.append("amount", formData?.amount || "0");
    formDataToSend.append("purpose", "registration"); // or "role-upgrade"
    formDataToSend.append("utrNumber", utrNumber);

    // append multiple images
    images.forEach((file) => {
      formDataToSend.append("screenshot", file); // if backend expects array, use "screenshot[]"
    });

    const response = await paymentsAPI.submitProof(formDataToSend, token);

      if (response?.status === 201 || response?.data?.payment) {
      toast.success("Payment submitted successfully! Your account will be activated after verification.");
      navigate("/logi");
    } else {
      toast.error(response?.data?.message || "Payment submission failed");
    }

  } catch (error) {
    console.error("Payment submission error:", error);
    toast.error(error?.response?.data?.message || "Failed to submit payment. Please try again.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-lg p-8 bg-white rounded-xl shadow-md space-y-6">
        <h2 className="text-3xl font-bold text-gray-900 text-center">
          Registration Payment
        </h2>

        <p className="text-center text-lg font-semibold text-gray-700">
          Registration Fee: ₹1500
        </p>

        <div className="flex justify-center gap-4 mb-4">
          {["UPI", "Account", "Whatsapp Deposit"].map(method => (
            <button
              key={method}
              type="button"
              onClick={() => handleMethodChange(method)}
              className={`px-4 py-2 rounded-md border font-semibold transition-colors ${
                selectedMethod === method
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600"
              }`}
            >
              {method}
            </button>
          ))}
        </div>

        {selectedMethod === "Account" && (
          <div className="border border-gray-200 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-gray-800">Account Details</h3>
            <p className="flex items-center justify-between"><span><strong>Bank  :</strong> {accountDetails.bankName}</span> 
            <ClipboardCopy
                className="w-5 h-5 cursor-pointer text-blue-600"
                onClick={() => copyToClipboard(accountDetails.bankName)}
                title="Copy Account Number"
              />
              </p>
            <p className="flex items-center justify-between">
              <span><strong>Account Name:</strong> {accountDetails.accountName}</span> 
              <ClipboardCopy
                className="w-5 h-5 cursor-pointer text-blue-600"
                onClick={() => copyToClipboard(accountDetails.accountName)}
                title="Copy Account Number"
              />
            </p>
            <p className="flex items-center justify-between">
              <span><strong>Account Number:</strong> {accountDetails.accountNumber}</span>
              <ClipboardCopy
                className="w-5 h-5 cursor-pointer text-blue-600"
                onClick={() => copyToClipboard(accountDetails.accountNumber)}
                title="Copy Account Number"
              />
            </p>
            <p className="flex items-center justify-between">
              <span><strong>IFSC:</strong> {accountDetails.ifsc}</span>
              <ClipboardCopy
                className="w-5 h-5 cursor-pointer text-blue-600"
                onClick={() => copyToClipboard(accountDetails.ifsc)}
                title="Copy IFSC"
              />
            </p>
          </div>
        )}

        {selectedMethod === "UPI" && (
          <div className="border border-gray-200 rounded-lg p-4 space-y-2">
            <button
              onClick={toggleUpiDetails}
              className="w-full flex items-center justify-between text-blue-600 font-semibold hover:text-blue-800 focus:outline-none"
            >
              UPI Payment Details
              <ChevronDown
                className={`w-5 h-5 transition-transform duration-300 ${
                  showUpiDetails ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>
            {showUpiDetails && (
              <div className="mt-4 text-gray-700 space-y-1">
                <p className="flex items-center justify-between">
                  <span><strong>UPI ID:</strong> {accountDetails.upiId}</span>
                  <ClipboardCopy
                    className="w-5 h-5 cursor-pointer text-blue-600"
                    onClick={() => copyToClipboard(accountDetails.upiId)}
                    title="Copy UPI ID"
                  />
                </p>
                {/* Add QR Code image here if available */}
              </div>
            )}
          </div>
        )}

        {selectedMethod === "Whatsapp Deposit" && (
          <div className="border border-gray-200 rounded-lg p-4 text-center text-gray-700">
            <p>
              Please deposit the payment by contacting us on WhatsApp.
            </p>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 py-2 px-4 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition"
            >
              Deposit via WhatsApp
            </a>
          </div>
        )}

        <div>
          <label htmlFor="paymentRef" className="block text-sm font-medium text-gray-700 mb-1">
            Unique Transaction Reference *
          </label>
          <input
            id="paymentRef"
            type="text"
            value={paymentRef}
            onChange={(e) => setPaymentRef(e.target.value)}
            placeholder="Enter your transaction reference"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Payment Proof (Max 4 images)
          </label>
          <div className="flex flex-wrap gap-3 mb-3">
            {images.map((file, idx) => (
              <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-300">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`upload-${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 text-xs"
                  title="Remove Image"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          {images.length < 4 && (
            <label
              htmlFor="payment-images"
              className="inline-flex items-center justify-center px-4 py-2 border border-dashed border-gray-300 rounded-md cursor-pointer text-gray-600 hover:border-blue-500 hover:text-blue-600 transition"
            >
              <Upload className="mr-2 w-5 h-5" />
              Upload Images
              <input
                id="payment-images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        <div className="space-y-3 text-center">
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full py-2 border border-gray-300 rounded-md text-gray-700 hover:border-blue-500 hover:text-blue-600 transition"
          >
            Payment Related Issue? Click here
          </a>
        </div>

        <motion.button
          onClick={handlePaymentSubmit}
          disabled={loading}
          whileTap={{ scale: 0.95 }}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Submitting Payment..." : "Submit Payment"}
        </motion.button>
      </div>
    </div>
  );
};

export default Payment;