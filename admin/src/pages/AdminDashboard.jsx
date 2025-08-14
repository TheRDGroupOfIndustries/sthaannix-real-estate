import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
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
} from "lucide-react";
// import { backendurl } from "../config/constants";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch all users and their data
  const fetchUsersData = async () => {
    try {
      setLoading(true);
      // Mock API, replace with your actual backend URL and endpoint
      const response = await axios.get(`${backendurl}/api/admin/users-with-properties-leads`);

      if (response.data.success) {
        setUsers(response.data.users);
      } else {
        toast.error(response.data.message || "Failed to load data");
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
      toast.error("Error loading data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUsersData();
    setRefreshing(false);
    toast.success("Data refreshed");
  };

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
            Loading Admin Data
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-500"
          >
            Please wait while we fetch all user details...
          </motion.p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600" />
            Admin Dashboard - Users Overview
          </h1>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing" : "Refresh"}
          </button>
        </div>

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
                  No. of Properties
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No. of Leads
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

        {/* Optional: Add summary stats below */}
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
                {/* Customize for your needs or remove if not available */}
                {users.reduce(
                  (acc, cur) => acc + (cur.activities?.length || 0),
                  0
                )}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;