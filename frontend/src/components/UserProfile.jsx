import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Camera } from "lucide-react";
import { fetchUserProfile, updateUserProfile } from "../services/userService";

// const USER_PROFILE_KEY = "userProfile";

const UserProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [profileImage, setProfileImage] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load user profile from localStorage on mount
  useEffect(() => {
    async function loadProfile() {
    try {
    const profile = await fetchUserProfile();   
    //  if (storedProfile) {
    //   try {
        // const profile = JSON.parse(storedProfile);
        setFormData({
          name: profile.name || "",
          email: profile.email || "",
          phone: profile.phone || "",
        });
        setProfileImage(profile.profileImage || "");
      } catch {
         toast.error("Failed to load profile");
      }
    }
     loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit =async (e) => {
    e.preventDefault();
    setSaving(true);

     try {
      const updatedProfile = { ...formData, profileImage };
      await updateUserProfile(updatedProfile);

      toast.success("Profile updated successfully!");
      setEditMode(false);

    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 mt-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">User Profile</h1>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow p-8 space-y-6"
      >
        {/* Profile Image */}
        <div className="flex flex-col items-center">
          <div className="relative">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-32 h-32 object-cover rounded-full border-4 border-blue-600 shadow"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-blue-200 flex items-center justify-center text-white text-4xl shadow">
                <User />
              </div>
            )}
            {editMode && (
              <label
                htmlFor="fileInput"
                className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700"
                title="Change profile image"
              >
                <Camera className="text-white w-5 h-5" />
                <input
                  type="file"
                  id="fileInput"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>
        </div>

        {/* Form fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              disabled={!editMode}
              className={`w-full border rounded px-3 py-2 ${
                editMode
                  ? "border-blue-500 focus:ring-2 focus:ring-blue-400"
                  : "bg-gray-100 cursor-not-allowed"
              }`}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!editMode}
              className={`w-full border rounded px-3 py-2 ${
                editMode
                  ? "border-blue-500 focus:ring-2 focus:ring-blue-400"
                  : "bg-gray-100 cursor-not-allowed"
              }`}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              disabled={!editMode}
              className={`w-full border rounded px-3 py-2 ${
                editMode
                  ? "border-blue-500 focus:ring-2 focus:ring-blue-400"
                  : "bg-gray-100 cursor-not-allowed"
              }`}
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end space-x-4">
          {editMode ? (
            <>
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setEditMode(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Edit Profile
            </button>
          )}
        </div>
      </motion.form>
    </div>
  );
};

export default UserProfile;