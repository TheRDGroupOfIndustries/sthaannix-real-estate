
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Backendurl } from "../config/constants";
import { X, Upload } from "lucide-react";
import http from "../api/http";

const PROPERTY_TYPES = ["house", "apartment", "commercial", "villa", "plot"];
const TRANSACTION_TYPES = ["buy", "rent", "lease"];

const Update = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    propertyType: "",
    price: "",
    description: "",
    bhk: "",
    bathroom: "",
    size: "",
    transactionType: "",
    images: [],
    location: {
      address: "",
      city: "",
      state: "",
      pincode: "",
    },
  });
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch existing property
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await http.get(`${Backendurl}/properties/get-by-id/${id}`);
        if (res.status === 200) {
          const property = res.data;

          setFormData({
            title: property.title || "",
            propertyType: property.propertyType || "",
            price: property.price || "",
            description: property.description || "",
            bhk: property.bhk || "",
            bathroom: property.bathroom || "",
            size: property.size || "",
            transactionType: property.transactionType || "",
            images: (property.images || []).map((url) => ({
              type: "url",
              value: url,
            })),
            location: property.location || {
              address: "",
              city: "",
              state: "",
              pincode: "",
            },
          });

          setPreviewUrls(property.images || []);
        } else {
          toast.error(res.data.message);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch property");
      }
    };

    fetchProperty();
  }, [id]);

  // Input handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };






  return (
    <div className="min-h-screen pt-32 px-4 bg-gray-50">
      <div className="max-w-2xl mx-auto rounded-lg shadow-xl bg-white p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Update Property
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Property Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-200 p-2"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-200 p-2"
              required
            />
          </div>

          {/* Property Type & Transaction Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Property Type
              </label>
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-200 p-2"
                required
              >
                <option value="">Select Type</option>
                {PROPERTY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Transaction Type
              </label>
              <select
                name="transactionType"
                value={formData.transactionType}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-200 p-2"
                required
              >
                <option value="">Select Transaction</option>
                {TRANSACTION_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-200 p-2"
              required
            />
          </div>

          {/* BHK, Bathrooms, Size */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                BHK
              </label>
              <input
                type="number"
                name="bhk"
                value={formData.bhk}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-200 p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bathrooms
              </label>
              <input
                type="number"
                name="bathroom"
                value={formData.bathroom}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-200 p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Size (sqft)
              </label>
              <input
                type="number"
                name="size"
                value={formData.size}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-200 p-2"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              name="address"
              value={formData.location.address}
              onChange={handleLocationChange}
              placeholder="Address"
              className="mt-1 block w-full rounded-md border border-gray-200 p-2"
            />
            <div className="grid grid-cols-3 gap-2 mt-2">
              <input
                type="text"
                name="city"
                value={formData.location.city}
                onChange={handleLocationChange}
                placeholder="City"
                className="rounded-md border border-gray-200 p-2"
              />
              <input
                type="text"
                name="state"
                value={formData.location.state}
                onChange={handleLocationChange}
                placeholder="State"
                className="rounded-md border border-gray-200 p-2"
              />
              <input
                type="text"
                name="pincode"
                value={formData.location.pincode}
                onChange={handleLocationChange}
                placeholder="Pincode"
                className="rounded-md border border-gray-200 p-2"
              />
            </div>
          </div>

          {/* Phone */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-200 p-2"
            />
          </div> */}

          {/* Amenities */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
            <div className="flex flex-wrap gap-2">
              {AMENITIES.map(amenity => (
                <button
                  type="button"
                  key={amenity}
                  onClick={() => handleAmenityToggle(amenity)}
                  className={`px-3 py-1 rounded-md text-sm ${
                    formData.amenities.includes(amenity)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {amenity}
                </button>
              ))}
            </div>
          </div> */}

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Property Images
            </label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={
                      typeof url === "string" ? url : URL.createObjectURL(url)
                    }
                    alt=""
                    className="h-40 w-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
            {previewUrls.length < 4 && (
              <div className="mt-4 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-md">
                <div className="text-center">
                  <Upload className="mx-auto h-10 w-10 text-gray-400" />
                  <label className="mt-2 block text-sm text-indigo-600 cursor-pointer">
                    <span>Upload images</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
          >
            {loading ? "Updating..." : "Update Property"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Update;
