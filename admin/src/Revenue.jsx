import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { BarChart2, CreditCard, DollarSign, Megaphone } from "lucide-react";
import http from "./api/http";
import { Backendurl } from "./config/constants";

const Revenue = () => {
  const [loading, setLoading] = useState(true);
  const [revenue, setRevenue] = useState(null);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        setLoading(true);
        const res = await http.get(`${Backendurl}/revenue`);
        if (res.data.success) {
          setRevenue(res.data.data);
        } else {
          toast.error(res.data.message || "Failed to fetch revenue");
        }
      } catch (error) {
        toast.error("Error fetching revenue");
        console.error("error: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRevenue();
  }, []);

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
            Loading Revenue Report...
          </motion.h3>
        </div>
      </motion.div>
    );
  }

  if (!revenue) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-700">No revenue data available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BarChart2 className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Revenue Report
            </h1>
          </div>
          <p className="text-gray-600">
            View the total revenue earned by the admin.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4"
          >
            <div className="p-3 bg-blue-100 rounded-xl">
              <CreditCard className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Registration Fees
              </p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{revenue.totalRegistrationFees}
              </p>
              <p className="text-xs text-gray-500">
                {revenue.userCount} users paid registration
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4"
          >
            <div className="p-3 bg-green-100 rounded-xl">
              <Megaphone className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Ad Campaign Revenue (Admin Share)
              </p>
              <p className="text-2xl font-bold text-gray-900">
               ₹{Number(revenue.totalAdRevenue).toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">
                {revenue.adRevenues?.length} campaigns
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4"
          >
            <div className="p-3 bg-yellow-100 rounded-xl">
              <BarChart2 className="w-8 h-8 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{revenue.finalRevenue}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Admin Info */}
        <div className="bg-white rounded-xl shadow border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Admin Info
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="text-xs text-gray-500">Name</span>
              <div className="font-medium">{revenue.admin?.name}</div>
            </div>
            <div>
              <span className="text-xs text-gray-500">Email</span>
              <div className="font-medium">{revenue.admin?.email}</div>
            </div>
            <div>
              <span className="text-xs text-gray-500">Phone</span>
              <div className="font-medium">{revenue.admin?.phone}</div>
            </div>
            <div>
              <span className="text-xs text-gray-500">Role</span>
              <div className="font-medium">{revenue.admin?.role}</div>
            </div>
          </div>
        </div>

        {/* Ad Campaign Table */}

        <div className="mt-10 mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-green-500" />
            Ad Campaign Revenue Share
          </h2>

          {revenue.adRevenues.length === 0 ? (
            <p className="text-gray-500 bg-white rounded-xl p-4 shadow border border-gray-200">
              No ad campaign revenue found.
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
                      User Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Budget
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Admin Share
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {revenue.adRevenues.map((ad, idx) => (
                    <motion.tr
                      key={ad.user._id || idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">{idx + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {ad.user?.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ₹{ad.budget}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-mono">
                        ₹{ad.adminShare}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Revenue;
