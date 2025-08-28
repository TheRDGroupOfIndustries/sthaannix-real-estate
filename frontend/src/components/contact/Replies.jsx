import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import http from "../../api/http";

function Replies({ isOpen, onClose, title }) {
  const [replies, setReplies] = useState([]);

  const fetchReplies = async () => {
    try {
      const res = await http.get("/contact/get-my-replies");
      setReplies(res.data.contacts || []);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchReplies();
    }
  }, [isOpen]);

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-lg w-11/12 max-w-lg p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-2xl font-bold"
          >
            &times;
          </button>
        </div>

        <div className="mb-4 max-h-64 overflow-y-auto">
          <ul className="space-y-2">
            {replies.length === 0 && <li>No replies yet</li>}
            {replies.map((reply) => (
              <li key={reply._id} className="border p-2 rounded-lg">
                <p>
                  <strong>Message:</strong> {reply.message}
                </p>
                <p className="">
                  <strong>Reply:</strong> {reply.reply || "Pending"}
                </p>
                <p className="text-sm text-gray-500">
                  {formatDateTime(reply.createdAt)}
                </p>
                {reply.reply && (
                  <p className="text-sm text-gray-500">
                    Replied by: {reply.repliedBy?.name || "Pending"} |{" "}
                    {formatDateTime(reply.updatedAt)}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default Replies;
