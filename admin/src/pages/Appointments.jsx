import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  User,
  Home,
  Check,
  X,
  Loader,
  Filter,
  Search,
  Link as LinkIcon,
  Send,
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { Backendurl } from "../config/constants";
import http from "../api/http";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingMeetingLink, setEditingMeetingLink] = useState(null);
  const [meetingLink, setMeetingLink] = useState("");
  const [loadingAction, setLoadingAction] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await http.get(`${Backendurl}/leads/my-properties`);
      
      if (response.status == 200) {
        // Filter out appointments with missing user data
        const validAppointments = response.data.filter(
          (apt) => apt?.buyer?._id && apt?.property?._id
        )
        setAppointments(validAppointments)
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast.error("Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus, responseMessage) => {
    try {
      setLoadingAction({ id, status: newStatus });
      const response = await http.put(`${Backendurl}/leads/${id}/status`, {
        status: newStatus,
        responseMessage: responseMessage,
      });
      if (response.status == 200) {
        toast.success(`Appointment ${newStatus} successfully`);
        fetchAppointments();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast.error("Failed to update appointment status");
    } finally {
      setLoadingAction(null);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter((apt) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      searchTerm === "" ||
      apt.property?.title?.toLowerCase().includes(search) ||
      apt.buyer?.name?.toLowerCase().includes(search) ||
      apt.buyer?.email?.toLowerCase().includes(search);

    const matchesFilter = filter === "all" || apt.status === filter;

    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
            Loading Leads...
          </motion.h3>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen pt-20 md:pt-32 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header and Search Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 flex items-center gap-2">
              <Calendar className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />
              Leads
            </h1>
            <p className="text-gray-600">
              Manage and track property viewing Leads
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search Leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <Filter className="text-gray-400 hidden md:block" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full md:w-auto rounded-lg border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Leads</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block bg-white rounded-lg shadow-lg overflow-hidden my-10">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAppointments.map((appointment) => (
                  <motion.tr
                    key={appointment._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="hover:bg-gray-50"
                  >
                    {/* Property Details */}
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Home className="w-5 h-5 text-gray-400 mr-2" />
                        <div>
                          <p className="font-medium text-gray-900 ">
                            {appointment.property?.title || "Unknown Property"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {appointment.property.location.city}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Client Details */}
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <User className="w-5 h-5 text-gray-400 mr-2" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {appointment.buyer?.name || "Unknown"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {appointment.buyer?.email || "Unknown"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Date & Time */}
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {new Date(
                              appointment.createdAt
                            ).toLocaleDateString()}
                          </p>
                          <div className="flex items-center text-sm text-gray-500">
                            {new Date(appointment.createdAt).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              }
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {appointment.status.charAt(0).toUpperCase() +
                          appointment.status.slice(1)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleStatusChange(
                              appointment._id,
                              "open",
                              appointment.message
                            )
                          }
                          disabled={
                            loadingAction?.id === appointment._id &&
                            loadingAction?.status === "open"
                          }
                          className="p-1 bg-green-500 text-white rounded hover:bg-green-600"
                          title="Open"
                        >
                          {loadingAction?.id === appointment._id &&
                          loadingAction?.status === "open" ? (
                            <Loader className="animate-spin w-4 h-4" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(
                              appointment._id,
                              "closed",
                              "cancelled"
                            )
                          }
                          disabled={
                            loadingAction?.id === appointment._id &&
                            loadingAction?.status === "closed"
                          }
                          className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                          title="Close"
                        >
                          {loadingAction?.id === appointment._id &&
                          loadingAction?.status === "closed" ? (
                            <Loader className="animate-spin w-4 h-4" />
                          ) : (
                            <X className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAppointments.length === 0 && (
            <div className="text-center py-8 text-gray-500">No Leads found</div>
          )}
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-4 my-6">
          {filteredAppointments.map((appointment) => (
            <motion.div
              key={appointment._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-4"
            >
              <div 
                className="flex justify-between items-start cursor-pointer"
                onClick={() => setExpandedRow(expandedRow === appointment._id ? null : appointment._id)}
              >
                <div className="flex-1">
                  {/* Property */}
                  <div className="flex items-center gap-2 mb-2">
                    <Home className="w-4 h-4 text-gray-400" />
                    <p className="font-medium text-gray-900">
                      {appointment.property?.title || "Unknown Property"}
                    </p>
                  </div>
                  
                  {/* Client */}
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <User className="w-4 h-4" />
                    <span>{appointment.buyer?.name || "Unknown"}</span>
                  </div>
                  
                  {/* Email */}
                  {appointment.buyer?.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{appointment.buyer.email}</span>
                    </div>
                  )}
                  
                  {/* Date */}
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(appointment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {/* Status */}
                  <div className="mt-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        appointment.status
                      )}`}
                    >
                      {appointment.status.charAt(0).toUpperCase() +
                        appointment.status.slice(1)}
                    </span>
                  </div>
                </div>
                <button className="p-1">
                  {expandedRow === appointment._id ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>

              {expandedRow === appointment._id && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                  {/* Property Location */}
                  {appointment.property?.location?.city && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-1">Location</h3>
                      <p className="text-sm text-gray-600">{appointment.property.location.city}</p>
                    </div>
                  )}
                  
                  {/* Time */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Time</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(appointment.createdAt).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        }
                      )}
                    </p>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex justify-center gap-4 pt-2">
                    <button
                      onClick={() =>
                        handleStatusChange(
                          appointment._id,
                          "open",
                          appointment.message
                        )
                      }
                      disabled={
                        loadingAction?.id === appointment._id &&
                        loadingAction?.status === "open"
                      }
                      className="flex items-center gap-1 px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                      title="Open"
                    >
                      {loadingAction?.id === appointment._id &&
                      loadingAction?.status === "open" ? (
                        <Loader className="animate-spin w-4 h-4" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                      <span className="text-sm">Open</span>
                    </button>
                    <button
                      onClick={() =>
                        handleStatusChange(
                          appointment._id,
                          "closed",
                          "cancelled"
                        )
                      }
                      disabled={
                        loadingAction?.id === appointment._id &&
                        loadingAction?.status === "closed"
                      }
                      className="flex items-center gap-1 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                      title="Close"
                    >
                      {loadingAction?.id === appointment._id &&
                      loadingAction?.status === "closed" ? (
                        <Loader className="animate-spin w-4 h-4" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                      <span className="text-sm">Close</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}

          {filteredAppointments.length === 0 && (
            <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow-md">
              No Leads found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Appointments;