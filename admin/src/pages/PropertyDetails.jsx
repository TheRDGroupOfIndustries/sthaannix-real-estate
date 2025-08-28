import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapPin, BedDouble, Bath, Maximize, Tag, User, Calendar, Star, AlertCircle } from "lucide-react";
import http from "../api/http";
import { Backendurl } from "../config/constants";
import { motion } from "framer-motion";
const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId,setUserId]=useState(null);
  const [userData,setUserData]=useState(null);
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await http.get(`${Backendurl}/properties/get-by-id/${id}`);
        // console.log('fetchProperty',res.data);
        
        setProperty(res.data);
        // setUserId(res.data.owner)
      } catch (err) {
        console.error("Error fetching property:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);
  
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await http.get(`${Backendurl}/user/get-by-id/${userId}`);
//         console.log('fetchUser',res.data);
        
//         setUserData(res.data.user);
//       } catch (err) {
//         console.error("Error fetching User:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUser();
//   }, [id,userId]);

  

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
            Loading Property
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-500"
          >
            Fetching the details...
          </motion.p>
        </div>
      </motion.div>
    );
  }

  if (!property) {
    return <p className="text-center text-gray-500 mt-10">Property not found</p>;
  }

 return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {property?.images?.length > 0 ? (
          property?.images.map((img,i) => (
            <img
              key={i}
              src={img}
              alt={property.title}
              className="w-full h-80 object-cover rounded-xl shadow"
            />
          ))
        ) : (
          <img
            src="/placeholder.jpg"
            alt="No Image"
            className="w-full h-80 object-cover rounded-xl"
          />
        )}
      </div>

      {/* Title + Price */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
        <p className="text-gray-600 mb-4">{property.description}</p>
        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold text-blue-600">
            ₹{property.price?.toLocaleString()}
          </p>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            For {property.transactionType}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-gray-50 rounded-xl">
          <BedDouble className="w-6 h-6 mx-auto text-gray-400 mb-1" />
          <p className="text-lg font-medium">{property.bhk || "-"}</p>
          <p className="text-sm text-gray-500">Bedrooms</p>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-xl">
          <Bath className="w-6 h-6 mx-auto text-gray-400 mb-1" />
          <p className="text-lg font-medium">{property.bathroom || "-"}</p>
          <p className="text-sm text-gray-500">Bathrooms</p>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-xl">
          <Maximize className="w-6 h-6 mx-auto text-gray-400 mb-1" />
          <p className="text-lg font-medium">{property.size || "-"} sqft</p>
          <p className="text-sm text-gray-500">Size</p>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-xl">
          <Tag className="w-6 h-6 mx-auto text-gray-400 mb-1" />
          <p className="text-lg font-medium">{property.propertyType}</p>
          <p className="text-sm text-gray-500">Property Type</p>
        </div>
      </div>

      {/* Location */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Location</h2>
        <div className="flex items-center text-gray-700">
          <MapPin className="w-5 h-5 mr-2" />
          <span>
            {property.location?.address}, {property.location?.city},{" "}
            {property.location?.state} - {property.location?.pincode}
          </span>
        </div>
      </div>

      {/* Owner info */}
      {/* <div className="mb-6 bg-gray-50 p-4 rounded-xl border">
        <h2 className="text-xl font-semibold mb-3">Owner Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
          <p className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" /> 
            <strong>Owner:</strong> {userData?.name || "N/A"}
          </p>
          <p className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <strong>Property Created:</strong>{" "}
            {new Date(property.createdAt).toLocaleString()}
          </p>
          <p className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <strong>Property Updated:</strong>{" "}
            {new Date(property.updatedAt).toLocaleString()}
          </p>
          <p className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <strong>Promoted:</strong> {property.isPromoted ? "Yes" : "No"}
          </p>
          <p className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-gray-500" />
            <strong>Status:</strong>{" "}
            <span
              className={`px-2 py-1 rounded ${
                userData.status === "approved"
                  ? "bg-green-100 text-green-700"
                  : userData.status === "rejected"
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {userData.status}
            </span>
          </p>
          {property.reason && (
            <p className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-4 h-4" />
              <strong>Rejection Reason:</strong> {property.reason}
            </p>
          )}
        </div>
      </div> */}
    </div>
  );
};

export default PropertyDetails;
