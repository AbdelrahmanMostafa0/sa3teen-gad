import { PomodoroInitialState } from "@/types/pomodora";
import { createSlice } from "@reduxjs/toolkit";

const initialState: PomodoroInitialState = {
  focusDurationTime: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  displayedTimer: "focus",
  autoBreakStart: false,
  autoSwitch: false,
  isWaterReminderOn: false,
  waterReminderInterval: 20,
};

const pomodoroSlice = createSlice({
  name: "pomodoro",
  initialState,
  reducers: {
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
    updateWaterReminder: (state, action) => {
      state.isWaterReminderOn = action.payload;
    },
    updateWaterReminderInterval: (state, action) => {
      state.waterReminderInterval = action.payload;
    },
  },
});

export default pomodoroSlice.reducer;
export const {
  updateFocusDuration,
  updateShortBreakDuration,
  updateLongBreakDuration,
  updateDisplayedTimer,
  updateAutoBreakStart,
  updateAutoSwitch,
  updateWaterReminderInterval,
  updateWaterReminder,
} = pomodoroSlice.actions;
