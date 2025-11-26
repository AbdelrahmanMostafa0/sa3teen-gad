import { updateSettings } from "@/store/features/settingsSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  useEffect(() => {
    const settings = localStorage.getItem("settings");
    if (settings) {
      const parsed = JSON.parse(settings);
      dispatch(updateSettings({ ...INITIAL_SETTINGS, ...parsed }));
    }
  }, [dispatch]);

  return { settings };
};
export default useSyncLocalStorageToRedux;
