import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit3, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

const PropertyOwnerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("properties");
  const [properties, setProperties] = useState([]);
  const [payments, setPayments] = useState([
    {
      no: 1,
      uniqueTransactionRef: "TXN123456",
      date: "2024-05-01",
      time: "14:30",
      paymentMethod: "Bank Account",
     
    },
    {
      no: 2,
      uniqueTransactionRef: "TXN789012",
      date: "2024-05-15",
      time: "10:45",
      paymentMethod: "UPI",
      
    }
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeTab === "properties") {
      fetchProperties();
    }
  }, [activeTab]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      // Replace with API call
      const response = {
        data: {
          success: true,
          property: [
            {
              _id: "1",
              title: "Luxury Villa",
              location: "Mumbai",
              price: 25000000,
              beds: 4,
              baths: 3,
              sqft: 3500,
              availability: "rent",
              type: "Villa",
              image: ["https://images.unsplash.com/photo-1580587771525-78b9dba3b914"],
              amenities: ["Pool", "Gym", "Security"],
              createdAt: new Date().toISOString(),
            },
            {
              _id: "2",
              title: "Modern Apartment",
              location: "Bangalore",
              price: 12000000,
              beds: 3,
              baths: 2,
              sqft: 1800,
              availability: "sale",
              type: "Apartment",
              image: ["https://images.unsplash.com/photo-1493809842364-78817add7ffb"],
              amenities: ["Parking", "Lift", "24/7 Water"],
              createdAt: new Date().toISOString(),
            }
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

  const handleDeleteProperty = async (id) => {
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

  const handleDeletePayment = (ref) => {
    if (window.confirm("Are you sure to delete this payment record?")) {
      setPayments((p) => p.filter((pay) => pay.uniqueTransactionRef !== ref));
      toast.success("Payment record deleted");
      // Also call backend API to delete payment if needed
    }
  };

  return (
    <div className="min-h-screen pt-16 px-6 bg-gray-50 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Property Owner Dashboard</h1>
        {activeTab === "properties" && (
          <button
            onClick={() => navigate("/add")}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            <Plus size={20} />
            Add Property
          </button>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex border border-gray-300 rounded-lg overflow-hidden mb-8">
        <button
          onClick={() => setActiveTab("properties")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "properties"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          My Properties
        </button>
        <button
          onClick={() => setActiveTab("payments")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "payments"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          Payment History
        </button>
      </div>

      {/* Tab Content */}
      {loading && activeTab === "properties" ? (
        <div className="text-center py-20 text-lg">Loading properties...</div>
      ) : activeTab === "properties" ? (
        properties.length === 0 ? (
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
                    onClick={() => handleDeleteProperty(property._id)}
                    className="p-2 bg-red-500 rounded hover:bg-red-600"
                    aria-label="Delete property"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : payments.length === 0 ? (
        <div className="text-center py-20 text-lg text-gray-600">
          No payment records found.
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                {["No", "Unique Transaction Reference", "Date", "Time", "Method", "Action"].map((head) => (
                  <th key={head} className="text-left p-3 border-b border-gray-300">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.uniqueTransactionRef} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3 border-b">{payment.no}</td>
                  <td className="p-3 border-b font-mono text-sm">{payment.uniqueTransactionRef}</td>
                  <td className="p-3 border-b">{payment.date}</td>
                  <td className="p-3 border-b">{payment.time}</td>
                  <td className="p-3 border-b">{payment.paymentMethod}</td>
                 
                  <td className="p-3 border-b">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDeletePayment(payment.uniqueTransactionRef)}
                      className="px-3 py-1 rounded bg-red-600 text-white flex items-center gap-1 text-sm"
                    >
                      <Trash2 size={16} />
                      Delete
                    </motion.button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PropertyOwnerDashboard;