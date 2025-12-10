import { ITask } from "@/types/tasks";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface AllTasksState {
  tasks: ITask[];
  loading: boolean;
  error: string | null;
  hasFetched: boolean;
}

const initialState: AllTasksState = {
  tasks: [],
  loading: false,
  error: null,
  hasFetched: false,
};

export const getAllTasks = createAsyncThunk(
  "allTasks/getAllTasks",
  async () => {
    try {
      const response = await axios.get("/api/tasks");
      return response.data?.tasks;
    } catch (err) {
      throw err;
    }
  }
);
export const postTask = createAsyncThunk(
  "allTasks/postTask",
  async (task: ITask) => {
    try {
      const response = await axios.post("/api/tasks", task);
      return response.data.task;
    } catch (err) {
      throw err;
    }
  }
);

const allTasksSlice = createSlice({
  name: "allTasks",
  initialState,
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllTasks.pending, (state) => {
        state.loading = true;
        state.hasFetched = false;
      })
      .addCase(getAllTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
        state.hasFetched = true;
      })
      .addCase(getAllTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? null;
        state.hasFetched = false;
      })
      .addCase(postTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(postTask.fulfilled, (state, action) => {
        const filteredTasks = state.tasks.filter((task) => !!task.id);
        state.loading = false;
        state.tasks.push(...filteredTasks, action.payload);
      })
      .addCase(postTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? null;
      });
  },
});

export const { setTasks, setLoading, setError } = allTasksSlice.actions;
export default allTasksSlice.reducer;
