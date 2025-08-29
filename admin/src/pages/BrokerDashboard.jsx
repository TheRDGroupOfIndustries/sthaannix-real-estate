import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Plus, Edit3, Trash2, TvMinimalPlay } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import api from "../api/api";
import { paymentsAPI } from '../api/api';

const BrokerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("properties");
  const [properties, setProperties] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ads, setAds] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user || user.role !== "broker") {
      toast.error("Unauthorized. Please login as Broker.");
      navigate("/login");
      return;
    }

   if (activeTab === "properties") fetchProperties();
    else if (activeTab === "payments") loadPayments(user.email);
    else if (activeTab === "ads") loadAds(user.id);

  }, [activeTab]);

  const fetchProperties = async () => {
  setLoading(true);
  try {
    const token = localStorage.getItem("token");
    const response = await api.get("/properties/my-properties", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      setProperties(Array.isArray(response.data) ? response.data : response.data.properties || []);
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

const loadAds = async () => {
  setLoading(true);
  try {
    const token = localStorage.getItem("token");
    const res = await api.get("/ad/my-ads", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setAds(res.data.campaigns);
  } catch (error) {
    console.error(error);
    toast.error("Failed to load advertisement details");
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

const handleDeletePayment = async (id, type) => {
  if (!window.confirm("Are you sure you want to delete this transaction?")) return;

  try {
    const token = localStorage.getItem("token");

    await api.delete(`/payment/history/${type}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    toast.success("Transaction deleted successfully ✅");
    loadPayments(); 
  } catch (err) {
    console.error("Error deleting transaction", err);
    toast.error("Failed to delete transaction ❌");
  }
};

  const handleDeleteAds = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ad?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await api.delete(`/ad/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(res.data.message);
      setAds((prevAds) => prevAds.filter((ad) => ad._id !== id));
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete ad");
    }
  };

  useEffect(() => {
    loadAds();
  }, []);

  return (
    <div className="min-h-screen pt-16 px-3 sm:px-4 md:px-5 lg:px-6 bg-gray-50 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 md:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Broker Dashboard</h1>
        <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto"> 
          {activeTab === "properties" && (
            <button
              onClick={() => navigate("/add")}
              className="flex items-center gap-1 sm:gap-2 bg-blue-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded hover:bg-blue-700 transition text-sm sm:text-base flex-1 sm:flex-none justify-center"
            >
              <Plus size={16} className="sm:size-5" />
              Add Property
            </button>
          )}
          {activeTab === "properties" && (
            <button
              onClick={() => navigate("/wallet")}
              className="flex items-center gap-1 sm:gap-2 bg-green-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded hover:bg-green-700 transition text-sm sm:text-base flex-1 sm:flex-none justify-center"
            >
              <Plus size={16} className="sm:size-5" />
              Wallet
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-col sm:flex-row border border-gray-300 rounded-lg overflow-hidden mb-6 md:mb-8">
        <button
          onClick={() => setActiveTab("properties")}
          className={`px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium transition-colors flex-1 ${
            activeTab === "properties"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          My Properties
        </button>
        <button
          onClick={() => setActiveTab("payments")}
          className={`px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium transition-colors flex-1 ${
            activeTab === "payments"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          Payment History
        </button>
        <button
          onClick={() => setActiveTab("ads")}
          className={`px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium transition-colors flex-1 ${
            activeTab === "ads"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          Advertisment Detail
        </button>
      </div>

      {/* Tab Content */}
      {loading ? (
        <div className="text-center py-12 md:py-20 text-base md:text-lg">Loading...</div>
      ) : activeTab === "properties" ? (
        properties.length === 0 ? (
          <div className="text-center py-12 md:py-20 text-base md:text-lg">No properties found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {properties.map((property) => (
              <div
                key={property._id} 
                className="bg-white p-3 md:p-4 rounded-lg shadow group hover:shadow-lg transition relative"
              >
                <img
                  src={property.images?.[0] || "/placeholder.jpg"}
                  alt={property.title}
                  className="w-full h-40 sm:h-48 object-cover rounded-lg mb-3 md:mb-4"
                />
                <h2 className="font-semibold text-base md:text-lg mb-1 line-clamp-1">{property.title}</h2>
                <p className="text-gray-600 text-sm mb-1 line-clamp-1">{property.location?.address}</p>
                <p className="text-blue-600 font-bold mb-2 text-base md:text-lg">
                  ₹{property.price.toLocaleString()}
                </p>
                <div className="flex justify-between text-xs sm:text-sm text-gray-500 mb-2 md:mb-3">
                  <span>{property.bhk} BHK</span>
                  <span>{property.size} Sq Ft</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-2 md:mb-3">
                  {property.amenities?.slice(0, 3).map((a, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs"
                    >
                      {a}
                    </span>
                  ))}
                  {property.amenities?.length > 3 && (
                    <span className="text-gray-400 text-xs">{`+${property.amenities.length - 3} more`}</span>
                  )}
                </div>
                <div className="flex justify-end gap-1 sm:gap-2 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => navigate(`/update/${property._id}`)}
                    className="p-1.5 sm:p-2 bg-yellow-400 rounded hover:bg-yellow-500"
                    title="Edit"
                  >
                    <Edit3 size={14} className="sm:size-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteProperty(property._id)}
                    className="p-1.5 sm:p-2 bg-red-500 rounded hover:bg-red-600"
                    title="Delete"
                  >
                    <Trash2 size={14} className="sm:size-4" />
                  </button>
                  <button
                    onClick={() => navigate(`/ads/${property._id}`)}
                    className="p-1.5 sm:p-2 bg-green-400 rounded hover:bg-green-500"
                    title="Advertise"
                  >
                    <TvMinimalPlay size={14} className="sm:size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : activeTab === "payments" ? (
        payments.length === 0 ? (
          <div className="text-center py-12 md:py-20 text-base md:text-lg text-gray-500">
            No payment records found.
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg md:rounded-xl shadow border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                  <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UTR</th>
                  <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                  <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-3 py-2 sm:px-4 sm:py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payments.map((payment, idx) => (
                  <tr key={payment.id || payment._id || `payment-${idx}`} className="hover:bg-gray-50">
                    <td className="px-3 py-2 sm:px-4 sm:py-4 whitespace-nowrap text-sm">{idx + 1}</td>
                    <td className="px-3 py-2 sm:px-4 sm:py-4 font-mono text-xs sm:text-sm whitespace-nowrap">{payment.utrNumber || "-"}</td>
                    <td className="px-3 py-2 sm:px-4 sm:py-4 whitespace-nowrap text-sm">{payment.amount || "-"}</td>
                    <td className="px-3 py-2 sm:px-4 sm:py-4 whitespace-nowrap text-xs sm:text-sm">{new Date(payment.createdAt).toLocaleString()}</td>
                    <td className="px-3 py-2 sm:px-4 sm:py-4 whitespace-nowrap text-sm">{payment.purpose || "Wallet Top-up"}</td>
                    <td className="px-3 py-2 sm:px-4 sm:py-4 whitespace-nowrap text-sm">{payment.status || "-"}</td>
                    <td className="px-3 py-2 sm:px-4 sm:py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleDeletePayment(payment._id,payment.type)}
                        className="inline-flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1 rounded-md bg-red-600 text-white hover:bg-red-700 transition text-xs sm:text-sm"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : activeTab === "ads" ? (
        ads.length === 0 ? (
          <div className="text-center py-12 md:py-20 text-base md:text-lg text-gray-500">No advertisements found.</div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg md:rounded-xl shadow border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                  <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                  <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                  <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th>
                  <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                  <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ads.map((ad, idx) => (
                  <tr key={ad._id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 sm:px-4 sm:py-4 text-sm">{idx + 1}</td>
                    <td className="px-3 py-2 sm:px-4 sm:py-4">
                      {ad.property?.images?.length > 0 ? (
                        <img
                          src={ad.property.images[0]}
                          alt={ad.property.title}
                          className="w-12 h-10 sm:w-16 sm:h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-10 sm:w-16 sm:h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2 sm:px-4 sm:py-4 text-sm line-clamp-1 max-w-[120px] sm:max-w-none">{ad.property?.title || "-"}</td>
                    <td className="px-3 py-2 sm:px-4 sm:py-4 text-sm">₹{ad.budget.toLocaleString()}</td>
                    <td className="px-3 py-2 sm:px-4 sm:py-4 text-xs sm:text-sm line-clamp-1 max-w-[100px] sm:max-w-none">{ad.platform.join(", ")}</td>
                    <td className="px-3 py-2 sm:px-4 sm:py-4 text-xs sm:text-sm">{new Date(ad.startDate).toLocaleDateString()}</td>
                    <td className="px-3 py-2 sm:px-4 sm:py-4 text-sm capitalize">{ad.status}</td>
                    <td className="px-3 py-2 sm:px-4 sm:py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleDeleteAds(ad._id)}
                        className="inline-flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1 rounded-md bg-red-600 text-white hover:bg-red-700 transition text-xs sm:text-sm"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : null}
    </div>
  );
};

export default BrokerDashboard;