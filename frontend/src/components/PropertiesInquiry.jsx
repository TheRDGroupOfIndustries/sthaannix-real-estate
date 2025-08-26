import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Home,
  MessageCircle,
  Search,
  Filter,
  Loader,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { fetchInquiryys } from "../services/property-InqueryService";

export default function PropertiesInquiry() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchInquiryData = async () => {
    try {
      setLoading(true);
      const response = await fetchInquiryys();

      // Support both (response.data) and direct array response
      const data = response?.data ?? response;
      if (Array.isArray(data)) {
        setInquiries(data);
      } else {
        toast.error(response?.message || "Failed to fetch inquiries");
      }
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      toast.error("Failed to fetch inquiries. Please check your authorization.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiryData();
  }, []);

  const filteredInquiries = inquiries.filter((inquiry) => {
    const search = searchTerm.trim().toLowerCase();
    const matchesSearch =
      search === "" ||
      (inquiry.property?.title &&
        inquiry.property.title.toLowerCase().includes(search)) ||
      (inquiry.buyer?.name &&
        inquiry.buyer.name.toLowerCase().includes(search)) ||
      (inquiry.buyer?.email &&
        inquiry.buyer.email.toLowerCase().includes(search)) ||
      (inquiry.message && inquiry.message.toLowerCase().includes(search));

    const matchesFilter = filter === "all" || inquiry.status === filter;

    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center bg-gray-50">
        <Loader className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              My Properties Inquiries
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Manage all property inquiries from potential buyers
            </p>
          </div>

          {/* Search & Filter */}
          <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-2 md:mt-0">
            <div className="relative flex-1">
              <input
                type="text"
                aria-label="Search inquiries"
                placeholder="Search inquiries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 w-full bg-white"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="rounded-lg border border-gray-200 px-3 py-2 focus:ring-2 focus:ring-blue-500 bg-white"
                aria-label="Filter inquiries"
              >
                <option value="all">All Inquiries</option>
                <option value="pending">Pending</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInquiries.map((inquiry) => {
                  const msg =
                    inquiry.message && inquiry.message.length > 120
                      ? inquiry.message.slice(0, 120) + "..."
                      : inquiry.message || "No message provided";
                  return (
                    <motion.tr
                      key={inquiry._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Home className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <p className="font-medium text-gray-900">
                              {inquiry.property?.title || "Unknown Property"}
                            </p>
                            <p className="text-sm text-gray-500">
                              {inquiry.property?.location?.city || "Unknown City"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <p className="font-medium text-gray-900">
                              {inquiry.createdAt
                                ? new Date(inquiry.createdAt).toLocaleDateString()
                                : "—"}
                            </p>
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="w-4 h-4 mr-1" />
                              {inquiry.createdAt
                                ? new Date(inquiry.createdAt).toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  })
                                : "—"}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 max-w-xl">
                        <div className="flex items-start">
                          <MessageCircle className="w-4 h-4 text-gray-400 mr-2 mt-1 flex-shrink-0" />
                          <p className="text-sm text-gray-600">{msg}</p>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            inquiry.status
                          )}`}
                        >
                          {inquiry.status
                            ? inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)
                            : "Pending"}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile / Tablet Cards */}
          <div className="block lg:hidden p-4">
            {filteredInquiries.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-lg font-medium">No inquiries found</p>
                <p className="text-sm">All property inquiries will appear here</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredInquiries.map((inquiry) => {
                  const msg =
                    inquiry.message && inquiry.message.length > 140
                      ? inquiry.message.slice(0, 140) + "..."
                      : inquiry.message || "No message provided";
                  return (
                    <motion.div
                      key={inquiry._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <Home className="w-6 h-6 text-gray-400 mt-1" />
                          <div>
                            <p className="font-semibold text-gray-900">
                              {inquiry.property?.title || "Unknown Property"}
                            </p>
                            <p className="text-sm text-gray-500">
                              {inquiry.property?.location?.city || "Unknown City"}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              inquiry.status
                            )}`}
                          >
                            {inquiry.status
                              ? inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)
                              : "Pending"}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 text-sm text-gray-600 flex items-start gap-2">
                        <MessageCircle className="w-4 h-4 text-gray-400 mt-1" />
                        <p>{msg}</p>
                      </div>

                      <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {inquiry.createdAt ? new Date(inquiry.createdAt).toLocaleDateString() : "—"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>
                              {inquiry.createdAt
                                ? new Date(inquiry.createdAt).toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  })
                                : "—"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Desktop empty state */}
          {filteredInquiries.length === 0 && (
            <div className="hidden lg:flex flex-col items-center py-12 text-gray-500">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-medium">No inquiries found</p>
              <p className="text-sm">All property inquiries will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}