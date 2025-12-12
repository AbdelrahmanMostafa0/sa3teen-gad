import { IUser } from "@/types/user";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

interface UserState {
  user: IUser | null;
  loading: boolean;
  error: string | null;
  status: "idle" | "loading" | "success" | "failed";
  isAuthenticated: boolean;
  hasFetched: boolean; // Track if we've already attempted to fetch
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
  status: "idle",
  isAuthenticated: false,
  hasFetched: false,
};

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/auth/me");
      return response.data.user;
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.hasFetched = false; // Reset on logout
      Cookies.remove("token");
    },
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      state.hasFetched = true; // Mark as fetched
    },
    setStatus: (
      state,
      action: PayloadAction<"idle" | "loading" | "success" | "failed">
    ) => {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
        state.hasFetched = true; // Mark as fetched
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = action.payload as string;
        state.hasFetched = true; // Mark as fetched even on error
      });
  },
});

export const { logout, setUser, setStatus } = userSlice.actions;
export default userSlice.reducer;
