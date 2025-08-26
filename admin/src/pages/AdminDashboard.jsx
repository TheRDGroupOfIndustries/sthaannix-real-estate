import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Users, RefreshCw, CreditCard, FileText, Home } from "lucide-react";
import { adminAPI, paymentsAPI } from "../api/api";
import UsersOverview from "../components/UsersOverview";
import PaymentApproval from "../components/PaymentApproval";
import AdsApproval from "../components/AdsApproval";
import PropertyApproval from "../components/PropertyApproval";
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");

  // Users state
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);

  // Payments state
  const [payments, setPayments] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);

  // Ads state
  const [ads, setAds] = useState([]);
  const [adsLoading, setAdsLoading] = useState(true);

  // Properties state
  const [propertyLoading, setPropertyLoading] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  const [pendingProperties, setPendingProperties] = useState([]);
  const [rejectedProperties, setRejectedProperties] = useState([]);
  // Fetch all users and their data
  const fetchUsersData = async () => {
    try {
      setUsersLoading(true);

      const response = await adminAPI.getUsersData();
      // console.log("fetchUsersData:", response.data.data);

      if (response.data.success) {
        setUsers(response.data.data);
      } else {
        toast.error(response.data.message || "Failed to load data");
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
      toast.error("Error loading data");
    } finally {
      setUsersLoading(false);
    }
  };
  const fetchAdminStats = async () => {
    try {
      setStatsLoading(true);
      const response = await adminAPI.getStats();
      // console.log("fetchAdminStats",response.data);

      if (response.status == 200) {
        setStats(response.data);
      } else {
        toast.error(response.data.message || "Failed to load data");
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
      toast.error("Error loading data");
    } finally {
      setStatsLoading(false);
    }
  };

  // Load payments
  const loadPayments = async () => {
    try {
      setPaymentsLoading(true);
      const response = await paymentsAPI.getAll();

      console.log("loadPayments:", response.data.data);

      if (response.status === 200) {
        setPayments(response.data.data ?? []);
      } else {
        toast.error(response.data.message || "Failed to load data");
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
      toast.error("Error loading data");
    } finally {
      setPaymentsLoading(false);
    }
  };

  // Load ads (implement your adminAPI.getAdsData())
  const loadAds = async () => {
    try {
      setAdsLoading(true);
      const response = await adminAPI.getAllAdRequests();
      //   console.log("loadAds: ", response.data);

      if (response.status === 200) {
        setAds(response.data.campaigns || []);
      } else {
        toast.error(response.data.message || "Failed to load ads");
      }
    } catch (error) {
      console.error("Error loading ads:", error);
      toast.error("Error loading ads");
    } finally {
      setAdsLoading(false);
    }
  };

  // Approve ad campaign
  const approveAd = async (id) => {
    try {
      const res = await adminAPI.updateAdStatus(id, "approved");
      if (res.status === 200) {
        toast.success("Ad approved");
        await loadAds();
      } else {
        toast.error("Failed to approve ad");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error approving ad");
    }
  };

  // Reject ad campaign
  const rejectAd = async (id) => {
    try {
      const res = await adminAPI.updateAdStatus(id, "rejected");
      if (res.status === 200) {
        toast.success("Ad rejected");
        await loadAds();
      } else {
        toast.error("Failed to reject ad");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error rejecting ad");
    }
  };

  // Load properties (implement your adminAPI.getPropertiesData())
  const loadProperties = async () => {
    setPropertyLoading(true);
    try {
      const [pendingRes, rejectedRes] = await Promise.all([
        adminAPI.getProperties("pending"),
        adminAPI.getProperties("rejected"),
      ]);
      console.log("rejectedRes: ", rejectedRes);

      if (pendingRes.status === 200) {
        setPendingProperties(pendingRes.data);
      } else {
        toast.error("Failed to fetch pending properties");
      }
      if (rejectedRes.status === 200) {
        setRejectedProperties(rejectedRes.data);
      } else {
        toast.error("Failed to fetch rejected properties");
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast.error("Error fetching properties");
    } finally {
      setPropertyLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    setLoadingId(id);
    try {
      if (status === "approved") {
        await adminAPI.approveProperty(id);
        toast.success("Property approved");
      } else if (status === "rejected") {
        const reason =
          prompt("Enter reason for rejection") || "No reason provided";
        if (reason === null) {
          setLoadingId(null);
          return;
        }

        const res = await adminAPI.rejectProperty(id, reason);
        console.log("rejectProperty: ", res);

        toast.success("Property rejected");
      }
      await loadProperties();
    } catch (error) {
      console.error("Status change error:", error);
      toast.error("Failed to update property status");
    } finally {
      setLoadingId(null);
    }
  };

  useEffect(() => {
    if (activeTab === "users") {
      fetchUsersData();
      fetchAdminStats();
    } else if (activeTab === "payments") {
      loadPayments();
    } else if (activeTab === "ads") {
      loadAds();
    } else if (activeTab === "properties") {
      loadProperties();
    }
  }, [activeTab]);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (activeTab === "users") {
      await fetchUsersData();
      await fetchAdminStats();
    } else if (activeTab === "payments") {
      await loadPayments();
    } else if (activeTab === "ads") {
      await loadAds();
    } else if (activeTab === "properties") {
      await loadProperties();
    }
    setTimeout(() => {
      setRefreshing(false);
      toast.success("Data refreshed");
    }, 700);
  };

  // Payment actions
  const approvePayment = async (id) => {
    try {
      const res = await paymentsAPI.approve(id);

      if (res.status === 200) {
        const updatedRes = await paymentsAPI.getAll();

        setPayments(updatedRes.data?.data ?? []);

        toast.success("Payment approved successfully");
      } else {
        toast.error("Failed to approve payment");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error approving payment");
    }
  };

  // Cancel payment
  const cancelPayment = async (id, reason) => {
    try {
      const res = await paymentsAPI.reject(id, reason);

      if (res.status === 200) {
        const updatedRes = await paymentsAPI.getAll();

        setPayments(updatedRes.data.data ?? []); // ✅ fixed

        toast.success("Payment rejected");
      } else {
        toast.error("Failed to reject payment");
      }
    } catch (error) {
      console.error("Reject payment error:", error);
      toast.error(error.response?.data?.message || "Error rejecting payment");
    }
  };

  const approveWalletPayment = async (id, utrNumber, paymentMethod) => {
    try {
      const res = await paymentsAPI.walletApprove(id, utrNumber, paymentMethod);
      console.log("rapprove: ", res);

      if (res.status === 200) {
        const updatedRes = await paymentsAPI.getAll();

        setPayments(updatedRes.data.data ?? []);
        toast.success("Wallet Payment approved");
      } else {
        toast.error("Failed to approve payment");
      }
    } catch (error) {
      console.error("Approve payment error:", error);
      toast.error(error.response?.data?.message || "Error approving payment");
    }
  };

  const cancelWalletPayment = async (id, reason) => {
    try {
      // Call backend reject API with reason
      const res = await paymentsAPI.walletReject(id, reason);
      console.log("cancelWalletPayment: ", res);

      if (res.status === 200) {
        const updatedRes = await paymentsAPI.getAll();
        setPayments(updatedRes.data.data ?? []);
        toast.success("Wallet Payment rejected");
      } else {
        toast.error("Failed to reject payment");
      }
    } catch (error) {
      console.error("Reject payment error:", error);
      toast.error(error.response?.data?.message || "Error rejecting payment");
    }
  };

  const pendingPayments = payments.filter((p) => p.status === "pending");
  const canceledPayments = payments.filter((p) => p.status === "rejected");

  const loading =
    (activeTab === "users" && usersLoading) ||
    (activeTab === "payments" && paymentsLoading) ||
    (activeTab === "ads" && adsLoading) ||
    (activeTab === "properties" && propertyLoading);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100"
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-6"
          />
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-semibold text-gray-700 mb-2"
          >
            Loading {activeTab === "users" ? "Users Data" : "Payments"}...
          </motion.h3>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header with tabs */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">
              {activeTab === "users" && (
                <>
                  <Users className="w-8 h-8 text-blue-600 inline mr-2" /> Admin
                  Dashboard
                </>
              )}
              {activeTab === "payments" && (
                <>
                  <CreditCard className="w-8 h-8 text-blue-600 inline mr-2" />{" "}
                  Payment Approval
                </>
              )}
              {activeTab === "ads" && (
                <>
                  <FileText className="w-8 h-8 text-blue-600 inline mr-2" /> Ads
                  Approval
                </>
              )}
              {activeTab === "properties" && (
                <>
                  <Home className="w-8 h-8 text-blue-600 inline mr-2" />{" "}
                  Property Approval
                </>
              )}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setActiveTab("users")}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === "users"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                Users Overview
              </button>
              <button
                onClick={() => setActiveTab("payments")}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === "payments"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                Payment Approval
              </button>
              <button
                onClick={() => setActiveTab("ads")}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === "ads"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                Ads Approval
              </button>
              <button
                onClick={() => setActiveTab("properties")}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === "properties"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                Property Approval
              </button>
            </div>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`}
              />
              {refreshing ? "Refreshing" : "Refresh"}
            </button>
          </div>
        </div>

        {/* Tab content */}
        {activeTab === "users" && (
          <UsersOverview
            users={users}
            stats={stats}
            usersLoading={usersLoading}
            statsLoading={statsLoading}
          />
        )}
        {activeTab === "payments" && (
          <PaymentApproval
            payments={payments}
            pendingPayments={pendingPayments}
            canceledPayments={canceledPayments}
            paymentsLoading={paymentsLoading}
            approvePayment={approvePayment}
            cancelPayment={cancelPayment}
            approveWalletPayment={approveWalletPayment}
            cancelWalletPayment={cancelWalletPayment}
          />
        )}
        {activeTab === "ads" && (
          <AdsApproval
            ads={ads}
            adsLoading={adsLoading}
            approveAd={approveAd}
            rejectAd={rejectAd}
          />
        )}
        {activeTab === "properties" && (
          <PropertyApproval
            propertyLoading={propertyLoading}
            loadingId={loadingId}
            pendingProperties={pendingProperties}
            rejectedProperties={rejectedProperties}
            handleStatusChange={handleStatusChange}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
