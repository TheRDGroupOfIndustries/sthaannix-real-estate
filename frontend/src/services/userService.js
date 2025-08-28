import http from "../api/http";


export async function fetchUserProfile() {
  try {
    const response = await http.get("/me/get"); 
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

export async function updateUserProfile(profileData) {
  try {
    const response = await http.put("/me/update", profileData); // ✅ PUT request with body
    return response.data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}
