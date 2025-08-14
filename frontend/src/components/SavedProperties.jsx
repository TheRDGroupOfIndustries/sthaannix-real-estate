import React, { useEffect, useState } from "react";
import PropertyCard from "././properties/Propertycard";
import { motion } from "framer-motion";

const SAVED_PROPERTIES_KEY = "savedProperties";

const SavedProperties = () => {
  const [savedProperties, setSavedProperties] = useState([]);

  // Load saved properties on mount
  useEffect(() => {
    const saved = localStorage.getItem(SAVED_PROPERTIES_KEY);
    if (saved) {
      try {
        setSavedProperties(JSON.parse(saved));
      } catch {
        setSavedProperties([]);
      }
    }
  }, []);

  // Remove property from saved list
  const removeProperty = (id) => {
    const updated = savedProperties.filter((prop) => prop._id !== id);
    setSavedProperties(updated);
    localStorage.setItem(SAVED_PROPERTIES_KEY, JSON.stringify(updated));
  };

  if (savedProperties.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <h2 className="text-3xl font-semibold mb-2">No Saved Properties</h2>
        <p className="max-w-md text-center text-gray-600 mb-6">
          You have not saved any properties yet.
        </p>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 pt-20 px-4 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Saved Properties</h1>
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {savedProperties.map((property) => (
          <motion.div key={property._id} layout className="relative group rounded-xl">
            <PropertyCard property={property} viewType="grid" />
            <button
              onClick={() => removeProperty(property._id)}
              className="absolute top-3 right-3 bg-red-600 text-white rounded-full p-1.5 opacity-80 hover:opacity-100 transition"
              title="Remove saved property"
            >
              &times;
            </button>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default SavedProperties;