import { configureStore } from "@reduxjs/toolkit";
import settingsReducer from "./features/settingsSlice";
import tasksReducer from "./features/tasksSlice";
import prayerReducer from "./features/prayerSlice";
import userReducer from "./features/userSlice";

const store = configureStore({
  reducer: {
    Settings: settingsReducer,
    Tasks: tasksReducer,
    Prayers: prayerReducer,
    User: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
