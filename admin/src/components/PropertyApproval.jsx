import { motion } from "framer-motion";
import { CheckCircle, XCircle, FileText, Image } from "lucide-react";

const PropertyApproval = ({
  propertyLoading,
  loadingId,
  pendingProperties,
  rejectedProperties,
  handleStatusChange,
}) => {
  if (propertyLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center pt-20 bg-gradient-to-br from-gray-50 to-gray-100"
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ loop: Infinity, duration: 1, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-6"
          />
          <motion.h3 className="text-xl font-semibold text-gray-700">
            Loading properties...
          </motion.h3>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      {/* Pending Properties */}
      {pendingProperties.length === 0 ? (
        <p className="text-center text-gray-500 py-20 text-lg bg-white rounded-xl shadow border">
          No pending properties to approve.
        </p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  BHK/Bath
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Size (sqft)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Transaction Type
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {pendingProperties.map((property, idx) => (
                <motion.tr
                  key={property._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  className="border-b"
                >
                  <td className="px-6 py-4">{idx + 1}</td>
                  <td className="px-6 py-4">{property.title || "-"}</td>
                  <td className="px-6 py-4">
                    {property.location?.address || "-"},{" "}
                    {property.location?.city || "-"},{" "}
                    {property.location?.state || "-"}
                  </td>
                  <td className="px-6 py-4">
                    {property.images && property.images.length > 0 ? (
                      <div className="flex gap-2 ">
                        {property.images.map((imgUrl, idx) => (
                          <div
                            key={idx}
                            className="w-12 h-12 rounded overflow-hidden border border-gray-300 cursor-pointer group relative"
                            title="View Image"
                            onClick={() => window.open(imgUrl, "_blank")}
                          >
                            <img
                              src={imgUrl}
                              alt={`${
                                property.title || "Property image"
                              }-${idx}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs rounded">
                              <Image className="w-4 h-4" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>

                  <td className="px-6 py-4">{property.owner?.name || "-"}</td>
                  <td className="px-6 py-4">{property.owner?.email || "-"}</td>

                  <td className="px-6 py-4">₹{property.price || "-"}</td>
                  <td className="px-6 py-4">{property.propertyType || "-"}</td>
                  <td className="px-6 py-4">
                    {property.bhk || "-"} BHK / {property.bathroom || "-"} Bath
                  </td>
                  <td className="px-6 py-4">{property.size || "-"}</td>
                  <td className="px-6 py-4 capitalize">
                    {property.transactionType || "-"}
                  </td>
                  <td className="px-6 py-4 flex gap-2 justify-center">
                    <button
                      onClick={() =>
                        handleStatusChange(property._id, "approved")
                      }
                      disabled={loadingId === property._id}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 flex items-center gap-1"
                    >
                      {loadingId === property._id ? (
                        "Approving..."
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" /> Approve
                        </>
                      )}
                    </button>
                    <button
                      onClick={() =>
                        handleStatusChange(property._id, "rejected")
                      }
                      disabled={loadingId === property._id}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 flex items-center gap-1"
                    >
                      {loadingId === property._id ? (
                        "Rejecting..."
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" /> Reject
                        </>
                      )}
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Rejected Properties */}
      <section className="mt-16">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FileText className="w-6 h-6 text-gray-600" />
          Rejected Properties
        </h2>
        {rejectedProperties.length === 0 ? (
          <p className="text-center text-gray-500 py-20 text-lg bg-white rounded-xl shadow border">
            No rejected properties.
          </p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl shadow border">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    Owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    BHK/Bath
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    Size (sqft)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                    Transaction Type
                  </th>
                </tr>
              </thead>
              <tbody>
                {rejectedProperties.map((property, idx) => (
                  <motion.tr
                    key={property._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                    className="border-b"
                  >
                    <td className="px-6 py-4">{idx + 1}</td>
                    <td className="px-6 py-4">{property.title || "-"}</td>
                    <td className="px-6 py-4">
                      {property.location?.address || "-"},{" "}
                      {property.location?.city || "-"},{" "}
                      {property.location?.state || "-"}
                    </td>

                    <td className="px-6 py-4">
                      {property.images && property.images.length > 0 ? (
                        <div
                          className="w-12 h-12 rounded overflow-hidden border border-gray-300 cursor-pointer group relative"
                          title="View Image"
                          onClick={() =>
                            window.open(property.images[0], "_blank")
                          }
                        >
                          <img
                            src={property.images[0]}
                            alt={property.title || "Property image"}
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
                    <td className="px-6 py-4">{property.owner?.name || "-"}</td>
                    <td className="px-6 py-4">
                      {property.owner?.email || "-"}
                    </td>
                    <td className="px-6 py-4">₹{property.price || "-"}</td>
                    <td className="px-6 py-4">
                      {property.propertyType || "-"}
                    </td>
                    <td className="px-6 py-4">
                      {property.bhk || "-"} BHK / {property.bathroom || "-"}{" "}
                      Bath
                    </td>
                    <td className="px-6 py-4">{property.size || "-"}</td>
                    <td className="px-6 py-4 capitalize">
                      {property.transactionType || "-"}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
};

export default PropertyApproval;
