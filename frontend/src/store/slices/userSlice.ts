import { getUserCurrentThreadId } from "@/api/users.api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface ThreadResponse {
  userCurrentThreadId: string;
  loading: boolean;
  error: string | null;
}

const initialState: ThreadResponse = {
  userCurrentThreadId: "",
  loading: false,
  error: null,
};

export const getUsersInitialThreadId = createAsyncThunk(
  "chat/getFirstThread",
  async () => {
    const response = await getUserCurrentThreadId();
    return response.data;
  }
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUsersInitialThreadId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsersInitialThreadId.fulfilled, (state, action) => {
        state.loading = false;
        state.userCurrentThreadId = action.payload.data.inserted_id;
      })
      .addCase(getUsersInitialThreadId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create initial thread";
      });
  },
});

export default userSlice.reducer;
