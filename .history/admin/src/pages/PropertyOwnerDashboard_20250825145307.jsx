import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit3, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import api from "../api/api";
import { paymentsAPI } from '../api/api';


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
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    console.log("PropertyOwnerDashboard: ",user);
    
    if (!user || user.role !== "owner") {
      toast.error("Unauthorized. Please login as Owner.");
      navigate("/login");
      return;
    }

    if (activeTab === "properties") {
      fetchProperties();
    } else {
      loadPayments(user.email);
    }
  }, [activeTab]);

  const fetchProperties = async () => {
  setLoading(true);
  try {
    const token = localStorage.getItem("token"); // if you store JWT in localStorage

    const response = await api.get("/properties/my-properties", {
      headers: {
        Authorization: `Bearer ${token}`, // backend expects req.user
      },
    });

    if (response.status === 200) {
      setProperties(response.data); // backend returns array of properties
    } else {
      toast.error("Failed to fetch properties");
    }
  } catch (error) {
    console.error("Fetch properties error:", error);
    toast.error("Failed to fetch properties");
  } finally {
    setLoading(false);
  }
};

  const handleDeleteProperty = async (id) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        const token = localStorage.getItem("token");
        await api.delete(`/properties/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProperties((prev) => prev.filter((p) => p._id !== id));
        toast.success("Property deleted successfully");
      } catch (error) {
        toast.error("Failed to delete property");
      }
    }
  };

const loadPayments = async (email) => {
  setLoading(true);
  try {
    const res = await paymentsAPI.myPayments();

    if (res.data?.success) {
      setPayments(res.data.transactions); 
    } else {
      toast.error("Failed to load payments");
      setPayments([]);
    }
  } catch (error) {
    console.error("Load payments error:", error);
    toast.error("Failed to load payments from server");
    setPayments([]);
  } finally {
    setLoading(false);
  }
};

 const handleDeletePayment = (id) => {
    if (window.confirm("Are you sure you want to delete this payment record?")) {
      const allPayments = JSON.parse(localStorage.getItem("paymentRecords") || "[]");
      const updatedPayments = allPayments.filter(p => p.id !== id);
      localStorage.setItem("paymentRecords", JSON.stringify(updatedPayments));
      setPayments(updatedPayments.filter(p => p.user.email === (JSON.parse(localStorage.getItem("user") || "{}")).email));
      toast.success("Payment record deleted");
    }
  };

  return (
     <div className="min-h-screen pt-16 px-6 bg-gray-50 max-w-7xl mx-auto">
       <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Broker Dashboard</h1>
    <div className="flex space-x-5"> {/*  20px gap between buttons */}
      {activeTab === "properties" && (
        <button
          onClick={() => navigate("/add")}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          <Plus size={20} />
          Add Property
        </button>
      )}
      {activeTab === "properties" && (
        <button
          onClick={() => navigate("/wallet")}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          <Plus size={20} />
          W
        </button>
      )}
    </div>
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
            src={
              property.images && property.images.length > 0
                ? property.images[0]
                : "/placeholder.jpg"
            }
            alt={property.title}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />

            <h2 className="font-semibold text-lg mb-1">{property.title}</h2>
              <p className="text-gray-600 mb-1">{property.location?.address}</p>
              <p className="text-blue-600 font-bold mb-2">
                ₹{property.price.toLocaleString()}
              </p>
              <div className="flex justify-between text-sm text-gray-500 mb-3">
                <span>{property.bhk} BHK</span>
                <span>{property.bathroom} Baths</span>
                <span>{property.size} Sq Ft</span>
              </div>

                <div className="flex space-x-2 mb-3 flex-wrap">
                 {property.amenities && property.amenities.length > 0 && (
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
              {payments.map((payment, idx) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{idx + 1}</td>
                  <td className="px-6 py-4 font-mono text-sm whitespace-nowrap">
                        {payment.utrNumber || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(payment.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {payment.purpose || "Wallet Top-up"}
                      </td>

                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => handleDeletePayment(payment.id)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
                      title="Delete Payment"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
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
