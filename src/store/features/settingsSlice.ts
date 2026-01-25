import { getMySettings } from "@/services/profile";
import { SettingsType, defaultSettings, PrayerName } from "@/types/user";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState: SettingsType = defaultSettings;
export const getSettings = createAsyncThunk(
  "settings/getSettings",
  async () => {
    const response = await getMySettings();
    const data = await response;
    return data;
  },
);
const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    updateSettings: (state, action) => {
      return { ...state, ...action.payload };
    },
    // Timer reducers
    updateFocusDuration: (state, action) => {
      state.timers.focusDurationTime = action.payload;
    },
    updateShortBreakDuration: (state, action) => {
      state.timers.shortBreakDuration = action.payload;
    },
    updateLongBreakDuration: (state, action) => {
      state.timers.longBreakDuration = action.payload;
    },
    // Water reminder reducers
    updateWaterReminder: (state, action) => {
      state.waterReminder.enabled = action.payload;
    },
    updateWaterReminderInterval: (state, action) => {
      state.waterReminder.interval = action.payload;
    },
    // Prayer reminder reducers
    toggleGlobalPrayerReminder: (state, action) => {
      state.prayerReminder.enabled = action.payload;
    },
    updatePreReminderMinutes: (state, action) => {
      state.prayerReminder.preReminderMinutes = action.payload;
    },
    togglePreReminder: (state, action) => {
      state.prayerReminder.preReminderEnabled = action.payload;
    },
    toggleAtTimeReminder: (state, action) => {
      state.prayerReminder.atTimeReminderEnabled = action.payload;
    },
    toggleIndividualPrayerPreReminder: (
      state,
      action: { payload: { prayer: PrayerName; enabled: boolean } },
    ) => {
      const { prayer, enabled } = action.payload;
      state.prayerReminder.perPrayer[prayer].pre = enabled;
    },
    toggleIndividualPrayerAtTimeReminder: (
      state,
      action: { payload: { prayer: PrayerName; enabled: boolean } },
    ) => {
      const { prayer, enabled } = action.payload;
      state.prayerReminder.perPrayer[prayer].atTime = enabled;
    },
    // Location reducers
    updateLocation: (
      state,
      action: { payload: { country: string; city: string } },
    ) => {
      state.location = action.payload;
    },
    // UI reducers
    updatePrayerTimesPosition: (state, action) => {
      state.ui.prayerTimesPosition = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getSettings.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export default settingsSlice.reducer;
export const {
  updateFocusDuration,
  updateShortBreakDuration,
  updateLongBreakDuration,
  updateWaterReminderInterval,
  updateWaterReminder,
  updateSettings,
  updatePreReminderMinutes,
  toggleGlobalPrayerReminder,
  togglePreReminder,
  toggleAtTimeReminder,
  toggleIndividualPrayerPreReminder,
  toggleIndividualPrayerAtTimeReminder,
  updatePrayerTimesPosition,
  updateLocation,
} = settingsSlice.actions;
