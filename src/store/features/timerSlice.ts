import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TimerState {
  activeTab: "focus" | "shortBreak" | "longBreak";
}

const initialState: TimerState = {
  activeTab: "focus",
};

const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {
    setActiveTab: (
      state,
      action: PayloadAction<"focus" | "shortBreak" | "longBreak">
    ) => {
      state.activeTab = action.payload;
    },
  },
});

export const { setActiveTab } = timerSlice.actions;
export default timerSlice.reducer;
