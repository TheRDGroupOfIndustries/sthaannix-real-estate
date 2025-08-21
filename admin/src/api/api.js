import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:12000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
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
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Properties API calls
export const propertiesAPI = {
  create: (propertyData) => {
    const formData = new FormData();
    
    // Append all property data to formData
    // Object.keys(propertyData).forEach(key => {
    //   if (key === 'images') {
    //     propertyData.images.forEach((image, index) => {
    //       formData.append(`image${index + 1}`, image);
    //     });
    //   } else if (key === 'amenities' && Array.isArray(propertyData.amenities)) {
    //     propertyData.amenities.forEach((amenity, index) => {
    //       formData.append(`amenities[${index}]`, amenity);
    //     });
    //   } else {
    //     formData.append(key, propertyData[key]);
    //   }
    // });
    
    Object.keys(propertyData).forEach(key => {
  if (key === 'images') {
    propertyData.images.forEach((image) => {
      formData.append('images', image); // <- SAME field name as backend
    });
  } else if (key === 'amenities' && Array.isArray(propertyData.amenities)) {
    propertyData.amenities.forEach((amenity, index) => {
      formData.append(`amenities[${index}]`, amenity);
    });
  } else {
    formData.append(key, propertyData[key]);
  }
});


    return api.post('/properties/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  get: (filters = {}) => api.get('/properties/get', { params: filters }),
  getById: (id) => api.get(`/properties/get-by-id/${id}`),
  update: (id, propertyData) => {
    const formData = new FormData();
    formData.append('id', id);
    
    // Append all property data to formData
    Object.keys(propertyData).forEach(key => {
      if (key === 'images') {
        // propertyData.images.forEach((image, index) => {
        //   // Check if image is a file (new upload) or string (existing image)
        //   if (typeof image !== 'string') {
        //     formData.append(`image${index + 1}`, image);
        //   }
        // });
          propertyData.images.forEach((image) => {
    formData.append('images', image); // <-- SAME field name
  });
      } else if (key === 'amenities' && Array.isArray(propertyData.amenities)) {
        formData.append('amenities', JSON.stringify(propertyData.amenities));
      } else {
        formData.append(key, propertyData[key]);
      }
    });
    
    return api.put(`/properties/update/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  delete: (id) => api.delete(`/properties/delete/${id}`),
};

// Admin API calls
export const adminAPI = {
  getPendingUsers: () => api.get('/admin/pending-users'),
  approveUser: (id) => api.patch(`/admin/approve-user/${id}`),
  rejectUser: (id) => api.patch(`/admin/reject-user/${id}`),
  approveProperty: (id) => api.patch(`/admin/approve-property/${id}`),
  // rejectProperty: (id) => api.patch(`/admin/reject-property/${id}`),
  deleteProperty: (id) => api.delete(`/admin/property/${id}`),
  getStats: () => api.get('/admin/stats'),
  getTopups: () => api.get('/admin/topups'),
  reviewTopup: (id, action) => api.patch(`/admin/topups/${id}`, { action }),
  getProperties: (status) => api.get('/admin/properties', { params: { status } }),
  rejectProperty: (id, reason) => api.patch(`/admin/reject-property/${id}`, { reason }),
 
};

export default api;