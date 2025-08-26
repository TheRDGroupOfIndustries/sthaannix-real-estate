// import { Routes, Route, Navigate, useLocation } from "react-router-dom";
// import { Toaster } from "react-hot-toast";
// import { ErrorBoundary } from "react-error-boundary";
// import { motion, AnimatePresence } from "framer-motion";

// import Navbar from "./components/Navbar";
// import ErrorFallback from "./components/ErrorFallback";

// import Login from "./components/login";
// import Register from "./components/Register";
// import Payment from "./pages/Payment";

// import BrokerDashboard from "./pages/BrokerDashboard";
// import BuilderDashboard from "./pages/BuilderDashboard";
// import PropertyOwnerDashboard from "./pages/PropertyOwnerDashboard";
// import AdminDashboard from "./pages/AdminDashboard";

// import PropertyListings from "./pages/List";
// import Add from "./pages/Add";
// import Update from "./pages/Update";
// import Appointments from "./pages/Appointments";

// export const Backendurl = import.meta.env.REACT_APP_API_BASE_URL;

// const pageVariants = {
//   initial: { opacity: 0, y: 20 },
//   animate: { opacity: 1, y: 0 },
//   exit: { opacity: 0, y: -20 },
// };

// // const getUser = () => {
// //   if (typeof window !== "undefined" && localStorage.getItem("user")) {
// //     return JSON.parse(localStorage.getItem("user"));
// //   }
// //   return null;
// // };

// const getUser = () => {
//   if (typeof window !== "undefined") {
//     const value = localStorage.getItem("user");
//     // Only parse if value is valid JSON
//     if (value && value !== "undefined" && value !== "null") {
//       try {
//         return JSON.parse(value);
//       } catch (err) {
//         // Optionally: Remove invalid value from localStorage
//         localStorage.removeItem("user");
//         return null;
//       }
//     }
//   }
//   return null;
// };


// const PrivateRoute = ({ children, allowedRoles }) => {
//   const user = getUser();
//   if (!user) return <Navigate to="/login" replace />;
//   if (allowedRoles && !allowedRoles.includes(user.role)) {
//     // Redirect to user's dashboard if role mismatch
//     return <Navigate to={`/${user.role.toLowerCase().replace(/ /g, "-")}`} replace />;
//   }
//   return children;
// };

// const RoleDashboardRedirect = () => {
//   const user = getUser();
//   if (!user) return <Navigate to="/login" replace />;
//   const roleSlug = user.role.toLowerCase().replace(/ /g, "-");
//   return <Navigate to={`/${roleSlug}`} replace />;
// };

// const App = () => {
//   const location = useLocation();
//   const isAuthOrPaymentPage = ["/login", "/register", "/payment"].includes(location.pathname);
//   const user = getUser();

//   return (
//     <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
//       <div className="min-h-screen bg-gray-50">
//         {!isAuthOrPaymentPage && <Navbar />}

//         <AnimatePresence mode="wait" initial={false}>
//           <motion.div
//             key={location.pathname}
//             initial="initial"
//             animate="animate"
//             exit="exit"
//             variants={pageVariants}
//             transition={{ duration: 0.3 }}
//             className={!isAuthOrPaymentPage ? "pt-16" : ""}
//           >
//             <Routes location={location}>
//               {/* Public Routes */}
//               <Route path="/login" element={<Login />} />
//               <Route path="/register" element={<Register />} />
//               <Route path="/" element={<Navigate to="/login" replace />} />

//               {/* Redirect dashboard base to role-specific */}
//               <Route
//                 path="/dashboard"
//                 element={
//                   <PrivateRoute allowedRoles={["Broker", "Builder", "Property Owner", "Admin"]}>
//                     <RoleDashboardRedirect />
//                   </PrivateRoute>
//                 }
//               />

