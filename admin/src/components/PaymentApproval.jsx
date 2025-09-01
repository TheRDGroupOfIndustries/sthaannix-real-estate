import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  FileText,
  Image,
} from "lucide-react";

const PaymentApproval = ({
  payments,
  pendingPayments,
  canceledPayments,
  paymentsLoading,
  approvePayment,
  cancelPayment,
  approveWalletPayment,
  cancelWalletPayment,
}) => {
if (paymentsLoading) {
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
            Loading Payments...
          </motion.h3>
        </div>
      </motion.div>
    );
  }
  

  return (
    <>
      {pendingPayments?.length === 0 ? (
        <p className="text-center text-gray-500 py-20 text-lg bg-white rounded-xl shadow border border-gray-200">
          No pending payments for approval.
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
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction Ref
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purpose
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Proof
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pendingPayments?.map((payment, idx) => (
                <motion.tr
                  key={payment._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">{idx + 1}</td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {payment?.user?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {payment?.user?.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {payment?.user?.email}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                    {payment.utrNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                    {payment.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(payment.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {payment?.paymentMethod}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ₹{payment.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      {payment.type === "Wallet" && payment.proof?.length > 0
                        ? payment.proof.map((imgUrl, idx) => (
                            <div
                              key={idx}
                              className="w-12 h-12 rounded overflow-hidden border border-gray-300 cursor-pointer group relative"
                              title="View Image"
                              onClick={() => window.open(imgUrl, "_blank")}
                            >
                              <img
                                src={imgUrl}
                                alt={`payment-proof-${idx}`}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs rounded">
                                <Image className="w-4 h-4" />
                              </div>
                            </div>
                          ))
                        :  payment.screenshot?.length > 0 ? (
    payment.screenshot.map((imgUrl, idx) => (
      <div
        key={idx}
        className="w-12 h-12 rounded overflow-hidden border border-gray-300 cursor-pointer group relative"
        title="View Image"
        onClick={() => window.open(imgUrl, "_blank")}
      >
        <img
          src={imgUrl}
          alt={`payment-screenshot-${idx}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs rounded">
          <Image className="w-4 h-4" />
        </div>
      </div>
    ))
  ) : null}                          
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                    <button
                      onClick={() =>
                        payment.type === "Wallet"
                          ? approveWalletPayment(
                              payment._id,
                              payment.utrNumber,
                              payment.paymentMethod
                            )
                          : approvePayment(payment._id)
                      }
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
                      title="Approve Payment"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() =>
                        payment.type === "Wallet"
                          ? cancelWalletPayment(
                              payment._id,
                              "Payment Rejected BY Admin"
                            )
                          : cancelPayment(payment._id, "Payment Rejected")
                      }
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
                      title="Cancel Payment"
                    >
                      <XCircle className="w-4 h-4" />
                      Cancel
                    </button>
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
          Canceled Payments
        </h2>
        {canceledPayments?.length === 0 ? (
          <p className="text-gray-500 bg-white rounded-xl p-4 shadow border border-gray-200">
            No canceled payments.
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
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Purpose
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction Ref
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Proof
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {canceledPayments?.map((payment, idx) => (
                  <motion.tr
                    key={payment._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">{idx + 1}</td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {payment.user?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {payment.user?.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {payment.user?.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {payment?.type}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                      {payment.utrNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(payment.updatedAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {payment?.paymentMethod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                     <div className="flex gap-2">
                      {payment.type === "Wallet" && payment.proof?.length > 0
                        ? payment.proof.map((imgUrl, idx) => (
                            <div
                              key={idx}
                              className="w-12 h-12 rounded overflow-hidden border border-gray-300 cursor-pointer group relative"
                              title="View Image"
                              onClick={() => window.open(imgUrl, "_blank")}
                            >
                              <img
                                src={imgUrl}
                                alt={`payment-proof-${idx}`}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs rounded">
                                <Image className="w-4 h-4" />
                              </div>
                            </div>
                          ))
                        : payment.screenshot  && (
                            <div
                              className="w-12 h-12 rounded overflow-hidden border border-gray-300 cursor-pointer group relative"
                              title="View Image"
                              onClick={() =>
                                window.open(payment.screenshot, "_blank")
                              }
                            >
                              <img
                                src={payment.screenshot}
                                alt="payment-proof"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs rounded">
                                <Image className="w-4 h-4" />
                              </div>
                            </div>
                          )}
                    </div>

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

export default PaymentApproval;
