import { TaskType } from "@/types/tasks";
import { createSlice } from "@reduxjs/toolkit";

interface InitialState {
  tasks: TaskType[]; // Replace 'any' with your specific task type
  currentTask: string | null; // Replace 'any' with your specific task type
  isLoading: boolean;
  error: string | null;
}
const initialState: InitialState = {
  tasks: [],
  currentTask: null,
  isLoading: false,
  error: null,
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },

    setCurrentTask: (state, action) => {
      state.currentTask = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setTasks, setCurrentTask, setLoading, setError } =
  tasksSlice.actions;
export default tasksSlice.reducer;