//               {/* Role-specific dashboards */}
//               <Route
//                 path="/broker"
//                 element={
//                   <PrivateRoute allowedRoles={["Broker"]}>
//                     <BrokerDashboard />
//                   </PrivateRoute>
//                 }
//               />
//               <Route
//                 path="/builder"
//                 element={
//                   <PrivateRoute allowedRoles={["Builder"]}>
//                     <BuilderDashboard />
//                   </PrivateRoute>
//                 }
//               />
//               <Route
//                 path="/property-owner"
//                 element={
//                   <PrivateRoute allowedRoles={["Property Owner"]}>
//                     <PropertyOwnerDashboard />
//                   </PrivateRoute>
//                 }
//               />
//               <Route
//                 path="/admin"
//                 element={
//                   <PrivateRoute allowedRoles={["Admin"]}>
//                     <AdminDashboard />
//                   </PrivateRoute>
//                 }
//               />

              
//               <Route
//                 path="/list"
//                 element={
//                   <PrivateRoute allowedRoles={["Broker", "Builder", "Property Owner", "Admin"]}>
//                     <PropertyListings />
//                   </PrivateRoute>
//                 }
//               />
//               <Route
//                 path="/add"
//                 element={
//                   <PrivateRoute allowedRoles={["Broker", "Builder", "Property Owner", "Admin"]}>
//                     <Add />
//                   </PrivateRoute>
//                 }
//               />
//               <Route
//                 path="/update/:id"
//                 element={
//                   <PrivateRoute allowedRoles={["Broker", "Builder", "Property Owner", "Admin"]}>
//                     <Update />
//                   </PrivateRoute>
//                 }
//               />
//               <Route
//                 path="/appointments"
//                 element={
//                   <PrivateRoute allowedRoles={["Broker", "Builder", "Property Owner", "Admin"]}>
//                     <Appointments />
//                   </PrivateRoute>
//                 }
//               />

//               {/* Payment route */}
//               <Route
//                 path="/payment"
//                 element={
//                   user ? (
//                     <Payment />
//                   ) : (
//                     <Navigate to="/login" replace />
//                   )
//                 }
//               />

//               {/* Fallback */}
//               <Route path="*" element={<Navigate to="/login" replace />} />
//             </Routes>
//           </motion.div>
//         </AnimatePresence>

//         <Toaster
//           position="top-right"
//           toastOptions={{
//             duration: 4000,
//             style: {
//               background: "#333",
//               color: "#fff",
//               borderRadius: "8px",
//               fontSize: "14px",
//             },
//             success: { iconTheme: { primary: "#10B981", secondary: "#fff" } },
//             error: { iconTheme: { primary: "#EF4444", secondary: "#fff" } },
//           }}
//         />
//       </div>
//     </ErrorBoundary>
//   );
// };

// export default App;


import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ErrorBoundary } from "react-error-boundary";
import { motion, AnimatePresence } from "framer-motion";

import Navbar from "./components/Navbar";
import ErrorFallback from "./components/ErrorFallback";

import Login from "./components/login";
import Register from "./components/Register";
import Payment from "./pages/Payment";

import BrokerDashboard from "./pages/BrokerDashboard";
import BuilderDashboard from "./pages/BuilderDashboard";
import PropertyOwnerDashboard from "./pages/PropertyOwnerDashboard";
import AdminDashboard from "./pages/AdminDashboard";

import PropertyListings from "./pages/List";
import Add from "./pages/Add";
import Update from "./pages/Update";
import Appointments from "./pages/Appointments";
import Wallet from "./pages/Wallet";
import Revenue from "./Revenue";

export const Backendurl = import.meta.env.VITE_API_BASE_URL;

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

// ------------------ Helper Functions ------------------

const getUser = () => {
  if (typeof window !== "undefined") {
    const value = localStorage.getItem("user");
    if (value && value !== "undefined" && value !== "null") {
      try {
        return JSON.parse(value);
      } catch (err) {
        localStorage.removeItem("user");
        return null;
      }
    }
  }
  return null;
};

