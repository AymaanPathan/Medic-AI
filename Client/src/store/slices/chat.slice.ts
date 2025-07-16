import { getChatById, getMessageByThreadIdForSideBar } from "@/api/chat.api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface Message {
  message?: string;
  id: number;
  sender: "User" | "A.I";
  text: string;
  time_stamp: string | Date;
}

interface ChatResponse {
  initialThreadId: string | null;
  message: Message[];
  loading: boolean;
  sidebarMessage: Message[];
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
  "chat/getFirstUserMessages",
  async () => {
    const response = await getMessageByThreadIdForSideBar();
    return response.data;
  }
);
const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    clearChat: (state) => {
      state.message = [];
      state.loading = false;
      state.error = null;
    },
    appendAiChunk: (state, action) => {
      const lastIndex = state.message.length - 1;
      if (state.message[lastIndex]?.sender === "A.I") {
        state.message[lastIndex].text += action.payload;
      } else {
        state.message.push({
          id: Date.now(),
          sender: "A.I",
          text: action.payload,
          time_stamp: new Date().toISOString(),
        });
      }
    },
    addUserMessage: (state, action) => {
      state.message.push({
        id: Date.now(),
        sender: "User",
        text: action.payload,
        time_stamp: new Date().toISOString(),
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMessagesByThreadId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMessagesByThreadId.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.map((msg: Message, index: number) => ({
          id: index + 1,
          sender: msg.sender as "User" | "A.I", // ✅ use as-is
          text: msg.message,
          timestamp: msg.time_stamp,
        }));
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
export const { appendAiChunk, addUserMessage, clearChat } = chatSlice.actions;
export default chatSlice.reducer;
