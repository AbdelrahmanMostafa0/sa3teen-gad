import { configureStore } from "@reduxjs/toolkit";
import settingsReducer from "./features/settingsSlice";
import tasksReducer from "./features/tasksSlice";
import prayerReducer from "./features/prayerSlice";
import userReducer from "./features/userSlice";
import allTasksReducer from "./features/allTasksSlice";
import timerReducer from "./features/timerSlice";
import pomodoroReducer from "./features/pomodoroSlice";

const store = configureStore({
  reducer: {
    Settings: settingsReducer,
    Tasks: tasksReducer,
    Prayers: prayerReducer,
    User: userReducer,
    AllTasks: allTasksReducer,
    Timer: timerReducer,
    Pomodoro: pomodoroReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
