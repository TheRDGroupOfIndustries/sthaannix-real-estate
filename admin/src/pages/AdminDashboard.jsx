import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Home,
  Mail,
  Phone,
  User,
  ClipboardList,
  RefreshCw,
  BarChart2,
  CalendarCheck,
  CreditCard,
  CheckCircle,
  XCircle,
  FileText,
  Image,
} from "lucide-react";
import { adminAPI ,paymentsAPI} from "../api/api";
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");
  
  // Users state
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  
  // Payments state
  const [payments, setPayments] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  
  const [refreshing, setRefreshing] = useState(false);

  // Fetch all users and their data
  const fetchUsersData = async () => {
    try {
      setUsersLoading(true);
      const response = await adminAPI.getPendingUsers();
      // console.log("fetchUsersData:",response);
      if (response.data.success) {
        setUsers(response.data.users);
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

  // Load payments from localStorage
  const loadPayments =async () => {

    try {
      setPaymentsLoading(true);
     const response = await paymentsAPI.getAll();
      console.log("loadPayments:",response.data);
      
      if (response.status==200) {
         setPayments(response.data);
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

  useEffect(() => {
    if (activeTab === "users") {
      fetchUsersData();
    } else {
      loadPayments();
    }
  }, [activeTab]);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (activeTab === "users") {
      await fetchUsersData();
    } else {
      loadPayments();
    }
    setTimeout(() => {
      setRefreshing(false);
      toast.success("Data refreshed");
    }, 700);
  };

  // Payment actions
  const approvePayment = (id) => {
    const updated = payments.map(p =>
      p.id === id ? { ...p, status: "approved", approvalTimestamp: new Date().toISOString() } : p
    );
    setPayments(updated);
    localStorage.setItem("paymentRecords", JSON.stringify(updated));
    toast.success("Payment approved");
  };

  const cancelPayment = (id) => {
    const updated = payments.map(p =>
      p.id === id ? { ...p, status: "canceled", approvalTimestamp: null } : p
    );
    setPayments(updated);
    localStorage.setItem("paymentRecords", JSON.stringify(updated));
    toast.success("Payment canceled");
  };

  const pendingPayments = payments.filter(p => p.status === "pending");
  const canceledPayments = payments.filter(p => p.status === "canceled");

  const loading = activeTab === "users" ? usersLoading : paymentsLoading;

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
              {activeTab === "users" ? (
                <>
                  <Users className="w-8 h-8 text-blue-600 inline mr-2" />
                  Admin Dashboard
                </>
              ) : (
                <>
                  <CreditCard className="w-8 h-8 text-blue-600 inline mr-2" />
                  Payment Approvals
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
                Payment Approvals
              </button>
            </div>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Refreshing" : "Refresh"}
            </button>
          </div>
        </div>

        {/* Tab content */}
        {activeTab === "users" ? (
          <>
            {/* Users Overview Content */}
            <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Properties
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Leads
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-500">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    users.map((user, idx) => (
                      <motion.tr
                        key={user._id || idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap flex items-center gap-2">
                          <User className="w-5 h-5 text-gray-400" /> {user.name || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{user.role || "-"}</td>
                        <td className="px-6 py-4 whitespace-nowrap flex items-center gap-1">
                          <Mail className="w-4 h-4 text-gray-400" />
                          {user.email || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap flex items-center gap-1">
                          <Phone className="w-4 h-4 text-gray-400" />
                          {user.phone || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap flex items-center gap-1">
                          <Home className="w-4 h-4 text-gray-400" />
                          {user.properties?.length || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap flex items-center gap-1">
                          <ClipboardList className="w-4 h-4 text-gray-400" />
                          {user.leads?.length || 0}
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Summary stats */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4"
              >
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4"
              >
                <div className="p-3 bg-green-100 rounded-xl">
                  <Home className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Properties</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.reduce((acc, cur) => acc + (cur.properties?.length || 0), 0)}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4"
              >
                <div className="p-3 bg-purple-100 rounded-xl">
                  <ClipboardList className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Leads</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.reduce((acc, cur) => acc + (cur.leads?.length || 0), 0)}
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4"
              >
                <div className="p-3 bg-yellow-100 rounded-xl">
                  <CalendarCheck className="w-8 h-8 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Recent Activities</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {users.reduce((acc, cur) => acc + (cur.activities?.length || 0), 0)}
                  </p>
                </div>
              </motion.div>
            </div>
          </>
        ) : (
          <>
            {/* Payment Approvals Content */}
            {pendingPayments.length === 0 ? (
              <p className="text-center text-gray-500 py-20 text-lg bg-white rounded-xl shadow border border-gray-200">
                No pending payments for approval.
              </p>
            ) : (
              <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        No
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transaction Ref
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment Method
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment Proof
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {pendingPayments.map((payment, idx) => (
                      <motion.tr
                        key={payment.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">{idx + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{payment.user.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{payment.user.role}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{payment.user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                          {payment.paymentRef}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(payment.timestamp).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{payment.paymentMethod}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            {payment.images?.map((imgUrl, i) => (
                              <div
                                key={i}
                                className="w-12 h-12 rounded overflow-hidden border border-gray-300 cursor-pointer group relative"
                                title="View Image"
                                onClick={() => window.open(imgUrl, '_blank')}
                              >
                                <img
                                  src={imgUrl}
                                  alt={`payment-proof-${i}`}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs rounded">
                                  <Image className="w-4 h-4" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                          <button
                            onClick={() => {
                              approvePayment(payment.id);
                              const approvedUser = {
                                ...payment.user, 
                                paymentRef: payment.paymentRef, 
                                paymentMethod: payment.paymentMethod, 
                                timestamp: payment.timestamp
                              };
                              localStorage.setItem("approvedUser", JSON.stringify(approvedUser));
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
                            title="Approve Payment"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approve
                          </button>
                          <button
                            onClick={() => cancelPayment(payment.id)}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
                            title="Cancel Payment"
                          >
                            <XCircle className="w-4 h-4" />
                            Cancel
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            
{/* Approved payments section */}
<section className="mt-16">
  <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
    <CheckCircle className="w-6 h-6 text-green-600" />
    Approved Payments
  </h2>
  {payments.filter(p => p.status === "approved").length === 0 ? (
    
    <p className="text-gray-500 bg-white rounded-xl p-4 shadow border border-gray-200">
      No approved payments yet.
    </p>
  ) : (
    <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-200">
     
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UTR Number</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reviewed At</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Screenshot</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {payments
            .filter(p => p.status === "approved")
            .map((payment, idx) => (
              <motion.tr
                key={payment._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap">{idx + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap">{payment.user?.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{payment.user?.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{payment.purpose}</td>
                <td className="px-6 py-4 whitespace-nowrap font-mono">₹{payment.amount}</td>
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{payment.utrNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(payment.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {payment.reviewedAt ? new Date(payment.reviewedAt).toLocaleString() : "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {payment.screenshot ? (
                    <div
                      className="w-12 h-12 rounded overflow-hidden border border-gray-300 cursor-pointer group relative"
                      title="View Screenshot"
                      onClick={() => window.open(payment.screenshot, "_blank")}
                    >
                      <img
                        src={payment.screenshot}
                        alt="payment-proof"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs rounded">
                        <Image className="w-4 h-4" />
                      </div>
                    </div>
                  ) : (
                    "-"
                  )}
                </td>
              </motion.tr>
            ))}
        </tbody>
      </table>
    </div>
  )}
</section>



            {/* Canceled payments section */}
            <section className="mt-16">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-gray-600" />
                Canceled Payments
              </h2>
              {canceledPayments.length === 0 ? (
                <p className="text-gray-500 bg-white rounded-xl p-4 shadow border border-gray-200">
                  No canceled payments.
                </p>
              ) : (
                <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          No
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Transaction Ref
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Payment Method
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Payment Proof
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {canceledPayments.map((payment, idx) => (
                        <motion.tr
                          key={payment.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">{idx + 1}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{payment.user.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{payment.user.role}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{payment.user.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                            {payment.paymentRef}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {new Date(payment.timestamp).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{payment.paymentMethod}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex gap-2">
                              {payment.images?.map((imgUrl, i) => (
                                <div
                                  key={i}
                                  className="w-12 h-12 rounded overflow-hidden border border-gray-300 cursor-pointer group relative"
                                  title="View Image"
                                  onClick={() => window.open(imgUrl, '_blank')}
                                >
                                  <img
                                    src={imgUrl}
                                    alt={`payment-proof-${i}`}
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs rounded">
                                    <Image className="w-4 h-4" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;