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
  ChevronDown,
  ChevronUp,
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
  const [expandedRow, setExpandedRow] = useState(null);

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
    <div className="min-h-screen pt-20 md:pt-32 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />
              Contact Messages
            </h1>
            <p className="text-gray-600">
              Manage and reply to incoming messages
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search messages..."
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
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="replied">Replied</option>
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

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-4 my-6">
          {filteredContacts.map((contact) => (
            <motion.div
              key={contact._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-4"
            >
              <div 
                className="flex justify-between items-start cursor-pointer"
                onClick={() => setExpandedRow(expandedRow === contact._id ? null : contact._id)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <p className="font-medium text-gray-900">{contact.name}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <Mail className="w-4 h-4" />
                    <span>{contact.email}</span>
                  </div>
                  {contact.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <Phone className="w-4 h-4" />
                      <span>{contact.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button className="p-1">
                  {expandedRow === contact._id ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>

              {expandedRow === contact._id && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  {/* Message */}
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <MessageCircleMore className="w-4 h-4" />
                      Message
                    </h3>
                    <p className="text-gray-600 text-sm">{contact.message}</p>
                  </div>

                  {/* Reply Status */}
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-1">
                      Reply Status
                    </h3>
                    {contact.reply ? (
                      <div>
                        <p className="text-sm text-green-700 font-medium mb-1">
                          {contact.reply}
                        </p>
                        {contact.repliedBy && (
                          <p className="text-xs text-gray-500">
                            by {contact.repliedBy.name}
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400 italic text-sm">No reply yet</span>
                    )}
                  </div>

                  {/* Actions */}
                  {!contact.reply && (
                    <div className="space-y-2">
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
                        className="w-full border rounded px-3 py-2 text-sm"
                      />
                      <button
                        onClick={() => handleReply(contact._id)}
                        disabled={replying === contact._id}
                        className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white rounded px-4 py-2 text-sm hover:bg-blue-600 disabled:opacity-50"
                      >
                        {replying === contact._id ? (
                          <>
                            <Loader className="w-4 h-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Reply className="w-4 h-4" />
                            Send Reply
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))}

          {filteredContacts.length === 0 && (
            <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow-md">
              No messages found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactMessages;