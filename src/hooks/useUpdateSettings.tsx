import { updateSettings } from "@/services/profile";
import {
  getSettings,
  updateSettings as updateSettingsAction,
} from "@/store/features/settingsSlice";
import { AppDispatch, RootState } from "@/store/store";
import { SettingsType } from "@/types/user";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
const useUpdateSettings = () => {
  const settings = useSelector((state: RootState) => state.Settings);
  const cookies = Cookies.get("guestID");
  // console.log(cookies);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const updateMySettings = async (data: Partial<SettingsType>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateSettings(data);
      const result = await response;

      dispatch(updateSettingsAction(data));
      return result;
    } catch (error) {
      setError(error instanceof Error ? error.message : "حدث خطأ ما");
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const getUserSettings = async () => {
    setLoading(true);
    await dispatch(getSettings());
    setLoading(false);
  };
  return {
    getUserSettings: getUserSettings,
    updateSettings: updateMySettings,
    loading,
    error,
  };
};

export default useUpdateSettings;
