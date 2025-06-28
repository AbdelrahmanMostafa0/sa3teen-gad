import { configureStore } from "@reduxjs/toolkit";
import settingsReducer from "./features/settingsSlice";
import tasksReducer from "./features/tasksSlice";
const store = configureStore({
  reducer: {
    Settings: settingsReducer,
    Tasks: tasksReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
