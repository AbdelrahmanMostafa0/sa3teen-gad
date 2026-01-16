import { AppDispatch, RootState } from "@/store/store";
import { defaultSettings } from "@/types/user";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUser } from "./useUser";
import { updateSettings } from "@/store/features/settingsSlice";
const INITIAL_SETTINGS = {
  focusDurationTime: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  displayedTimer: "focus",
  autoBreakStart: false,
  autoSwitch: false,
  isWaterReminderOn: true,
  waterReminderInterval: 20,
  prayerReminderSettings: {
    isEnabled: true,
    preReminderMinutes: 10,
    preReminderEnabled: true,
    atTimeReminderEnabled: true,
    individualPrayers: {
      Fajr: { preReminderEnabled: true, atTimeReminderEnabled: true },
      Dhuhr: { preReminderEnabled: true, atTimeReminderEnabled: true },
      Asr: { preReminderEnabled: true, atTimeReminderEnabled: true },
      Maghrib: { preReminderEnabled: true, atTimeReminderEnabled: true },
      Isha: { preReminderEnabled: true, atTimeReminderEnabled: true },
    },
  },
  country: "EGY",
  city: "Cairo",
};
const useSyncLocalStorageToRedux = () => {
  const dispatch = useDispatch<AppDispatch>();
  const settings = useSelector((state: RootState) => state.Settings);
  const [isLoading, setIsLoading] = useState(true);
  const { status } = useUser();
  useEffect(() => {
    if (status === "failed") {
      const settings = localStorage.getItem("settings");
      if (settings) {
        const parsed = JSON.parse(settings);
        dispatch(updateSettings({ ...defaultSettings, ...parsed }));
      } else {
        localStorage.setItem("settings", JSON.stringify(defaultSettings));
        dispatch(updateSettings(defaultSettings));
      }
    }
    // Add a delay after sync completes to show the loading screen
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 1 second delay

    return () => clearTimeout(timer);
  }, [dispatch, status]);

  return { settings, isLoading };
};
export default useSyncLocalStorageToRedux;
