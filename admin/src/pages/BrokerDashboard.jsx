import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Plus, Edit3, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";

const backendurl = ""; // Your backend base URL or leave if no backend

const BrokerDashboard = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch properties for Broker on mount
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      // Replace this with actual API call if available
      // const response = await axios.get(`${backendurl}/api/products/list?role=broker`);
      // Mocked property data:
      const response = {
        data: {
          success: true,
          property: [
            {
              _id: "1",
              title: "Luxury Villa",
              location: "Los Angeles",
              price: 500000,
              beds: 4,
              baths: 3,
              sqft: 3500,
              availability: "rent",
              type: "Villa",
              image: ["https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?cs=srgb&dl=pexels-binyaminmellish-186077.jpg&fm=jpg"],
              amenities: ["Pool", "Garage"],
              createdAt: new Date().toISOString(),
            },
            {
              _id: "2",
              title: "Modern Apartment",
              location: "New York",
              price: 300000,
              beds: 2,
              baths: 2,
              sqft: 1200,
              availability: "buy",
              type: "Apartment",
              image: ["data:image/jpeg;base64,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"],
              amenities: ["Gym", "Security system"],
              createdAt: new Date().toISOString(),
            },
          ],
        },
      };
      if (response.data.success) {
        setProperties(response.data.property);
      } else {
        toast.error("Failed to fetch properties");
      }
    } catch (error) {
      toast.error("Failed to fetch properties");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        // await axios.post(`${backendurl}/api/products/remove`, { id });
        // Mock delete success:
        setProperties((prev) => prev.filter((p) => p._id !== id));
        toast.success("Property deleted successfully");
      } catch (error) {
        toast.error("Failed to delete property");
      }
    }
  };

  return (
    <div className="min-h-screen pt-16 px-6 bg-gray-50 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Broker Dashboard</h1>
        <button
          onClick={() => navigate("/add")}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          <Plus size={20} />
          Add Property
        </button>
      </div>
      {loading ? (
        <div className="text-center py-20 text-lg">Loading properties...</div>
      ) : properties.length === 0 ? (
        <div className="text-center py-20 text-lg">No properties found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div
              key={property._id}
              className="bg-white p-4 rounded-lg shadow group hover:shadow-lg transition relative"
            >
              <img
                src={property.image[0] || "/placeholder.jpg"}
                alt={property.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h2 className="font-semibold text-lg mb-1">{property.title}</h2>
              <p className="text-gray-600 mb-1">{property.location}</p>
              <p className="text-blue-600 font-bold mb-2">₹{property.price.toLocaleString()}</p>
              <div className="flex justify-between text-sm text-gray-500 mb-3">
                <span>{property.beds} Beds</span>
                <span>{property.baths} Baths</span>
                <span>{property.sqft} Sq Ft</span>
              </div>
              <div className="flex space-x-2 mb-3 flex-wrap">
                {property.amenities.slice(0, 4).map((a, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-100 text-blue-700 px-2 rounded-full text-xs"
                  >
                    {a}
                  </span>
                ))}
                {property.amenities.length > 4 && (
                  <span className="text-gray-400 text-xs">{`+${property.amenities.length - 4} more`}</span>
                )}
              </div>
              <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => navigate(`/update/${property._id}`)}
                  className="p-2 bg-yellow-400 rounded hover:bg-yellow-500"
                  aria-label="Edit property"
                >
                  <Edit3 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(property._id)}
                  className="p-2 bg-red-500 rounded hover:bg-red-600"
                  aria-label="Delete property"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrokerDashboard;

