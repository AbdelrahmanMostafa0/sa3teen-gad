import { configureStore } from "@reduxjs/toolkit";
import pomodoroReducer from "./features/pomodoroSlice";
const store = configureStore({
  reducer: {
    Pomodoro: pomodoroReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
