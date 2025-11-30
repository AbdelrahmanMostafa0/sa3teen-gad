import { SettingsType } from "@/types/settings";
import { createSlice } from "@reduxjs/toolkit";

const initialState: SettingsType = {
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
  prayerTimesPosition: "top",
};

const settingsSlice = createSlice({
  name: "pomodoro",
  initialState,
  reducers: {
    updateSettings: (state, action) => {
      Object.assign(state, action.payload);
    },
    updateFocusDuration: (state, action) => {
      state.focusDurationTime = action.payload;
    },
    updateShortBreakDuration: (state, action) => {
      state.shortBreakDuration = action.payload;
    },
    updateLongBreakDuration: (state, action) => {
      state.longBreakDuration = action.payload;
    },
    updateDisplayedTimer: (state, action) => {
      state.displayedTimer = action.payload;
    },
    updateAutoBreakStart: (state, action) => {
      state.autoBreakStart = action.payload;
    },
    updateAutoSwitch: (state, action) => {
      state.autoSwitch = action.payload;
    },
    updatePrayerReminderSettings: (state, action) => {
      state.prayerReminderSettings = action.payload;
    },
    updatePreReminderMinutes: (state, action) => {
      state.prayerReminderSettings.preReminderMinutes = action.payload;
    },
    toggleGlobalPrayerReminder: (state, action) => {
      state.prayerReminderSettings.isEnabled = action.payload;
    },
    togglePreReminder: (state, action) => {
      state.prayerReminderSettings.preReminderEnabled = action.payload;
    },
    toggleAtTimeReminder: (state, action) => {
      state.prayerReminderSettings.atTimeReminderEnabled = action.payload;
    },
    toggleIndividualPrayerPreReminder: (state, action: { payload: { prayer: string; enabled: boolean } }) => {
      const { prayer, enabled } = action.payload;
      if (state.prayerReminderSettings.individualPrayers[prayer as keyof typeof state.prayerReminderSettings.individualPrayers]) {
        state.prayerReminderSettings.individualPrayers[prayer as keyof typeof state.prayerReminderSettings.individualPrayers].preReminderEnabled = enabled;
      }
    },
    toggleIndividualPrayerAtTimeReminder: (state, action: { payload: { prayer: string; enabled: boolean } }) => {
      const { prayer, enabled } = action.payload;
      if (state.prayerReminderSettings.individualPrayers[prayer as keyof typeof state.prayerReminderSettings.individualPrayers]) {
        state.prayerReminderSettings.individualPrayers[prayer as keyof typeof state.prayerReminderSettings.individualPrayers].atTimeReminderEnabled = enabled;
      }
    },
    updateWaterReminder: (state, action) => {
      state.isWaterReminderOn = action.payload;
    },
    updateWaterReminderInterval: (state, action) => {
      state.waterReminderInterval = action.payload;
    },
    updatePrayerTimesPosition: (state, action) => {
      state.prayerTimesPosition = action.payload;
    },
  },
});

export default settingsSlice.reducer;
export const {
  updateFocusDuration,
  updateShortBreakDuration,
  updateLongBreakDuration,
  updateDisplayedTimer,
  updateAutoBreakStart,
  updateAutoSwitch,
  updateWaterReminderInterval,
  updateWaterReminder,
  updateSettings,
  updatePrayerReminderSettings,
  updatePreReminderMinutes,
  toggleGlobalPrayerReminder,
  togglePreReminder,
  toggleAtTimeReminder,
  toggleIndividualPrayerPreReminder,
  toggleIndividualPrayerAtTimeReminder,
  updatePrayerTimesPosition,
} = settingsSlice.actions;
