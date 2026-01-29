import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PomodoroType } from "@/types/pomodoro";

interface PomodoroState {
  id: string | null;
  isRunning: boolean;
  isPaused: boolean;
  type: PomodoroType | null;
  duration: number; // Initial duration in minutes
}

const initialState: PomodoroState = {
  id: null,
  isRunning: false,
  isPaused: false,
  type: null,
  duration: 0,
};

const pomodoroSlice = createSlice({
  name: "pomodoro",
  initialState,
  reducers: {
    // Call this after the createPomodoroSession API succeeds
    setPomodoroSession: (
      state,
      action: PayloadAction<{
        id?: string;
        type: PomodoroType;
        duration: number;
      }>,
    ) => {
      state.id = action.payload.id || null;
      state.type = action.payload.type;
      state.duration = action.payload.duration;
      state.isRunning = true;
      state.isPaused = false;
    },
    pausePomodoro: (state) => {
      state.isPaused = true;
    },
    resumePomodoro: (state) => {
      state.isPaused = false;
    },

    stopPomodoro: (state) => {
      state.isRunning = false;
      state.isPaused = false;
    },
    resetPomodoroSession: (state) => {
      state.id = null;
      state.isRunning = false;
      state.isPaused = false;
      state.type = null;
      state.duration = 0;
    },
  },
});

export const {
  setPomodoroSession,
  pausePomodoro,
  resumePomodoro,
  stopPomodoro,
  resetPomodoroSession,
} = pomodoroSlice.actions;

export default pomodoroSlice.reducer;
