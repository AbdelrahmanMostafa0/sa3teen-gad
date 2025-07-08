import { PrayerTimesType } from "./../../types/prayers";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  prayerTimes: null as PrayerTimesType | null,
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
