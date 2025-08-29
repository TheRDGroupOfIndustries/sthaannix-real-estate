import http from "../api/http";

// Fetch all properties
export const fetchProperties = async (filters = {}) => {
  try {
    const response = await http.get("/properties/get", { params: filters });
    return response.data;
  } catch (error) {
    console.error("Error fetching properties:", error);
    throw error;
  }
};

// Fetch single property by ID
export const fetchPropertyDetail = async (id) => {
  try {
    const response = await http.get(`/properties/get-by-id/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching property ${id}:`, error);
    throw error;
  }
};

// Submit inquiry
export const submitInquiry = async (inquiryData) => {
  try {
    const response = await http.post("/leads/create", inquiryData);
    return response.data;
  } catch (error) {
    console.error("Error submitting inquiry:", error.response?.data || error);
    throw error; 
  }
};
 

// Fetch user inquiries
export const fetchInquiries = async () => {
  try {
    const response = await http.get("/leads/my");
    return response.data;
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    throw error;
  }
};

export default {
  fetchProperties,
  fetchPropertyDetail,
  submitInquiry,
  fetchInquiries,
};
