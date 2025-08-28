// import { motion } from "framer-motion";
// import {
//   Users,
//   Home,
//   Mail,
//   Phone,
//   User,
//   ClipboardList,
//   CreditCard,
// } from "lucide-react";

// const UsersOverview = ({ users, stats, usersLoading, statsLoading }) => {
//   if (usersLoading || statsLoading) {
//     return (
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100"
//       >
//         <div className="text-center">
//           <motion.div
//             animate={{ rotate: 360 }}
//             transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//             className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-6"
//           />
//           <motion.h3
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2 }}
//             className="text-xl font-semibold text-gray-700 mb-2"
//           >
//             Loading Users & Stats...
//           </motion.h3>
//         </div>
//       </motion.div>
//     );
//   }

//   return (
//     <>
//       {/* Summary Stats */}
//       <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-6">
//         {/* Total Users */}
//         <motion.div className="bg-white rounded-2xl p-6 shadow-sm border flex items-center gap-4">
//           <div className="p-3 bg-blue-100 rounded-xl">
//             <Users className="w-8 h-8 text-blue-600" />
//           </div>
//           <div>
//             <p className="text-sm font-medium text-gray-600">Total Users</p>
//             <p className="text-2xl font-bold text-gray-900">
//               {stats?.users?.total ?? 0}
//             </p>
//             <p className="text-xs text-gray-500">
//               Broker: {stats?.users?.byRole?.broker ?? 0} | Owner:{" "}
//               {stats?.users?.byRole?.owner ?? 0} | Builder:{" "}
//               {stats?.users?.byRole?.builder ?? 0}
//             </p>
//           </div>
//         </motion.div>
//         {/* Properties */}
//         <motion.div className="bg-white rounded-2xl p-6 shadow-sm border flex items-center gap-4">
//           <div className="p-3 bg-green-100 rounded-xl">
//             <Home className="w-8 h-8 text-green-600" />
//           </div>
//           <div>
//             <p className="text-sm font-medium text-gray-600">
//               Total Properties
//             </p>
//             <p className="text-2xl font-bold text-gray-900">
//               {stats?.properties?.total ?? 0}
//             </p>
//             <p className="text-xs text-gray-500">
//               Pending: {stats?.properties?.byStatus?.pending ?? 0} | Approved:{" "}
//               {stats?.properties?.byStatus?.approved ?? 0}
//             </p>
//           </div>
//         </motion.div>
//         {/* Leads */}
//         <motion.div className="bg-white rounded-2xl p-6 shadow-sm border flex items-center gap-4">
//           <div className="p-3 bg-purple-100 rounded-xl">
//             <ClipboardList className="w-8 h-8 text-purple-600" />
//           </div>
//           <div>
//             <p className="text-sm font-medium text-gray-600">Total Leads</p>
//             <p className="text-2xl font-bold text-gray-900">
//               {stats?.leads?.total ?? 0}
//             </p>
//             <p className="text-xs text-gray-500">
//               Open: {stats?.leads?.open ?? 0} | Closed:{" "}
//               {stats?.leads?.closed ?? 0}
//             </p>
//           </div>
//         </motion.div>
//         {/* Wallet/Revenue */}
//         <motion.div className="bg-white rounded-2xl p-6 shadow-sm border flex items-center gap-4">
//           <div className="p-3 bg-yellow-100 rounded-xl">
//             <CreditCard className="w-8 h-8 text-yellow-600" />
//           </div>
//           <div>
//             <p className="text-sm font-medium text-gray-600">Total Revenue</p>
//             <p className="text-2xl font-bold text-gray-900">
//               ₹{stats?.adminRevenue?.finalRevenue ?? 0}
//             </p>
//           </div>
//         </motion.div>
//       </div>

