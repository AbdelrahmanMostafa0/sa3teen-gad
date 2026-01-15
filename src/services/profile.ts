import axios from "axios";
import { IUser, SettingsType } from "@/types/user";

export const updateProfile = async (data: IUser) => {
  try {
    const response = await axios.put("/api/auth/me", data);
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

export const getMySettings = async () => {
  try {
    const response = await axios.get("/api/user/settings");
    return response.data;
  } catch (error) {
    console.error("Error getting settings:", error);
    throw error;
  }
};

export const updateSettings = async (data: Partial<SettingsType>) => {
  try {
    const response = await axios.put("/api/user/settings", data);
    return response.data;
  } catch (error) {
    console.error("Error updating settings:", error);
    throw error;
  }
};
