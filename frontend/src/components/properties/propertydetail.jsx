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
  Building,
  MessageCircle,
} from "lucide-react";
// import { Backendurl } from "../../App.jsx";
import ScheduleViewing from "./ScheduleViewing";
import {
  getLocalStorage,
  setLocalStorage,
} from "../../utils/localStorageUtil.js";
import {
  fetchPropertyDetail,
  submitInquiry,
} from "../../services/property-InqueryService.js";

const LOCAL_STORAGE_PREFIX = "propertyDetail_";

const PropertyDetails = () => {
  const { id } = useParams();
  const localStorageKey = `${LOCAL_STORAGE_PREFIX}${id}`;
  const [property, setProperty] = useState(() =>
    getLocalStorage(localStorageKey)
  );
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

  //image data safely
  const images = property?.images
  ? Array.isArray(property.images)
    ? property.images
    : [property.images]
  : [];

  // Safely get location string (handle both string and object)
  const getLocationString = () => {
    if (!property?.location) return "Location not specified";

    if (typeof property.location === "string") {
      return property.location;
    }

    if (typeof property.location === "object") {
      // Handle location object - extract the most relevant field
      if (property.location.address) return property.location.address;
      if (property.location.city && property.location.state) {
        return `${property.location.city}, ${property.location.state}`;
      }
      if (property.location.city) return property.location.city;
      if (property.location.state) return property.location.state;

      // Fallback: stringify the object (for debugging)
      return JSON.stringify(property.location);
    }

    return String(property.location);
  };

  const locationString = getLocationString();

  // WhatsApp message template
  const whatsappMessage = `Hello! I'm interested in your property: ${
    property?.title || ""
  } at ${property?.location || ""}. Price: ₹${Number(
    property?.price || 0
  ).toLocaleString("en-IN")}. Please contact me for more details.`;
  const encodedMessage = encodeURIComponent(whatsappMessage);
  const whatsappUrl = `https://wa.me/919876543210?text=${encodedMessage}`;

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);

        const propertyData = await fetchPropertyDetail(id);
        // setProperty(propertyData);
        // setLocalStorage(localStorageKey, propertyData);

        // if (!property) {
        //   setError("Failed to load property details. No local data found.");
        // } else {
        //   setProperty((prev) => ({
        //     ...prev,
        //     amenities: parseAmenities(prev?.amenities),
        //   }));
        //   setError(null);
        // }

        if (propertyData) {
          const processedProperty = {
            ...propertyData,
            amenities: parseAmenities(propertyData?.amenities),
          };
          setProperty(processedProperty);
          setError(null);
        } else {
          setError("Failed to load property details. No data found.");
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
  }, [id, property]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveImage(0);
  }, [id]);

  useEffect(() => {
    if (property) {
      setLocalStorage(localStorageKey, property);
    }
  }, [property, localStorageKey]);

  // const parseAmenities = (amenities) => {
  //   if (!amenities || !Array.isArray(amenities)) return [];

  //   try {
  //     if (typeof amenities[0] === "string") {
  //       return JSON.parse(amenities[0].replace(/'/g, '"'));
  //     }
  //     return amenities;
  //   } catch (error) {
  //     console.error("Error parsing amenities:", error);
  //     return [];
  //   }
  // };

  const parseAmenities = (amenities) => {
    if (!amenities) return [];

    if (Array.isArray(amenities)) {
      // If it's already an array, return it
      return amenities.filter(
        (amenity) => amenity && typeof amenity === "string"
      );
    }

    if (typeof amenities === "string") {
      try {
        // Try to parse JSON string
        const parsed = JSON.parse(amenities.replace(/'/g, '"'));
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch (error) {
        console.error("Error parsing amenities:", error);
        // If parsing fails, split by comma or return as single item array
        return amenities
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
      }
    }

    return [];
  };

  const handleKeyNavigation = useCallback(
  (e) => {
    if (!images.length) return;

    if (e.key === "ArrowLeft") {
      setActiveImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    } else if (e.key === "ArrowRight") {
      setActiveImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    } else if (e.key === "Escape" && showSchedule) {
      setShowSchedule(false);
    }
  },
  [images.length, showSchedule]
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
          text: `Check out this ${property.type || "property"}: ${
            property.title || ""
          }`,
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
      await submitInquiry({
        propertyId: property._id,
        propertyTitle: property.title,
        ...inquiryData,
      });

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-96 bg-gray-200 rounded-xl mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="h-32 bg-gray-200 rounded-lg"></div>
                <div className="h-24 bg-gray-200 rounded-lg"></div>
                <div className="h-12 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="space-y-6">
                <div className="h-32 bg-gray-200 rounded-lg"></div>
                <div className="h-48 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
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
            {images.length > 0 ? (
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={images[activeImage]}
                  alt={`${property.title} - View ${activeImage + 1}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full"
                />
              </AnimatePresence>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <span className="text-gray-500">No image available</span>
              </div>
            )}

            {images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setActiveImage((prev) =>
                      prev === 0 ? images.length - 1 : prev - 1
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
                      prev === images.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full
                    bg-white/80 backdrop-blur-sm hover:bg-white transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {images.length > 0 && (
              <div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 
              bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm"
              >
                {activeImage + 1} / {images.length}
              </div>
            )}
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
              <p className="text-gray-600">
                Available for {property.availability}
              </p>

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
                <p className="mb-4 text-green-600 font-medium">
                  Inquiry sent successfully!
                </p>
              )}

              {/* WhatsApp Button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-green-600 text-white py-3 rounded-lg 
                        hover:bg-green-700 transition-colors flex items-center 
                        justify-center gap-2 mb-6"
              >
                <MessageCircle className="w-5 h-5" />
                Chat on WhatsApp
              </a>

              <form onSubmit={handleInquirySubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
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
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
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
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
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
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700"
                  >
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
              <p className="text-gray-600 leading-relaxed">
                {property.description}
              </p>
            </div>

            {property.amenities && property.amenities.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">Amenities</h2>
                <div className="grid grid-cols-2 gap-4">
                  {property.amenities.map((amenity, index) => (
                    <div
                      key={index}
                      className="flex items-center text-gray-600"
                    >
                      <Building className="w-4 h-4 mr-2 text-blue-600" />
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Map Location */}
        {locationString && locationString !== "Location not specified" && (
          <div className="mt-8 p-6 bg-blue-50 rounded-xl">
            <div className="flex items-center gap-2 text-blue-600 mb-4">
              <Compass className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Location</h3>
            </div>
            <p className="text-gray-600 mb-4">{locationString}</p>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(
                locationString
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              <MapPin className="w-4 h-4" />
              View on Google Maps
            </a>
          </div>
        )}

        {/* Viewing Modal */}
        <AnimatePresence>
          {showSchedule && (
            <ScheduleViewing
              propertyId={property._id}
              onClose={() => setShowSchedule(false)}
              propertyTitle={property.title}
              propertyLocation={locationString}
              propertyImage={images[0]}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default PropertyDetails;
