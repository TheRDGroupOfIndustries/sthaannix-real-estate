import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit3, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

const PropertyOwnerDashboard = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      // Replace with API call
      const response = {
        data: {
          success: true,
          property: [],
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
        // API call to remove
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
        <h1 className="text-3xl font-bold">Property Owner Dashboard</h1>
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

export default PropertyOwnerDashboard;
