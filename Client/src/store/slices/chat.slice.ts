import { getChatById, getMessageByThreadIdForSideBar } from "@/api/chat.api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface ChatResponse {
  initialThreadId: string | null;
  message: [];
  loading: boolean;
  sidebarMessage: [];
  error: string | null;
}

const initialState: ChatResponse = {
  initialThreadId: null,
  message: [],
  loading: false,
  error: null,
  sidebarMessage: [],
};

export const getMessagesByThreadId = createAsyncThunk(
  "chat/getMessagesByThreadId",
  async (threadId: number) => {
    const response = await getChatById(threadId);
    return response.data;
  }
);

export const getMessageForSideBar = createAsyncThunk(
  "chat/getFirstAiMessages",
  async () => {
    const response = await getMessageByThreadIdForSideBar();
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
      })
      .addCase(getMessageForSideBar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMessageForSideBar.fulfilled, (state, action) => {
        state.loading = false;
        state.sidebarMessage = action.payload;
      })
      .addCase(getMessageForSideBar.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch sidebar messages";
      });
  },
});

export default chatSlice.reducer;
