import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const AdvertisementForm = ({ user }) => {
  const { id } = useParams(); // propertyId if passed
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    propertyType: "",
    price: "",
    description: "",
    bhk: "",
    bathroom: "",
    size: "",
    transactionType: "",
    images: [],
    location: {
      address: "",
      city: "",
      state: "",
      pincode: "",
    },
    budget: "",
    platform: "",
    startDate: "",
    userName: user?.name || "",
  });

  const [previewUrls, setPreviewUrls] = useState([]);

  // Fetch property details if id is present
  useEffect(() => {
    if (id) {
      axios.get(`/api/property/${id}`).then((res) => {
        const property = res.data;
        setFormData((prev) => ({
          ...prev,
          title: property.title,
          propertyType: property.propertyType,
          price: property.price,
          description: property.description,
          bhk: property.bhk,
          bathroom: property.bathroom,
          size: property.size,
          transactionType: property.transactionType,
          location: property.location,
        }));
      });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("location.")) {
      const locField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [locField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, images: files }));

    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    // Append all form data
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "images") {
        value.forEach((file) => data.append("images", file));
      } else if (key === "location") {
        Object.entries(value).forEach(([locKey, locVal]) => {
          data.append(`location[${locKey}]`, locVal);
        });
      } else {
        data.append(key, value);
      }
    });

    try {
      await axios.post("/api/advertisements", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/success");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
      {/* Property details (readonly) */}
      <div>
        <label>Property Title</label>
        <input type="text" name="title" value={formData.title} readOnly className="border p-2 w-full" />
      </div>
      <div>
        <label>User Name</label>
        <input type="text" name="userName" value={formData.userName} readOnly className="border p-2 w-full" />
      </div>
      <div>
        <label>Price</label>
        <input type="text" name="price" value={formData.price} readOnly className="border p-2 w-full" />
      </div>

      {/* Ad-specific fields */}
      <div>
        <label>Budget</label>
        <input
          type="number"
          name="budget"
          value={formData.budget}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
      </div>

      <div>
        <label>Platform</label>
        <select name="platform" value={formData.platform} onChange={handleChange} className="border p-2 w-full" required>
          <option value="">Select Platform</option>
          <option value="Meta Ads">Meta Ads</option>
          <option value="Google Ads">Google Ads</option>
        </select>
      </div>

      <div>
        <label>Start Date</label>
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          className="border p-2 w-full"
          required
        />
      </div>

      {/* Optional property images */}
      <div>
        <label>Upload Images</label>
        <input type="file" multiple onChange={handleImageChange} className="border p-2 w-full" />
      </div>
      <div className="flex gap-2 mt-2">
        {previewUrls.map((url, i) => (
          <img key={i} src={url} alt="preview" className="w-20 h-20 object-cover" />
        ))}
      </div>

      <button type="submit" className="bg-blue-600 text-white p-2 rounded">Submit Advertisement</button>
    </form>
  );
};

export default AdvertisementForm;
