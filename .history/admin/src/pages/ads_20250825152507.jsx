import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Backendurl } from "../config/constants";

const Ads = ({ user }) => {
  const { id } = useParams(); // propertyId
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [budget, setBudget] = useState("");
  const [platform, setPlatform] = useState("");
  const [startDate, setStartDate] = useState("");
  const [userName, setUserName] = useState("");

  // Fetch property details if id exists
  useEffect(() => {
    if (id) {
      axios
        .get(`${Backendurl}/properties/get-by-id/${id}`)
        .then((res) => setProperty(res.data))
        .catch((err) => console.error("Error fetching property:", err));
    }
  }, [id]);

  useEffect(() => {
  const userData = localStorage.getItem("user");
  if (userData) {
    const parsedUser = JSON.parse(userData);
    setUserName(parsedUser.name); // get name from stored user object
  }
}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!platform) return alert("Please select a platform");
    if (budget < 1500) return alert("Minimum advertisement budget is ₹1500");

    try {
      const response = await axios.post("/api/ads", {
        userId: user._id,
        propertyId: id,
        budget,
        platform: [platform],
        startDate,
      });

      alert(response.data.message);
      navigate("/ads-list"); // redirect after success
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message || "Error submitting ad request. Try again."
      );
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 border rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Submit Advertisement</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Property Details */}
        <div>
          <label>Property Title</label>
          <input
            type="text"
            value={property?.title || ""}
            readOnly
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label>Price</label>
          <input
            type="text"
            value={property?.price || ""}
            readOnly
            className="border p-2 w-full"
          />
        </div>

        <div>
          <label>Location</label>
          <input
            type="text"
            value={
              property
                ? `${property.location.address}, ${property.location.city}, ${property.location.state} - ${property.location.pincode}`
                : ""
            }
            readOnly
            className="border p-2 w-full"
          />
        </div>

        {/* User */}
        <div>
          <label>User Name</label>
          <input
            type="text"
            value={user.name}
            readOnly
            className="border p-2 w-full"
          />
        </div>

        {/* Ad Details */}
        <div>
          <label>Budget (₹)</label>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>

        <div>
          <label>Platform</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="border p-2 w-full"
            required
          >
            <option value="">Select Platform</option>
            <option value="meta ads">Meta Ads</option>
            <option value="google ads">Google Ads</option>
          </select>
        </div>

        <div>
          <label>Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded w-full mt-2"
        >
          Submit Advertisement
        </button>
      </form>
    </div>
  );
};

export default Ads;
