import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:12000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Submit payment proof
export const submitPaymentProof = async (paymentData) => {
  try {
    const formData = new FormData();
    
    // Append all form data
    formData.append("amount", paymentData.amount);
    formData.append("paymentMethod", paymentData.paymentMethod);
    formData.append("paymentRef", paymentData.paymentRef);
    formData.append("userData", JSON.stringify(paymentData.user));
    
    // Append all images
    paymentData.images.forEach((image, index) => {
      formData.append(`proofImages`, image);
    });

    const response = await api.post("/payment/submit-proof", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    
    return response.data;
  } catch (error) {
    console.error("Error submitting payment proof:", error);
    throw error;
  }
};



export default {
  submitPaymentProof,
};