const PrivateRoute = ({ children, allowedRoles }) => {
  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;

  // const userRole = user.role?.toLowerCase();
  // if (allowedRoles && !allowedRoles.includes(userRole)) {
  //   return <Navigate to={`/${userRole}`} replace />;
  // }
  if (allowedRoles && !allowedRoles.includes(user.role.toLowerCase())) {
    return <Navigate to={`/${user.role.toLowerCase()}`} replace />;
  }

  return children;
};

const RoleDashboardRedirect = () => {
  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;
  // If user is broker/builder/owner and payment not approved, redirect to payment page
if (["broker", "builder", "owner"].includes(user.role.toLowerCase())) {
  if (user.status === "approved") {
    return <Navigate to={`/${user.role.toLowerCase()}`} replace />;
  } else {
    return <Navigate to="/payment" replace />;
  }
} else if (user.role.toLowerCase() === "admin") {
  return <Navigate to="/admin" replace />;
}
  const roleSlug = user.role.toLowerCase();
  return <Navigate to={`/${roleSlug}`} replace />;
};

// ------------------ Main App ------------------

const App = () => {
  const location = useLocation();
  const isAuthOrPaymentPage = ["/login", "/register", "/payment"].includes(location.pathname);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
      <div className="min-h-screen bg-gray-50">
        {!isAuthOrPaymentPage && <Navbar />}

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={{ duration: 0.3 }}
            className={!isAuthOrPaymentPage ? "pt-16" : ""}
          >
            <Routes location={location}>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Navigate to="/login" replace />} />

              {/* Redirect dashboard base to role-specific */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute allowedRoles={["broker", "builder", "owner", "admin"]}>
                    <RoleDashboardRedirect />
                  </PrivateRoute>
                }
              />

              {/* Role-specific dashboards */}
              <Route
                path="/broker"
                element={
                  <PrivateRoute allowedRoles={["broker"]}>
                    <BrokerDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/builder"
                element={
                  <PrivateRoute allowedRoles={["builder"]}>
                    <BuilderDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/owner"
                element={
                  <PrivateRoute allowedRoles={["owner"]}>
                    <PropertyOwnerDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <PrivateRoute allowedRoles={["admin"]}>
                    <AdminDashboard />
                  </PrivateRoute>
                }
              />

              {/* Other routes */}
              <Route
                path="/list"
                element={
                  <PrivateRoute allowedRoles={["broker", "builder", "owner", "admin"]}>
                    <PropertyListings />
                  </PrivateRoute>
                }
              />
              <Route
                path="/add"
                element={
                  <PrivateRoute allowedRoles={["broker", "builder", "owner", "admin"]}>
                    <Add />
                  </PrivateRoute>
                }
              />
              <Route
                path="/update/:id"
                element={
                  <PrivateRoute allowedRoles={["broker", "builder", "owner", "admin"]}>
                    <Update />
                  </PrivateRoute>
                }
              />
              
              <Route path="/ads/:id" element={<Ads/>} />

              <Route
                path="/appointments"
                element={
                  <PrivateRoute allowedRoles={["broker", "builder", "owner", "admin"]}>
                    <Appointments />
                  </PrivateRoute>
                }
              />

              {/* Payment */}
              <Route
                path="/payment"
                element={getUser() ? <Payment /> : <Navigate to="/login" replace />}
              />


              <Route
                path="/revenue"
                element={
                  <PrivateRoute allowedRoles={["admin"]}>
                    <Revenue />
                  </PrivateRoute>
                }
              />

                <Route path="/wallet" element={<Wallet/>} />


              {/* Fallback */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#333",
              color: "#fff",
              borderRadius: "8px",
              fontSize: "14px",
            },
            success: { iconTheme: { primary: "#10B981", secondary: "#fff" } },
            error: { iconTheme: { primary: "#EF4444", secondary: "#fff" } },
          }}
        />
      </div>
    </ErrorBoundary>
  );
};

export default App;
