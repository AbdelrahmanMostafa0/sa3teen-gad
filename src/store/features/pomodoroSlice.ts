import { PomodoroInitialState } from "@/types/pomodora";
import { createSlice } from "@reduxjs/toolkit";

const initialState: PomodoroInitialState = {
  focusDurationTime: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  focusTimer: {
    minutes: 25,
    seconds: 0,
  },
  shortBreakTimer: {
    minutes: 5,
    seconds: 0,
  },
  longBreakTimer: {
    minutes: 15,
    seconds: 0,
  },
  isLongBreak: false,
  isFocusActive: false,
  isBreakActive: false,
  displayedTimer: "focus",
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
  },
});

export default pomodoroSlice.reducer;
export const {
  updateFocusDuration,
  updateShortBreakDuration,
  updateLongBreakDuration,
  updateDisplayedTimer,
} = pomodoroSlice.actions;
