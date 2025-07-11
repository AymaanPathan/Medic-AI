import { createInitialThread, getInitialState } from "@/api/thread.api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface ThreadResponse {
  initialThreadId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: ThreadResponse = {
  initialThreadId: null,
  loading: false,
  error: null,
};

export const storeInitalThread = createAsyncThunk(
  "chat/startChat",
  async () => {
    const response = await createInitialThread();
    return response;
  }
);
export const getFirstThread = createAsyncThunk(
  "chat/getFirstThread",
  async () => {
    const response = await getInitialState();
    return response.data;
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(storeInitalThread.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(storeInitalThread.fulfilled, (state, action) => {
        state.loading = false;
        state.initialThreadId = action.payload.data.inserted_id;
      })
      .addCase(storeInitalThread.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create initial thread";
      })
      .addCase(getFirstThread.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFirstThread.fulfilled, (state, action) => {
        state.loading = false;
        state.initialThreadId = action.payload.data || null;
      })
      .addCase(getFirstThread.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch initial thread";
      });
  },
});

export default chatSlice.reducer;
