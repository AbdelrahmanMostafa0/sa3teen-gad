import { PrayerTimesType } from "./../../types/prayers";
import { createSlice } from "@reduxjs/toolkit";
type PrayerTime = {
  name: "Fajr" | "Sunrise" | "Dhuhr" | "Asr" | "Maghrib" | "Isha";
  time: string; // formatted Arabic time (12h)
  time24: string; // original 24h time from API (HH:mm)
};
const initialState = {
  prayerTimes: [] as PrayerTime[] | [],
  isLoading: false,
  error: null,
};

const prayerSlice = createSlice({
  name: "prayer",
  initialState,
  reducers: {
    setPrayerTimesStore(state, action) {
      state.prayerTimes = action.payload;
    },
  },
});

export const { setPrayerTimesStore } = prayerSlice.actions;
export default prayerSlice.reducer;
