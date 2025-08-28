import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Properties API calls
export const propertiesAPI = {
  create: (propertyData) => {
    const formData = new FormData();

    Object.keys(propertyData).forEach((key) => {
      if (key === "images" && Array.isArray(propertyData.images)) {
        // append all images under the same field "images"
        propertyData.images.forEach((image) => {
          formData.append("images", image);
        });
      } else if (
        key === "location" &&
        typeof propertyData.location === "object"
      ) {
        // stringify location object
        formData.append("location", JSON.stringify(propertyData.location));
      } else {
        formData.append(key, propertyData[key]);
      }
    });

    return api.post("/properties/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  get: (filters = {}) => api.get("/properties/get", { params: filters }),
  getById: (id) => api.get(`/properties/get-by-id/${id}`),
  update: (id, propertyData) => {
    const formData = new FormData();
    formData.append("id", id);

    // Append all property data to formData
    Object.keys(propertyData).forEach((key) => {
      if (key === "images") {
        // propertyData.images.forEach((image, index) => {
        //   // Check if image is a file (new upload) or string (existing image)
        //   if (typeof image !== 'string') {
        //     formData.append(`image${index + 1}`, image);
        //   }
        // });
        propertyData.images.forEach((image) => {
          formData.append("images", image); // <-- SAME field name
        });
      } else if (key === "amenities" && Array.isArray(propertyData.amenities)) {
        formData.append("amenities", JSON.stringify(propertyData.amenities));
      } else {
        formData.append(key, propertyData[key]);
      }
    });

    return api.put(`/properties/update/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  delete: (id) => api.delete(`/properties/delete/${id}`),
};

// Admin API calls
export const adminAPI = {
  getPendingUsers: () => api.get("/admin/pending-users"),
  approveUser: (id) => api.patch(`/admin/approve-user/${id}`),
  rejectUser: (id) => api.patch(`/admin/reject-user/${id}`),
  deleteProperty: (id) => api.delete(`/admin/property/${id}`),
  getProperties: (status) =>
    api.get("/admin/properties", { params: { status } }),
  approveProperty: (id) => api.patch(`/admin/approve-property/${id}`),
  rejectProperty: (id, reason) =>
    api.patch(`/admin/reject-property/${id}`, { reason }),
  getUsersData: () => api.get("/admin"),
  getStats: () => api.get("/admin/stats"),
  getTopups: () => api.get("/admin/topups"),
  reviewTopup: (id, action) => api.patch(`/admin/topups/${id}`, { action }),
  getAllAdRequests: () => api.get("/ad/get"),
  updateAdStatus: (id, status) => api.put(`/ad/${id}/status`, { status }),
};

// Payments API calls
export const paymentsAPI = {
  // User actions
  submitProof: (formData) =>
    api.post("/payment/submit-proof", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  myPayments: () => api.get("/payment/my-payments"),

  // Admin actions
  getAll: () => api.get("/payment/admin/all"),
  approve: (id) => api.patch(`/payment/admin/approve/${id}`),
  reject: (id, reason) => api.patch(`/payment/admin/reject/${id}`, { reason }),
  walletReject: (id, reason) =>
    api.patch(`/wallet/topups/${id}`, { action: "rejected", reason }),
  walletApprove: (id, utrNumber, paymentMethod) =>
    api.patch(`/wallet/topups/${id}`, {
      action: "approved",
      utrNumber,
      paymentMethod,
    }),
};

export default api;
