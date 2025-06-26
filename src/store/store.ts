import { configureStore } from "@reduxjs/toolkit";
import pomodoroReducer from "./features/settingsSlice";
import tasksReducer from "./features/tasksSlice";
const store = configureStore({
  reducer: {
    Settings: pomodoroReducer,
    Tasks: tasksReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
