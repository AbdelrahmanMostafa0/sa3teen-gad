import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { updateSettings } from "@/store/features/settingsSlice";
import { SettingsType } from "@/types/user";
import { useUser } from "./useUser";
import axios from "axios";

interface UpdateUserData {
  fullName?: string;
  profilePicture?: string | null;
  settings?: Partial<{
    timers?: Partial<SettingsType["timers"]>;
    waterReminder?: Partial<SettingsType["waterReminder"]>;
    prayerReminder?: Partial<SettingsType["prayerReminder"]>;
    location?: Partial<SettingsType["location"]>;
    ui?: Partial<SettingsType["ui"]>;
  }>;
}

interface UseUpdateUserReturn {
  updateUser: (data: UpdateUserData) => Promise<any>;
  updateUserSettings: (settings: Partial<SettingsType>) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function useUpdateUser(): UseUpdateUserReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useUser();
  const updateUser = async (data: UpdateUserData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.patch("/api/auth/me", data);
      const result = await response.data;

      if (!result.success) {
        throw new Error(result.message || "فشل التحديث");
      }

      return result.user;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "حدث خطأ ما";
      setError(errorMessage);
      console.error("Error updating user:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(updateSettings(user.settings));
    }
  }, [isAuthenticated]);
  const updateUserSettings = async (settingsUpdate: Partial<SettingsType>) => {
    setLoading(true);
    setError(null);

    try {
      dispatch(updateSettings(settingsUpdate));

      if (isAuthenticated) {
        const response = await axios.put("/api/auth/me", {
          settings: settingsUpdate,
        });

        const result = await response.data;

        if (!result.success) {
          throw new Error(result.message || "فشل تحديث الإعدادات");
        }
      } else {
        const currentSettings = localStorage.getItem("settings");
        const parsedSettings = currentSettings
          ? JSON.parse(currentSettings)
          : {};
        const updatedSettings = {
          ...parsedSettings,
          ...settingsUpdate,
          timers: {
            ...parsedSettings.timers,
            ...settingsUpdate.timers,
          },
          waterReminder: {
            ...parsedSettings.waterReminder,
            ...settingsUpdate.waterReminder,
          },
          prayerReminder: {
            ...parsedSettings.prayerReminder,
            ...settingsUpdate.prayerReminder,
            perPrayer: {
              ...parsedSettings.prayerReminder?.perPrayer,
              ...settingsUpdate.prayerReminder?.perPrayer,
            },
          },
          location: {
            ...parsedSettings.location,
            ...settingsUpdate.location,
          },
          ui: {
            ...parsedSettings.ui,
            ...settingsUpdate.ui,
          },
        };

        localStorage.setItem("settings", JSON.stringify(updatedSettings));
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "حدث خطأ أثناء تحديث الإعدادات";
      setError(errorMessage);
      console.error("Error updating settings:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateUser, updateUserSettings, loading, error };
}
