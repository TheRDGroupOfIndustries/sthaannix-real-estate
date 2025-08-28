import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  User,
  Mail,
  Phone,
  MessageSquare,
  Loader,
  Search,
  Filter,
  Reply,
  Check,
  MessageCircleMore,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { adminAPI } from "../api/api";

const ContactMessages = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replying, setReplying] = useState(null); 
  const [replyTexts, setReplyTexts] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  // Fetch contacts
  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getAllContacts();
      setContacts(res.data.contacts || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  };

  // Handle reply
  const handleReply = async (contactId) => {
    const replyText = replyTexts[contactId] || "";
    if (!replyText.trim()) {
      toast.error("Reply cannot be empty");
      return;
    }
    try {
      setReplying(contactId);
      await adminAPI.replyToContact(contactId, replyText);
      toast.success("Reply sent successfully");
      setReplyTexts((prev) => ({ ...prev, [contactId]: "" }));
      setReplying(null);
      fetchContacts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send reply");
      setReplying(null);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Filter + search
  const filteredContacts = contacts.filter((c) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      searchTerm === "" ||
      c.name?.toLowerCase().includes(search) ||
      c.email?.toLowerCase().includes(search) ||
      c.message?.toLowerCase().includes(search);

    const matchesFilter =
      filter === "all" ||
      (filter === "replied" && c.reply) ||
      (filter === "pending" && !c.reply);

    return matchesSearch && matchesFilter;
  });

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
            Loading Messages...
          </motion.h3>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen pt-32 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1 flex items-center gap-2">
              <MessageSquare className="w-8 h-8 text-blue-500" />
              Contact Messages
            </h1>
            <p className="text-gray-600">
              Manage and reply to incoming messages
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="rounded-lg border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="replied">Replied</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden my-10">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sender
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reply
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredContacts.map((contact) => (
                  <motion.tr
                    key={contact._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="hover:bg-gray-50"
                  >
                    {/* Sender */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div>
                          <p className="font-medium text-gray-900 flex items-center gap-1">
                            <User className="w-4 h-4 text-gray-400" />{" "}
                            {contact.name}
                          </p>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail className="w-4 h-4" /> {contact.email}
                          </p>
                          {contact.phone && (
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <Phone className="w-4 h-4" /> {contact.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Message */}
                    <td className="px-6 py-4 text-gray-700 max-w-xs">
                      <div className="flex items-start gap-2">
                        <MessageCircleMore className="w-5 h-5 text-gray-400 mt-1" />
                        <span className="break-words">{contact.message}</span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {new Date(contact.createdAt).toLocaleDateString()}{" "}
                        {new Date(contact.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>

                    {/* Reply */}
                    <td className="px-6 py-4">
                      {contact.reply ? (
                        <div className="text-sm text-green-700 font-medium">
                          {contact.reply}
                          {contact.repliedBy && (
                            <p className="text-xs text-gray-500 mt-1">
                              by {contact.repliedBy.name}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">No reply</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      {contact.reply ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-600 text-sm font-medium rounded-full">
                          <Check className="w-4 h-4" />
                          Replied
                        </span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={replyTexts[contact._id] || ""}
                            onChange={(e) =>
                              setReplyTexts((prev) => ({
                                ...prev,
                                [contact._id]: e.target.value,
                              }))
                            }
                            placeholder="Write reply..."
                            className="border rounded px-2 py-1 text-sm"
                          />
                          <button
                            onClick={() => handleReply(contact._id)}
                            disabled={replying === contact._id}
                            className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            {replying === contact._id ? (
                              <Loader className="w-4 h-4 animate-spin" />
                            ) : (
                              <Reply className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredContacts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No messages found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactMessages;
