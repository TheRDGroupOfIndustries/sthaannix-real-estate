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
  Phone,
  Mail,
  MessageCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { fetchInquiryys } from "../services/property-InqueryService";

export default function PropertiesInquiry() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingAction, setLoadingAction] = useState(null);

  const fetchInquiryData = async () => {
    try {
      setLoading(true);
      const response = await fetchInquiryys();

      if (response) {
        const validInquiries = response;
        setInquiries(validInquiries);
        console.log("Fetched inquiries:", inquiries);
      } else {
        toast.error(response.message || "Failed to fetch inquiries");
      }
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      toast.error(
        "Failed to fetch inquiries. Please check your authorization."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiryData();
  }, []);

  const handleStatusChange = async (
    inquiryId,
    newStatus,
    responseMessage = ""
  ) => {
    try {
      setLoadingAction({ id: inquiryId, status: newStatus });

      const response = await updateInquiryStatus(
        inquiryId,
        newStatus,
        responseMessage
      );

      if (response.status === 200 || response.success) {
        toast.success(`Inquiry ${newStatus} successfully`);
        fetchInquiryData(); // Refresh the list
      } else {
        toast.error(response.message || "Failed to update inquiry status");
      }
    } catch (error) {
      console.error("Error updating inquiry:", error);
      toast.error("Failed to update inquiry status");
    } finally {
      setLoadingAction(null);
    }
  };

  const filteredInquiries = inquiries.filter((inquiry) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
    searchTerm === "" ||
    (inquiry.property?.title && inquiry.property.title.toLowerCase().includes(search)) ||
    (inquiry.buyer?.name && inquiry.buyer.name.toLowerCase().includes(search)) ||
    (inquiry.buyer?.email && inquiry.buyer.email.toLowerCase().includes(search)) ||
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
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <Loader className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header and Search Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              My Properties Inquiries
            </h1>
            <p className="text-gray-600">
              Manage all property inquiries from potential buyers
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search inquiries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 w-64"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="rounded-lg border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Inquiries</option>
                <option value="pending">Pending</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </div> 

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Info
                  </th> */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th> */}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInquiries.map((inquiry) => (
                  <motion.tr
                    key={inquiry._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="hover:bg-gray-50"
                  >
                    {/* Property Details */}
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Home className="w-5 h-5 text-gray-400 mr-2" />
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

                    {/* Client Details */}
                    {/* <td className="px-6 py-4">
                      <div className="flex items-center"> */}
                        {/* <User className="w-5 h-5 text-gray-400 mr-2" /> */}
                        {/* <div> */}
                          {/* <p className="font-medium text-gray-900"> */}
                            {/* {inquiry.buyer?.name || "Unknown Buyer"} */}
                          {/* </p>
                          <p className="text-sm text-gray-500"> */}
                            {/* Inquiry for: {inquiry.property.title} */}
                          {/* </p>
                        </div>
                      </div>
                    </td> */}

                    {/* Contact Info */}
                    {/* <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm"> */}
                          {/* <Mail className="w-4 h-4 text-gray-400 mr-2" /> */}
                          {/* <span className="text-gray-600">
                            {inquiry.buyer?.email || inquiry.email}
                          </span> */}
                        {/* </div>
                        <div className="flex items-center text-sm"> */}
                          {/* <Phone className="w-4 h-4 text-gray-400 mr-2" /> */}
                          {/* <span className="text-gray-600">
                            {inquiry.buyer?.phone || inquiry.phone}
                          </span> */}
                        {/* </div>
                      </div>
                    </td> */}

                    {/* Date & Time */}
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {new Date(inquiry.createdAt).toLocaleDateString()}
                          </p>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="w-4 h-4 mr-1" />
                            {new Date(inquiry.createdAt).toLocaleTimeString(
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

                    {/* Message */}
                    <td className="px-6 py-4 max-w-xs">
                      <div className="flex items-start">
                        <MessageCircle className="w-4 h-4 text-gray-400 mr-2 mt-1 flex-shrink-0" />
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {inquiry.message || "No message provided"}
                        </p>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          inquiry.status
                        )}`}
                      >
                        {inquiry.status?.charAt(0).toUpperCase() +
                          inquiry.status?.slice(1) || "Pending"}
                      </span>
                    </td>

                    {/* Actions */}
                    {/* <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleStatusChange(
                              inquiry._id,
                              "open",
                              "Inquiry opened"
                            )
                          }
                          disabled={
                            loadingAction?.id === inquiry._id &&
                            loadingAction?.status === "open"
                          }
                          className="p-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                          title="Mark as Open"
                        >
                          {loadingAction?.id === inquiry._id &&
                          loadingAction?.status === "open" ? (
                            <Loader className="animate-spin w-4 h-4" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(
                              inquiry._id,
                              "closed",
                              "Inquiry closed"
                            )
                          }
                          disabled={
                            loadingAction?.id === inquiry._id &&
                            loadingAction?.status === "closed"
                          }
                          className="p-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                          title="Mark as Closed"
                        >
                          {loadingAction?.id === inquiry._id &&
                          loadingAction?.status === "closed" ? (
                            <Loader className="animate-spin w-4 h-4" />
                          ) : (
                            <X className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td> */}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredInquiries.length === 0 && (
            <div className="text-center py-12 text-gray-500">
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
