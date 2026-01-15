import axios from "axios";
import { IUser } from "@/types/user";

export const updateProfile = async (data: IUser) => {
  try {
    const response = await axios.put("/api/auth/me", data);
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};
