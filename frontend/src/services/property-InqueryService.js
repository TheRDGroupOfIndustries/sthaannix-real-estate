import axios from "axios";
import { Backendurl } from "../App";

// Fetch all properties 
export const fetchProperties = async (filters = {}) => {
  try {
    const response = await axios.get(`${Backendurl}/properties/get`,{
      params: filters
    });
    return response.data; 
  } catch (error) {
    console.error("Error fetching properties:", error);
    throw error;
  }
};

// Fetch single property by ID
export const fetchPropertyDetail = async (id) => {
  try {
    const response = await axios.get(`${Backendurl}/properties/get-by-id/${id}`);
    return response.data; 
  } catch (error) {
    console.error(`Error fetching property ${id}:`, error);
    throw error;
  }
};

// Submit inquiry
export const submitInquiry = async (inquiryData) => {
  try {
    const response = await axios.post(`${Backendurl}/leads/create`, inquiryData);
    return response.data;
  } catch (error) {
    console.error("Error submitting inquiry:", error);
    throw error;
  }
};

export default {
  fetchProperties,
  fetchPropertyDetail,
  submitInquiry
};