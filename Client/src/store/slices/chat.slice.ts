import { getChatById } from "@/api/chat.api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface ThreadResponse {
  initialThreadId: string | null;
  message: [];
  loading: boolean;
  error: string | null;
}

const initialState: ThreadResponse = {
  initialThreadId: null,
  message: [],
  loading: false,
  error: null,
};

export const getMessagesByThreadId = createAsyncThunk(
  "thread/getMessagesByThreadId",
  async (threadId: number) => {
    const response = await getChatById(threadId);
    return response.data;
  }
);
const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMessagesByThreadId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMessagesByThreadId.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(getMessagesByThreadId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create initial thread";
      });
  },
});

export default chatSlice.reducer;
