import axios from "axios";

export const updateProfile = async (data: any) => {
  try {
    const response = await axios.put("/api/auth/me", data);
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};
