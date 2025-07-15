import { getChatById, getMessageByThreadIdForSideBar } from "@/api/chat.api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface Message {
  id: number;
  sender: "ai" | "user";
  text: string;
  timestamp: Date;
}

interface ChatResponse {
  initialThreadId: string | null;
  message: Message[];
  loading: boolean;
  sidebarMessage: any[];
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
  reducers: {
    appendAiChunk: (state, action) => {
      const lastIndex = state.message.length - 1;
      if (state.message[lastIndex]?.sender === "ai") {
        state.message[lastIndex].text += action.payload;
      } else {
        state.message.push({
          id: Date.now(),
          sender: "ai",
          text: action.payload,
          timestamp: new Date(),
        });
      }
    },
    addUserMessage: (state, action) => {
      state.message.push({
        id: Date.now(),
        sender: "user",
        text: action.payload,
        timestamp: new Date(),
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
        state.message = action.payload.map((msg: any, index: number) => ({
          id: index + 1,
          sender: msg.sender.toLowerCase() === "a.i" ? "ai" : "user",
          text: msg.message,
          timestamp: new Date(msg.time_stamp),
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
export const { appendAiChunk, addUserMessage } = chatSlice.actions;
export default chatSlice.reducer;
