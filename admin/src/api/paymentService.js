// import axios from "axios";

// const API_BASE_URL =
//   import.meta.env.VITE_API_BASE_URL || "http://localhost:12000";

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });


// api.interceptors.request.use((config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     // Do something with request error
//     return Promise.reject(error);
//   }
// );
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );


// // Submit payment proof
// export const submitPaymentProof = async (paymentData) => {
//   try {
//     const formData = new FormData();
    
//     // Append all form data
//     formData.append("amount", paymentData.amount);
//     formData.append("paymentMethod", paymentData.paymentMethod);
//     formData.append("paymentRef", paymentData.paymentRef);
//     formData.append("userData", JSON.stringify(paymentData.user));
    
//     // Append all images
//     paymentData.images.forEach((image, index) => {
//       formData.append(`proofImages`, image);
//     });

//     const response = await api.post("/payment/submit-proof", formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });
    
//     return response.data;
//   } catch (error) {
//     console.error("Error submitting payment proof:", error);
//     throw error;
//   }
// };


// export async function fetchMyPayments() {
//   try {
//     const response = await api.get("/payment/my-payment");
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching payments:', error);
//     throw error;
//   }
// }


// export default {
//   submitPaymentProof,
// };