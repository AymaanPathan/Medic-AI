// thread.slice.ts
import { createInitialThread } from "@/api/thread.api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface ThreadState {
  initialThreadId: string | null;
  currentUserThreadId: number | null;
  loading: boolean;
  error: string | null;
}

const initialState: ThreadState = {
  initialThreadId: null,
  currentUserThreadId: null,
  loading: false,
  error: null,
};

export const storeInitalThread = createAsyncThunk("thread/store", async () => {
  const response = await createInitialThread();
  return response.data;
});

const threadSlice = createSlice({
  name: "thread",
  initialState,
  reducers: {
    setCurrentUserThreadId: (state, action) => {
      state.currentUserThreadId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(storeInitalThread.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(storeInitalThread.fulfilled, (state, action) => {
        state.loading = false;
        state.initialThreadId = action.payload.inserted_id;
      })
      .addCase(storeInitalThread.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create initial thread";
      });
  },
});

export const { setCurrentUserThreadId } = threadSlice.actions;
export default threadSlice.reducer;
