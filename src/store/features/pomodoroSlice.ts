import { PomodoroInitialState } from "@/types/pomodora";
import { createSlice } from "@reduxjs/toolkit";

const initialState: PomodoroInitialState = {
  focusDurationTime: 25,
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
  shortBreakDuration: 5,
  longBreakDuration: 15,
  isLongBreak: false,
  isFocusActive: false,
  isBreakActive: false,
  displayedTimer: "focus",
};

const pomodoroSlice = createSlice({
  name: "pomodoro",
  initialState,
  reducers: {
    updateDurationTime: (state, action) => {
      state.focusDurationTime = action.payload;
    },
    updateShortBreakDurtion: (state, action) => {
      state.focusDurationTime = action.payload;
    },
    updateFocusTimer: (state, action) => {
      state.focusTimer.minutes = action.payload.minutes;
      state.focusTimer.seconds = action.payload.seconds;
    },
    updateShortBreakTimer: (state, action) => {
      state.shortBreakTimer.minutes = action.payload.minutes;
      state.shortBreakTimer.seconds = action.payload.seconds;
    },
    updateLongBreakTimer: (state, action) => {
      state.longBreakTimer.minutes = action.payload.minutes;
      state.longBreakTimer.seconds = action.payload.seconds;
    },
  },
});

export default pomodoroSlice.reducer;
export const {
  updateFocusTimer,
  updateShortBreakTimer,
  updateLongBreakTimer,
  updateDurationTime,
  updateShortBreakDurtion,
} = pomodoroSlice.actions;
