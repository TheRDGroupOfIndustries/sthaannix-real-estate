import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BedDouble,
  Bath,
  Maximize,
  ArrowLeft,
  Phone,
  Calendar,
  MapPin,
  Share2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Compass,
} from "lucide-react";
import { Backendurl } from "../../App.jsx";
import ScheduleViewing from "./ScheduleViewing";
import { getLocalStorage, setLocalStorage } from "../../utils/localStorageUtil.js";
// import { fetchPropertyDetail } from "../api/propertyApi"; // Uncomment when backend ready

const LOCAL_STORAGE_PREFIX = "propertyDetail_";

const PropertyDetails = () => {
  const { id } = useParams();
  const localStorageKey = `${LOCAL_STORAGE_PREFIX}${id}`;
  const [property, setProperty] = useState(() => getLocalStorage(localStorageKey));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSchedule, setShowSchedule] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);
  const [inquiryData, setInquiryData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);

        // Future backend API fetch
        // const propertyData = await fetchPropertyDetail(id);
        // setProperty({
        //   ...propertyData,
        //   amenities: parseAmenities(propertyData.amenities),
        // });
        // setLocalStorage(localStorageKey, propertyData);
        // setError(null);

        // No backend fallback: use localStorage or error
        if (!property) {
          setError("Failed to load property details. No local data found.");
        } else {
          setProperty((prev) => ({
            ...prev,
            amenities: parseAmenities(prev?.amenities),
          }));
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching property details:", err);
        setError("Failed to load property details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (!property) {
      fetchProperty();
    }
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveImage(0);
  }, [id]);

  useEffect(() => {
    if (property) {
      setLocalStorage(localStorageKey, property);
    }
  }, [property, localStorageKey]);

  const parseAmenities = (amenities) => {
    if (!amenities || !Array.isArray(amenities)) return [];

    try {
      if (typeof amenities[0] === "string") {
        return JSON.parse(amenities[0].replace(/'/g, '"'));
      }
      return amenities;
    } catch (error) {
      console.error("Error parsing amenities:", error);
      return [];
    }
  };

  const handleKeyNavigation = useCallback(
    (e) => {
      if (e.key === "ArrowLeft") {
        setActiveImage((prev) =>
          prev === 0 ? property.image.length - 1 : prev - 1
        );
      } else if (e.key === "ArrowRight") {
        setActiveImage((prev) =>
          prev === property.image.length - 1 ? 0 : prev + 1
        );
      } else if (e.key === "Escape" && showSchedule) {
        setShowSchedule(false);
      }
    },
    [property?.image?.length, showSchedule]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyNavigation);
    return () => window.removeEventListener("keydown", handleKeyNavigation);
  }, [handleKeyNavigation]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: property.title,
          text: `Check out this ${property.type}: ${property.title}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  // Inquiry form handlers

  const handleInquiryChange = (e) => {
    const { name, value } = e.target;
    setInquiryData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();

    if (!inquiryData.name || !inquiryData.email || !inquiryData.phone) {
      alert("Please fill in all required fields.");
      return;
    }

    setInquirySubmitting(true);

    try {
      // Future API call to send inquiry
      // const token = localStorage.getItem("token");
      // if (!token) {
      //   alert("Please log in to submit inquiry.");
      //   setInquirySubmitting(false);
      //   return;
      // }
      // await axios.post(
      //   `${Backendurl}/api/inquiries`,
      //   {
      //     propertyId: property._id,
      //     ...inquiryData,
      //   },
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //       "Content-Type": "application/json",
      //     },
      //   }
      // );

      // For now simulate success
      setInquirySuccess(true);
      setTimeout(() => {
        setInquirySuccess(false);
        setInquiryData({
          name: "",
          email: "",
          phone: "",
          message: "",
        });
      }, 3000);
    } catch (err) {
      console.error("Inquiry submission error:", err);
      alert("Failed to submit inquiry. Please try again.");
    } finally {
      setInquirySubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        {/* Your existing loading skeleton UI unchanged */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Link
            to="/properties"
            className="text-blue-600 hover:underline flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  if (!property) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 pt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <nav className="flex items-center justify-between mb-8">
          <Link
            to="/properties"
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Properties
          </Link>
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
              hover:bg-gray-100 transition-colors relative"
          >
            {copySuccess ? (
              <span className="text-green-600">
                <Copy className="w-5 h-5" />
                Copied!
              </span>
            ) : (
              <>
                <Share2 className="w-5 h-5" />
                Share
              </>
            )}
          </button>
        </nav>

        {/* Image gallery */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="relative h-[500px] bg-gray-100 rounded-xl overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImage}
                src={property.image[activeImage]}
                alt={`${property.title} - View ${activeImage + 1}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full"
              />
            </AnimatePresence>

            {property.image.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setActiveImage((prev) =>
                      prev === 0 ? property.image.length - 1 : prev - 1
                    )
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full
                    bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() =>
                    setActiveImage((prev) =>
                      prev === property.image.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full
                    bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 
              bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm"
            >
              {activeImage + 1} / {property.image.length}
            </div>
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left column */}
          <div>
            <div className="bg-blue-50 rounded-lg p-6 mb-6 space-y-4">
              <p className="text-3xl font-bold text-blue-600 mb-2">
                ₹{Number(property.price).toLocaleString("en-IN")}
              </p>
              <p className="text-gray-600">Available for {property.availability}</p>

              {/* Buy, Rent, Lease Buttons */}
              <div className="flex gap-4 mt-4">
                {["Buy", "Rent", "Lease"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    disabled={property.availability !== option}
                    className={`flex-1 py-2 rounded-lg text-white font-semibold transition-colors ${
                      property.availability === option
                        ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <BedDouble className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  {property.beds} {property.beds > 1 ? "Beds" : "Bed"}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <Bath className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  {property.baths} {property.baths > 1 ? "Baths" : "Bath"}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <Maximize className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">{property.sqft} sqft</p>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Contact Details</h2>
              <div className="flex items-center text-gray-600">
                <Phone className="w-5 h-5 mr-2" />
                {property.phone}
              </div>
            </div>

            <button
              onClick={() => setShowSchedule(true)}
              className="w-full bg-blue-600 text-white py-3 rounded-lg 
                    hover:bg-blue-700 transition-colors flex items-center 
                    justify-center gap-2 mb-8"
            >
              <Calendar className="w-5 h-5" />
              Schedule Viewing
            </button>

            {/* Inquiry Form */}
            <div className="bg-white rounded-lg p-6 shadow">
              <h2 className="text-xl font-semibold mb-4">Send Inquiry</h2>
              {inquirySuccess && (
                <p className="mb-4 text-green-600 font-medium">Inquiry sent successfully!</p>
              )}
              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={inquiryData.name}
                    onChange={handleInquiryChange}
                    disabled={inquirySubmitting}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm
                      px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={inquiryData.email}
                    onChange={handleInquiryChange}
                    disabled={inquirySubmitting}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm
                      px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={inquiryData.phone}
                    onChange={handleInquiryChange}
                    disabled={inquirySubmitting}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm
                      px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="3"
                    value={inquiryData.message}
                    onChange={handleInquiryChange}
                    disabled={inquirySubmitting}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm
                      px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Any questions or details..."
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={inquirySubmitting}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700
                      transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {inquirySubmitting ? "Sending..." : "Send Inquiry"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right column */}
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-gray-600 leading-relaxed">{property.description}</p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 gap-4">
                {property.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center text-gray-600">
                    <Building className="w-4 h-4 mr-2 text-blue-600" />
                    {amenity}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Map Location */}
        <div className="mt-8 p-6 bg-blue-50 rounded-xl">
          <div className="flex items-center gap-2 text-blue-600 mb-4">
            <Compass className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Location</h3>
          </div>
          <p className="text-gray-600 mb-4">{property.location}</p>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(property.location)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <MapPin className="w-4 h-4" />
            View on Google Maps
          </a>
        </div>
 
        {/* Viewing Modal */}
        <AnimatePresence>
          {showSchedule && (
            <ScheduleViewing
              propertyId={property._id}
              onClose={() => setShowSchedule(false)}
              propertyTitle={property.title}
              propertyLocation={property.location}
              propertyImage={property.image?.[0]}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default PropertyDetails;