//       {/* User List Table */}
//       <div className="overflow-x-auto bg-white rounded-xl shadow border my-10">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 No
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 User Name
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Role
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Email
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Phone
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Properties
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Leads
//               </th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-100">
//             {users.length === 0 ? (
//               <tr>
//                 <td colSpan={7} className="text-center py-8 text-gray-500">
//                   No users found
//                 </td>
//               </tr>
//             ) : (
//               users.map((user, idx) => (
//                 <motion.tr
//                   key={user._id || idx}
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: idx * 0.05 }}
//                 >
//                   <td className="px-6 py-4">{idx + 1}</td>
//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-2">
//                       <User className="w-5 h-5 text-gray-400" />
//                       {user.name || "-"}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4">{user.role || "-"}</td>
//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-1">
//                       <Mail className="w-4 h-4 text-gray-400" />
//                       {user.email || "-"}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-1">
//                       <Phone className="w-4 h-4 text-gray-400" />
//                       {user.phone || "-"}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-1">
//                       <Home className="w-4 h-4 text-gray-400" />
//                       {user.totalProperties || 0}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-1">
//                       <ClipboardList className="w-4 h-4 text-gray-400" />
//                       {user.totalLeads || 0}
//                     </div>
//                   </td>
//                 </motion.tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </>
//   );
// };

// export default UsersOverview;


import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Home,
  Mail,
  Phone,
  User,
  ClipboardList,
  CreditCard,
} from "lucide-react";

const UsersOverview = ({ users, stats, usersLoading, statsLoading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState("all");
  const usersPerPage = 10;

  // Filter users by role
  const filteredUsers = useMemo(() => {
    if (roleFilter === "all") return users;
    return users.filter((u) => u.role?.toLowerCase() === roleFilter);
  }, [users, roleFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + usersPerPage
  );

  if (usersLoading || statsLoading) {
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
            Loading Users & Stats...
          </motion.h3>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      {/* Summary Stats */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Users */}
        <motion.div className="bg-white rounded-2xl p-6 shadow-sm border flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Total Users</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats?.users?.total ?? 0}
            </p>
            <p className="text-xs text-gray-500">
              Broker: {stats?.users?.byRole?.broker ?? 0} | Owner:{" "}
              {stats?.users?.byRole?.owner ?? 0} | Builder:{" "}
              {stats?.users?.byRole?.builder ?? 0}
            </p>
          </div>
        </motion.div>
        {/* Properties */}
        <motion.div className="bg-white rounded-2xl p-6 shadow-sm border flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-xl">
            <Home className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">
              Total Properties
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {stats?.properties?.total ?? 0}
            </p>
            <p className="text-xs text-gray-500">
              Pending: {stats?.properties?.byStatus?.pending ?? 0} | Approved:{" "}
              {stats?.properties?.byStatus?.approved ?? 0}
            </p>
          </div>
        </motion.div>
        {/* Leads */}
        <motion.div className="bg-white rounded-2xl p-6 shadow-sm border flex items-center gap-4">
          <div className="p-3 bg-purple-100 rounded-xl">
            <ClipboardList className="w-8 h-8 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Total Leads</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats?.leads?.total ?? 0}
            </p>
            <p className="text-xs text-gray-500">
              Open: {stats?.leads?.open ?? 0} | Closed:{" "}
              {stats?.leads?.closed ?? 0}
            </p>
          </div>
        </motion.div>
        {/* Wallet/Revenue */}
        <motion.div className="bg-white rounded-2xl p-6 shadow-sm border flex items-center gap-4">
          <div className="p-3 bg-yellow-100 rounded-xl">
            <CreditCard className="w-8 h-8 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">
              ₹{stats?.adminRevenue?.finalRevenue ?? 0}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Filter + Table */}
      <div className="my-6 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-700">Users List</h2>
        <select
          className="border rounded-lg px-3 py-2 text-sm"
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="all">All Roles</option>
          <option value="broker">Broker</option>
          <option value="owner">Owner</option>
          <option value="builder">Builder</option>
        </select>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow border mb-6">
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
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Properties
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Leads
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user, idx) => (
                <motion.tr
                  key={user._id || idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <td className="px-6 py-4">{startIndex + idx + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-gray-400" />
                      {user.name || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4">{user.role || "-"}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {user.email || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {user.phone || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Home className="w-4 h-4 text-gray-400" />
                      {user.totalProperties || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <ClipboardList className="w-4 h-4 text-gray-400" />
                      {user.totalLeads || 0}
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 my-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-4 py-2 rounded-lg border text-sm disabled:opacity-50"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded-lg border text-sm ${
                currentPage === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-4 py-2 rounded-lg border text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};

export default UsersOverview;
