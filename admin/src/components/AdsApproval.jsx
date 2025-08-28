import { motion } from "framer-motion";
import { CheckCircle, XCircle, FileText } from "lucide-react";

const AdsApproval = ({ ads, adsLoading, approveAd, rejectAd }) => {
  if (adsLoading) {
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
            Loading Ads...
          </motion.h3>
        </div>
      </motion.div>
    );
  }

  const pendingAds = ads.filter((ad) => ad.status === "pending");
  const rejectedAds = ads.filter((ad) => ad.status === "rejected");

  return (
    <>
      {pendingAds.length === 0 ? (
        <p className="text-center text-gray-500 py-20 text-lg bg-white rounded-xl shadow border border-gray-200">
          No pending ads for approval.
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
                  Property
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property Type
                </th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Purpose
                  </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  BHK/Bath
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Platform
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pendingAds.map((ad, idx) => (
                <motion.tr
                  key={ad._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4">{idx + 1}</td>
                  <td className="px-6 py-4">{ad.property?.title || "-"}</td>
                  <td className="px-6 py-4">
                    {ad.property?.images?.[0] ? (
                      <img
                        src={ad?.property?.images[0]}
                        alt={ad.property?.title}
                        className="w-full h-14 object-cover rounded"
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-6 py-4">{ad.user?.name || "-"}</td>
                  <td className="px-6 py-4">
                    {ad.property?.location?.city},{" "}
                    {ad.property?.location?.state}
                  </td>
                  <td className="px-6 py-4">
                    ₹{ad.property?.price?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 capitalize">
                    {ad.property?.propertyType}
                  </td>
                   <td className="px-6 py-4">{ad.property?.transactionType || "-"}</td>
                  <td className="px-6 py-4">
                    {ad.property?.bhk || "-"}Bhk/{ad.property?.bathroom || "-"}
                    Bath
                  </td>
                  <td className="px-6 py-4">
                    {ad.platform?.join(", ") || "-"}
                  </td>
                  <td className="px-6 py-4 capitalize">{ad.status}</td>
                  <td className="px-6 py-4">
                    {new Date(ad.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => approveAd(ad._id)}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
                        title="Approve Ad"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => rejectAd(ad._id)}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
                        title="Reject Ad"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <section className="mt-16">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FileText className="w-6 h-6 text-gray-600" />
          Rejected Ads
        </h2>
        {rejectedAds.length === 0 ? (
          <p className="text-gray-500 bg-white rounded-xl p-4 shadow border border-gray-200">
            No rejected ads.
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
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    BHK/Bath
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Purpose
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Platform
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Updated At
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rejectedAds.map((ad, idx) => (
                  <motion.tr
                    key={ad._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">{idx + 1}</td>
                    <td className="px-6 py-4">
                      <img
                        src={ad.property?.images?.[0]}
                        alt={ad.property?.title}
                        className="w-16 h-12 object-cover rounded"
                      />
                    </td>
                    <td className="px-6 py-4">{ad.property?.title || "-"}</td>
                    <td className="px-6 py-4">{ad.user?.name || "-"}</td>
                    <td className="px-6 py-4">
                      {ad.property?.location?.city},{" "}
                      {ad.property?.location?.state}
                    </td>
                    <td className="px-6 py-4">
                      ₹{ad.property?.price?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 capitalize">
                      {ad.property?.propertyType}
                    </td>
                    <td className="px-6 py-4">
                      {ad.property?.bhk || "-"} Bhk/{" "}
                      {ad.property?.bathroom || "-"}Bath
                    </td>
                    <td className="px-6 py-4">{ad.property?.transactionType || "-"}</td>
                    <td className="px-6 py-4">
                      {ad.platform?.join(", ") || "-"}
                    </td>
                    <td className="px-6 py-4 capitalize">{ad.status}</td>
                    <td className="px-6 py-4">
                      {new Date(ad.updatedAt).toLocaleString()}
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

export default AdsApproval;
