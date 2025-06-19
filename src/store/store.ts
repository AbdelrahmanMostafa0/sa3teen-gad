import { configureStore } from "@reduxjs/toolkit";
import pomodoroReducer from "./features/pomodoroSlice";
const store = configureStore({
  reducer: {
    Pomodoro: pomodoroReducer,
  },
});

export default store;
