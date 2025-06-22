import { configureStore } from "@reduxjs/toolkit";
import pomodoroReducer from "./features/pomodoroSlice";
import tasksReducer from "./features/tasksSlice";
const store = configureStore({
  reducer: {
    Pomodoro: pomodoroReducer,
    Tasks: tasksReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
