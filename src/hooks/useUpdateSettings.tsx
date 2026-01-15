import { updateSettings } from "@/services/profile";
import {
  getSettings,
  updateSettings as updateSettingsAction,
} from "@/store/features/settingsSlice";
import { AppDispatch } from "@/store/store";
import { SettingsType } from "@/types/user";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
const useUpdateSettings = () => {
  const cookies = Cookies.get("guestID");
  console.log(cookies);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(getSettings());
  }, [dispatch]);
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

  return {
    updateSettings: updateMySettings,
    loading,
    error,
  };
};

export default useUpdateSettings;
