import { PomodoroInitialState } from "@/types/pomodora";
import { createSlice } from "@reduxjs/toolkit";

const initialState: PomodoroInitialState = {
  focusDurationTime: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  displayedTimer: "focus",
  autoBreakStart: false,
  autoSwitch: false,
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
} = pomodoroSlice.actions;
