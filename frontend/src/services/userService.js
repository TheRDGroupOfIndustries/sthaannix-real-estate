import { configBackendURL } from "../config";

export async function fetchUserProfile() {
  try {
    const token = localStorage.getItem("token"); // Get your JWT token

    const response = await fetch(`${configBackendURL}/me/get`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include token
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

export async function updateUserProfile(profileData) {
  try {
    const token = localStorage.getItem("token"); 

    const response = await fetch(`${configBackendURL}/me/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, 
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error("Failed to update user profile");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}
