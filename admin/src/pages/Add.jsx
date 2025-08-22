// import { useState } from 'react';
// import { toast } from 'react-hot-toast';
// import axios from 'axios';
// // import { backendurl } from '../config/constants';
// import { Backendurl } from "../App";
// import { Upload, X } from 'lucide-react';

// const PROPERTY_TYPES = ['House', 'Apartment', 'Office', 'Villa'];
// const AVAILABILITY_TYPES = ['rent', 'buy' , 'Lease'];

// const PropertyForm = () => {
//   const [formData, setFormData] = useState({
//     title: '',
//     type: '',
//     price: '',
//     location: '',
//     description: '',
//     bhk: '',
//     bathroom: '',
//     size: '',
//     phone: '',
//     availability: '',
//     amenities: [],
//     images: []
//   });

//   const [previewUrls, setPreviewUrls] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [newAmenity, setNewAmenity] = useState('');

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleAmenityToggle = (amenity) => {
//     setFormData(prev => ({
//       ...prev,
//       amenities: prev.amenities.includes(amenity)
//         ? prev.amenities.filter(a => a !== amenity)
//         : [...prev.amenities, amenity]
//     }));
//   };

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length + previewUrls.length > 4) {
//       alert('Maximum 4 images allowed');
//       return;
//     }

//     const newPreviewUrls = files.map(file => URL.createObjectURL(file));
//     setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
//     setFormData(prev => ({
//       ...prev,
//       images: [...prev.images, ...files]
//     }));
//   };

//   const removeImage = (index) => {
//     setPreviewUrls(prev => prev.filter((_, i) => i !== index));
//     setFormData(prev => ({
//       ...prev,
//       images: prev.images.filter((_, i) => i !== index)
//     }));
//   };

//   const handleAddAmenity = () => {
//     if (newAmenity && !formData.amenities.includes(newAmenity)) {
//       setFormData(prev => ({
//         ...prev,
//         amenities: [...prev.amenities, newAmenity]
//       }));
//       setNewAmenity('');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const formdata = new FormData();
//       formdata.append('title', formData.title);
//       formdata.append('type', formData.type);
//       formdata.append('price', formData.price);
//       formdata.append('location', formData.location);
//       formdata.append('description', formData.description);
//       formdata.append('beds', formData.beds);
//       formdata.append('baths', formData.baths);
//       formdata.append('sqft', formData.sqft);
//       formdata.append('phone', formData.phone);
//       formdata.append('availability', formData.availability);
//       formData.amenities.forEach((amenity, index) => {
//         formdata.append(`amenities[${index}]`, amenity);
//       });
//       formData.images.forEach((image, index) => {
//         formdata.append(`image${index + 1}`, image);
//       });

//       const response = await axios.post(`${Backendurl}`, formdata, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });

//       if (response.data.success) {
//         toast.success(response.data.message);
//         setFormData({
//           title: '',
//           type: '',
//           price: '',
//           location: '',
//           description: '',
//           beds: '',
//           baths: '',
//           sqft: '',
//           phone: '',
//           availability: '',
//           amenities: [],
//           images: []
//         });
//         setPreviewUrls([]);
//         toast.success('Property added successfully');
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error) {
//       console.error('Error adding property:', error);
//       toast.error('An error occurred. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen pt-10 px-4 bg-gray-50">
//       <div className="max-w-3xl mx-auto rounded-lg shadow-xl bg-white p-6">
//         <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Property</h2>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Basic Information */}
//           <div className="space-y-5">
//             <div>
//               <label htmlFor="title" className="block text-sm font-medium text-gray-700">
//                 Property Title
//               </label>
//               <input
//                 type="text"
//                 id="title"
//                 name="title"
//                 required
//                 value={formData.title}
//                 onChange={handleInputChange}
//                 className="mt-2 p-2 block w-full rounded-md border border-gray-100 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//               />
//             </div>

//             <div>
//               <label htmlFor="description" className="block text-sm font-medium text-gray-700">
//                 Description
//               </label>
//               <textarea
//                 id="description"
//                 name="description"
//                 required
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 rows={3}
//                 className="mt-1 block w-full rounded-md border border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//               />
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label htmlFor="type" className="block text-sm font-medium text-gray-700">
//                   Property Type
//                 </label>
//                 <select
//                   id="type"
//                   name="type"
//                   required
//                   value={formData.type}
//                   onChange={handleInputChange}
//                   className="mt-2 p-2 block w-full rounded-md border border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                 >
//                   <option value="">Select Type</option>
//                   {PROPERTY_TYPES.map(type => (
//                     <option key={type} value={type}>
//                       {type}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label htmlFor="availability" className="block text-sm font-medium text-gray-700">
//                   Availability
//                 </label>
//                 <select
//                   id="availability"
//                   name="availability"
//                   required
//                   value={formData.availability}
//                   onChange={handleInputChange}
//                   className="mt-2 p-2 block w-full rounded-md border border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                 >
//                   <option value="">Select Availability</option>
//                   {AVAILABILITY_TYPES.map(type => (
//                     <option key={type} value={type}>
//                       {type.charAt(0).toUpperCase() + type.slice(1)}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label htmlFor="price" className="block text-sm font-medium text-gray-700">
//                   Price
//                 </label>
//                 <input
//                   type="number"
//                   id="price"
//                   name="price"
//                   required
//                   min="0"
//                   value={formData.price}
//                   onChange={handleInputChange}
//                   className="mt-2 p-2 block w-full rounded-md border border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                 />
//               </div>

//               <div>
//                 <label htmlFor="location" className="block text-sm font-medium text-gray-700">
//                   Location
//                 </label>
//                 <input
//                   type="text"
//                   id="location"
//                   name="location"
//                   required
//                   value={formData.location}
//                   onChange={handleInputChange}
//                   className="mt-2 p-2 block w-full rounded-md border border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-3 gap-4">
//               <div>
//                 <label htmlFor="beds" className="block text-sm font-medium text-gray-700">
//                   Bedrooms
//                 </label>
//                 <input
//                   type="number"
//                   id="beds"
//                   name="beds"
//                   required
//                   min="0"
//                   value={formData.beds}
//                   onChange={handleInputChange}
//                   className="mt-2 p-2 block w-full rounded-md border border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                 />
//               </div>

//               <div>
//                 <label htmlFor="baths" className="block text-sm font-medium text-gray-700">
//                   Bathrooms
//                 </label>
//                 <input
//                   type="number"
//                   id="baths"
//                   name="baths"
//                   required
//                   min="0"
//                   value={formData.baths}
//                   onChange={handleInputChange}
//                   className="mt-2 p-2 block w-full rounded-md border border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                 />
//               </div>

//               <div>
//                 <label htmlFor="sqft" className="block text-sm font-medium text-gray-700">
//                   Square Feet
//                 </label>
//                 <input
//                   type="number"
//                   id="sqft"
//                   name="sqft"
//                   required
//                   min="0"
//                   value={formData.sqft}
//                   onChange={handleInputChange}
//                   className="mt-2 p-2 block w-full rounded-md border border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                 />
//               </div>
//             </div>

//             <div>
//               <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
//                 Contact Phone
//               </label>
//               <input
//                 type="tel"
//                 id="phone"
//                 name="phone"
//                 required
//                 value={formData.phone}
//                 onChange={handleInputChange}
//                 className="mt-2 p-2 block w-full rounded-md border border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//               />
//             </div>
//           </div>

//           {/* Amenities */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Amenities
//             </label>
//             <div className="flex flex-wrap gap-2">
//               {formData.amenities.map((amenity, index) => (
//                 <div key={index} className="flex items-center">
//                   <input
//                     type="checkbox"
//                     id={`amenity-${index}`}
//                     name="amenities"
//                     value={amenity}
//                     checked={formData.amenities.includes(amenity)}
//                     onChange={() => handleAmenityToggle(amenity)}
//                     className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//                   />
//                   <label htmlFor={`amenity-${index}`} className="ml-2 block text-sm text-gray-700">
//                     {amenity}
//                   </label>
//                 </div>
//               ))}
//             </div>
//             <div className="mt-4 flex items-center">
//               <input
//                 type="text"
//                 value={newAmenity}
//                 onChange={(e) => setNewAmenity(e.target.value)}
//                 placeholder="Add new amenity"
//                 className="mt-2 p-2 block w-full rounded-md border border-gray-100 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//               />
//               <button
//                 type="button"
//                 onClick={handleAddAmenity}
//                 className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
//               >
//                 Add
//               </button>
//             </div>
//           </div>

//           {/* Image Upload */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Property Images (Max 4)
//             </label>
//             <div className="grid grid-cols-2 gap-4 mb-4">
//               {previewUrls.map((url, index) => (
//                 <div key={index} className="relative">
//                   <img
//                     src={url}
//                     alt={`Preview ${index + 1}`}
//                     className="h-40 w-full object-cover rounded-lg"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => removeImage(index)}
//                     className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
//                   >
//                     <X size={16} />
//                   </button>
//                 </div>
//               ))}
//             </div>
//             {previewUrls.length < 4 && (
//               <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
//                 <div className="space-y-1 text-center">
//                   <Upload className="mx-auto h-12 w-12 text-gray-400" />
//                   <div className="flex text-sm text-gray-600">
//                     <label htmlFor="images" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
//                       <span>Upload images</span>
//                       <input
//                         id="images"
//                         name="images"
//                         type="file"
//                         multiple
//                         accept="image/*"
//                         onChange={handleImageChange}
//                         className="sr-only"
//                       />
//                     </label>
//                   </div>
//                   <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Submit Button */}
//           <div>
//             <button
//               type="submit"
//               className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//               disabled={loading}
//             >
//               {loading ? 'Submitting...' : 'Submit Property'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PropertyForm;

// import { useState } from 'react';
// import { toast } from 'react-hot-toast';
// import { Upload, X } from 'lucide-react';
// import { propertiesAPI } from '../api/api'; // <- Import your API reference

// const PROPERTY_TYPES = ['House', 'Apartment', 'Office', 'Villa'];
// const AVAILABILITY_TYPES = ['rent', 'buy', 'Lease'];

// const PropertyForm = () => {
//   const [formData, setFormData] = useState({
//     title: '',
//     type: '',
//     price: '',
//     location: '',
//     description: '',
//     beds: '',
//     baths: '',
//     sqft: '',
//     phone: '',
//     availability: '',
//     amenities: [],
//     images: []
//   });

//   const [previewUrls, setPreviewUrls] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [newAmenity, setNewAmenity] = useState('');

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleAmenityToggle = (amenity) => {
//     setFormData(prev => ({
//       ...prev,
//       amenities: prev.amenities.includes(amenity)
//         ? prev.amenities.filter(a => a !== amenity)
//         : [...prev.amenities, amenity]
//     }));
//   };

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length + previewUrls.length > 4) {
//       alert('Maximum 4 images allowed');
//       return;
//     }
//     const newPreviewUrls = files.map(file => URL.createObjectURL(file));
//     setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
//     setFormData(prev => ({
//       ...prev,
//       images: [...prev.images, ...files]
//     }));
//   };

//   const removeImage = (index) => {
//     setPreviewUrls(prev => prev.filter((_, i) => i !== index));
//     setFormData(prev => ({
//       ...prev,
//       images: prev.images.filter((_, i) => i !== index)
//     }));
//   };

//   const handleAddAmenity = () => {
//     if (newAmenity && !formData.amenities.includes(newAmenity)) {
//       setFormData(prev => ({
//         ...prev,
//         amenities: [...prev.amenities, newAmenity]
//       }));
//       setNewAmenity('');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const response = await propertiesAPI.create(formData); // <- Using API reference
//       toast.success('Property added successfully');
//       setFormData({
//         title: '',
//         type: '',
//         price: '',
//         location: '',
//         description: '',
//         beds: '',
//         baths: '',
//         sqft: '',
//         phone: '',
//         availability: '',
//         amenities: [],
//         images: []
//       });
//       setPreviewUrls([]);
//     } catch (error) {
//       console.error('Error adding property:', error);
//       toast.error('An error occurred. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen pt-10 px-4 bg-gray-50">
//       <div className="max-w-3xl mx-auto rounded-lg shadow-xl bg-white p-6">
//         <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Property</h2>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Property Title */}
//           <div>
//             <label htmlFor="title" className="block text-sm font-medium text-gray-700">
//               Property Title
//             </label>
//             <input
//               type="text"
//               id="title"
//               name="title"
//               required
//               value={formData.title}
//               onChange={handleInputChange}
//               className="mt-2 p-2 block w-full rounded-md border border-gray-100 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//             />
//           </div>

//           {/* Description */}
//           <div>
//             <label htmlFor="description" className="block text-sm font-medium text-gray-700">
//               Description
//             </label>
//             <textarea
//               id="description"
//               name="description"
//               required
//               value={formData.description}
//               onChange={handleInputChange}
//               rows={3}
//               className="mt-1 block w-full rounded-md border border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//             />
//           </div>

//           {/* Type & Availability */}
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label htmlFor="type" className="block text-sm font-medium text-gray-700">Property Type</label>
//               <select
//                 id="type"
//                 name="type"
//                 required
//                 value={formData.type}
//                 onChange={handleInputChange}
//                 className="mt-2 p-2 block w-full rounded-md border border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//               >
//                 <option value="">Select Type</option>
//                 {PROPERTY_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
//               </select>
//             </div>
//             <div>
//               <label htmlFor="availability" className="block text-sm font-medium text-gray-700">Availability</label>
//               <select
//                 id="availability"
//                 name="availability"
//                 required
//                 value={formData.availability}
//                 onChange={handleInputChange}
//                 className="mt-2 p-2 block w-full rounded-md border border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//               >
//                 <option value="">Select Availability</option>
//                 {AVAILABILITY_TYPES.map(type => (
//                   <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {/* Price & Location */}
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
//               <input
//                 type="number"
//                 id="price"
//                 name="price"
//                 required
//                 min="0"
//                 value={formData.price}
//                 onChange={handleInputChange}
//                 className="mt-2 p-2 block w-full rounded-md border border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//               />
//             </div>
//             <div>
//               <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
//               <input
//                 type="text"
//                 id="location"
//                 name="location"
//                 required
//                 value={formData.location}
//                 onChange={handleInputChange}
//                 className="mt-2 p-2 block w-full rounded-md border border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//               />
//             </div>
//           </div>

//           {/* Beds, Baths, Sqft */}
//           <div className="grid grid-cols-3 gap-4">
//             <div>
//               <label htmlFor="beds" className="block text-sm font-medium text-gray-700">Bedrooms</label>
//               <input
//                 type="number"
//                 id="beds"
//                 name="beds"
//                 required
//                 min="0"
//                 value={formData.beds}
//                 onChange={handleInputChange}
//                 className="mt-2 p-2 block w-full rounded-md border border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//               />
//             </div>
//             <div>
//               <label htmlFor="baths" className="block text-sm font-medium text-gray-700">Bathrooms</label>
//               <input
//                 type="number"
//                 id="baths"
//                 name="baths"
//                 required
//                 min="0"
//                 value={formData.baths}
//                 onChange={handleInputChange}
//                 className="mt-2 p-2 block w-full rounded-md border border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//               />
//             </div>
//             <div>
//               <label htmlFor="sqft" className="block text-sm font-medium text-gray-700">Square Feet</label>
//               <input
//                 type="number"
//                 id="sqft"
//                 name="sqft"
//                 required
//                 min="0"
//                 value={formData.sqft}
//                 onChange={handleInputChange}
//                 className="mt-2 p-2 block w-full rounded-md border border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//               />
//             </div>
//           </div>

//           {/* Phone */}
//           <div>
//             <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Contact Phone</label>
//             <input
//               type="tel"
//               id="phone"
//               name="phone"
//               required
//               value={formData.phone}
//               onChange={handleInputChange}
//               className="mt-2 p-2 block w-full rounded-md border border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//             />
//           </div>

//           {/* Amenities */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
//             <div className="flex flex-wrap gap-2">
//               {formData.amenities.map((amenity, index) => (
//                 <div key={index} className="flex items-center">
//                   <input
//                     type="checkbox"
//                     id={`amenity-${index}`}
//                     value={amenity}
//                     checked={formData.amenities.includes(amenity)}
//                     onChange={() => handleAmenityToggle(amenity)}
//                     className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
//                   />
//                   <label htmlFor={`amenity-${index}`} className="ml-2 block text-sm text-gray-700">{amenity}</label>
//                 </div>
//               ))}
//             </div>
//             <div className="mt-4 flex items-center">
//               <input
//                 type="text"
//                 value={newAmenity}
//                 onChange={(e) => setNewAmenity(e.target.value)}
//                 placeholder="Add new amenity"
//                 className="mt-2 p-2 block w-full rounded-md border border-gray-100 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//               />
//               <button
//                 type="button"
//                 onClick={handleAddAmenity}
//                 className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
//               >
//                 Add
//               </button>
//             </div>
//           </div>

//           {/* Images */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Property Images (Max 4)</label>
//             <div className="grid grid-cols-2 gap-4 mb-4">
//               {previewUrls.map((url, index) => (
//                 <div key={index} className="relative">
//                   <img src={url} alt={`Preview ${index + 1}`} className="h-40 w-full object-cover rounded-lg" />
//                   <button
//                     type="button"
//                     onClick={() => removeImage(index)}
//                     className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
//                   >
//                     <X size={16} />
//                   </button>
//                 </div>
//               ))}
//             </div>
//             {previewUrls.length < 4 && (
//               <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
//                 <div className="space-y-1 text-center">
//                   <Upload className="mx-auto h-12 w-12 text-gray-400" />
//                   <div className="flex text-sm text-gray-600">
//                     <label htmlFor="images" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
//                       <span>Upload images</span>
//                       <input
//                         id="images"
//                         name="images"
//                         type="file"
//                         multiple
//                         accept="image/*"
//                         onChange={handleImageChange}
//                         className="sr-only"
//                       />
//                     </label>
//                   </div>
//                   <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Submit */}
//           <div>
//             <button
//               type="submit"
//               className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//               disabled={loading}
//             >
//               {loading ? 'Submitting...' : 'Submit Property'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PropertyForm;

import { useState } from "react";
import { toast } from "react-hot-toast";
import { Upload, X } from "lucide-react";
import { propertiesAPI } from "../api/api";
import axios from "axios";
import http from "../api/http";

const PROPERTY_TYPES = ["house", "apartment", "commercial", "villa", "plot"];
const AVAILABILITY_TYPES = ["buy", "rent", "lease"];

const PropertyForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    propertyType: "",
    price: "",
    location: {
      address: "",
      city: "",
      state: "",
      pincode: "",
      coordinates: { type: "Point", coordinates: [0, 0] },
    },
    description: "",
    bhk: "",
    bathroom: "",
    size: "",
    phone: "",
    transactionType: "",
    amenities: [],
    images: [],
  });

  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newAmenity, setNewAmenity] = useState("");

  // Handle input change (including nested location fields)
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("location.")) {
      const locKey = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, [locKey]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    console.log(formData.price);
  };

  // Image selection handler
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + previewUrls.length > 4) {
      alert("Maximum 4 images allowed");
      return;
    }
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }));
  };

  // Remove image preview and file
  const removeImage = (index) => {
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Add new amenity (optional)
  const handleAddAmenity = () => {
    if (newAmenity && !formData.amenities.includes(newAmenity)) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity],
      }));
      setNewAmenity("");
    }
  };

  // Submit handler with proper mapping and serialization
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(formData.price);

    // logs for debug
    {
      console.log("Title:", formData.title);
      console.log("Description:", formData.description);
      console.log("Property Type:", formData.propertyType);
      console.log("Transaction Type:", formData.transactionType);
      console.log("Price:", formData.price);
      console.log("Size:", formData.size);
      console.log("BHK:", formData.bhk);
      console.log("Bathroom:", formData.bathroom);
      console.log("Location:", formData.location);
      console.log("Is Promoted:", formData.isPromoted);
      console.log("Phone:", formData.phone);
    }

    const price = Number(formData.price);
    if (!price || isNaN(price)) {
      toast.error("Price must be a valid number");
      setLoading(false);
      return;
    }

    try {
      // Map frontend to backend field names and types
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        propertyType: formData.propertyType.toLowerCase(),
        transactionType: formData.transactionType.toLowerCase(),
        price: Number(formData.price),
        size: formData.size ? Number(formData.size) : undefined,
        bhk: formData.bhk ? Number(formData.bhk) : undefined,
        bathroom: formData.bathroom ? Number(formData.bathroom) : undefined,

        location: formData.location,
        images: formData.images,
      };

      if (
        !payload.title ||
        !payload.propertyType ||
        !payload.transactionType ||
        !payload.price
      ) {
        toast.error("Please fill in Title, Type, transactionType, and Price");
        setLoading(false);
        return;
      }

      // Build multipart form data
      const formPayload = new FormData();
      Object.keys(payload).forEach((key) => {
        if (key === "images") {
          payload.images.forEach((image) =>
            formPayload.append("images", image)
          );
        } else if (key === "location") {
          formPayload.append("location", JSON.stringify(payload.location));
        } else if (["price", "size", "bhk", "bathroom"].includes(key)) {
          // convert numbers to strings
          formPayload.append(key, payload[key] ? payload[key].toString() : "");
        } else {
          formPayload.append(key, payload[key] || "");
        }
      });

      const response = await http.post("/properties/create", payload);

      toast.success("Property added successfully");
      setFormData({
        title: "",
        propertyType: "",
        price: "",
        location: {
          address: "",
          city: "",
          state: "",
          pincode: "",
          coordinates: { type: "Point", coordinates: [0, 0] },
        },
        description: "",
        bhk: "",
        bathroom: "",
        size: "",
        phone: "",
        transactionType: "",
        amenities: [],
        images: [],
      });
      setPreviewUrls([]);
    } catch (error) {
      console.error("Error adding property:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-10 px-4 bg-gray-50">
      <div className="max-w-3xl mx-auto rounded-lg shadow-xl bg-white p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Add New Property
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Property Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleInputChange}
              className="mt-2 p-2 block w-full rounded-md border border-gray-100 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {/* Property Type & transactionType */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700"
              >
                Property Type
              </label>
              <select
                id="propertyType"
                name="propertyType" // ✅ matches state
                required
                value={formData.propertyType} // ✅ correct
                onChange={handleInputChange}
                className="mt-2 p-2 block w-full rounded-md border border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Select Type</option>
                {PROPERTY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="transactionType"
                className="block text-sm font-medium text-gray-700"
              >
                Transaction Type
              </label>
              <select
                id="transactionType"
                name="transactionType"
                required
                value={formData.transactionType}
                onChange={handleInputChange}
                className="mt-2 p-2 block w-full rounded-md border border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Select Transaction Type</option>
                {AVAILABILITY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price & Location inputs */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                Price
              </label>
              <input
                type="number"
                id="price"
                name="price"
                min="0"
                required
                value={formData.price}
                onChange={handleInputChange}
                className="mt-2 p-2 block w-full rounded-md border border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="location.address"
                className="block text-sm font-medium text-gray-700"
              >
                Address
              </label>
              <input
                type="text"
                id="location.address"
                name="location.address"
                value={formData.location.address}
                onChange={handleInputChange}
                className="mt-2 p-2 block w-full rounded-md border border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="location.city"
                className="block text-sm font-medium text-gray-700"
              >
                City
              </label>
              <input
                type="text"
                id="location.city"
                name="location.city"
                value={formData.location.city}
                onChange={handleInputChange}
                className="mt-2 p-2 block w-full rounded-md border border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          {/* bhk, bathroom, size */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="bhk"
                className="block text-sm font-medium text-gray-700"
              >
                Bedrooms
              </label>
              <input
                type="number"
                id="bhk"
                name="bhk"
                min="0"
                value={formData.bhk}
                onChange={handleInputChange}
                className="mt-2 p-2 block w-full rounded-md border border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="bathroom"
                className="block text-sm font-medium text-gray-700"
              >
                Bathrooms
              </label>
              <input
                type="number"
                id="bathroom"
                name="bathroom"
                min="0"
                value={formData.bathroom}
                onChange={handleInputChange}
                className="mt-2 p-2 block w-full rounded-md border border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="size"
                className="block text-sm font-medium text-gray-700"
              >
                Square Feet
              </label>
              <input
                type="number"
                id="size"
                name="size"
                min="0"
                value={formData.size}
                onChange={handleInputChange}
                className="mt-2 p-2 block w-full rounded-md border border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Contact Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="mt-2 p-2 block w-full rounded-md border border-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Images (Max 4)
            </label>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="h-40 w-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    aria-label="Remove Image"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
            {previewUrls.length < 4 && (
              <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="images"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      <span>Upload images</span>
                      <input
                        id="images"
                        name="images"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? "Submitting..." : "Submit Property"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyForm;
