import { createTask, getIncompleteTasks } from "@/services/tasksApis";
import { ITask } from "@/types/tasks";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface AllTasksState {
  tasks: ITask[];
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  range?: "today" | "week" | "month" | "all_time";
  hasFetched: boolean;
}

const initialState: AllTasksState = {
  tasks: [],
  loading: false,
  error: null,
  pagination: {
    total: 0,
    limit: 0,
    page: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  range: "all_time",
  hasFetched: false,
};

export const getAllTasks = createAsyncThunk(
  "allTasks/getAllTasks",
  getIncompleteTasks,
);
export const postTask = createAsyncThunk("allTasks/postTask", createTask);

export const updateTask = createAsyncThunk(
  "allTasks/updateTask",
  async ({ id, changes }: { id: string; changes: Partial<ITask> }) => {
    try {
      const response = await axios.patch(`/api/tasks/${id}`, changes);
      return response.data.task;
    } catch (err) {
      throw err;
    }
  },
);

export const deleteTask = createAsyncThunk(
  "allTasks/deleteTask",
  async (id: string) => {
    try {
      await axios.delete(`/api/tasks/${id}`);
      return id;
    } catch (err) {
      throw err;
    }
  },
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
    removeTask: (state, action: { payload: string }) => {
      state.tasks = state.tasks.filter(
        (task) =>
          task.id !== action.payload && (task as any)._id !== action.payload,
      );
    },
    resetAllTasks: (state) => {
      state.tasks = [];
      state.pagination = {
        total: 0,
        limit: 0,
        page: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      };
      state.range = "all_time";
      state.hasFetched = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllTasks.pending, (state) => {
        state.loading = true;
        // state.hasFetched = false;
      })
      .addCase(getAllTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.tasks;
        state.pagination = action.payload.pagination;
        state.range = action.payload.range;
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
        state.tasks.unshift(action.payload);
      })
      .addCase(postTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? null;
      })
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        // Update the task in the array
        const index = state.tasks.findIndex(
          (task) =>
            task.id === action.payload.id ||
            (task as any)._id === (action.payload.id || action.payload._id),
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? null;
      })
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the task from the array
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? null;
      });
  },
});

export const { setTasks, setLoading, setError, removeTask, resetAllTasks } =
  allTasksSlice.actions;
export default allTasksSlice.reducer;
