import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Backendurl } from "../config/constants";
import { toast } from "react-hot-toast";

const Ads = ({ user }) => {
  const { id } = useParams(); // propertyId
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [budget, setBudget] = useState("");
  const [platform, setPlatform] = useState("");
  const [startDate, setStartDate] = useState("");
  const [userName, setUserName] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

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
    setUserName(parsedUser.name);
    setCurrentUser(parsedUser); 
  }
}, []);

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!platform) {
    toast.error("Please select a platform");
    return;
  }
  if (Number(budget) < 1500) {
    toast.error("Minimum advertisement budget is ₹1500");
    return;
  }

  if (!currentUser?.id) {
    toast.error("User not found");
    return;
  }

  try {
    const response = await axios.post(`${Backendurl}/ad/create`, {
      userId: currentUser.id, // use 'id' instead of '_id'
      propertyId: id,
      budget: Number(budget), // convert to number
      platform: [platform],
      startDate,
    });

    toast.success(response.data.message);
    navigate("/dashboard"); // redirect after success
  } catch (error) {
    console.error(error);
    toast.error(
      error.response?.data?.message || "Error submitting ad request. Try again."
    );
  }
};


  return (
    <div className="max-w-lg mx-auto p-6 m-5 border rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Submit Advertisement</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        
           {/* User */}
        <div>
          <label>User Name</label>
          <input
            type="text"
            value={userName}
            readOnly
            className="border p-2 w-full"
          />
        </div>
        
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
