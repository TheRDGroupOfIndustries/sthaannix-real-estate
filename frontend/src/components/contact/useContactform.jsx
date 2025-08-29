import { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Make sure this CSS is loaded once, typically in your main App.js or index.js
import { configBackendURL } from '../../config'; // Assuming '../../config' is the correct path for your config file
import http from '../../api/http';
export default function useContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false); // New loading state

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for the field as user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading to true when submission starts

    if (validateForm()) {
      try {
        // Ensure the endpoint matches your backend route
        const response = await http.post(`${configBackendURL}contact/send`, formData);

        if (response.data.success) { // Assuming your backend returns { success: true, ... }
          toast.success('Form submitted successfully!');
          // Reset form
          setFormData({ name: '', email: '', phone: '', message: '' });
          setErrors({}); // Clear any lingering errors
        } else {
          // Handle cases where the backend responds with success: false
          toast.error(response.data.message || 'Error submitting form. Please try again.');
          console.error('Backend error (success: false):', response.data.message);
        }
      } catch (error) {
        toast.error('Error submitting form. Please try again.');
        console.error('Error submitting form:', error);
        // Log the full error response for debugging if available
        if (error.response) {
          console.error('Error response data:', error.response.data);
          console.error('Error response status:', error.response.status);
        }
      } finally {
        setIsLoading(false); // Always set loading to false after submission attempt
      }
    } else {
      toast.error('Please correct the highlighted errors.'); // Notify user about validation errors
      setIsLoading(false); // Stop loading if validation fails
      console.log('Validation errors:', errors); // Debugging log
    }
  };

  return { formData, errors, isLoading, handleChange, handleSubmit };
}
