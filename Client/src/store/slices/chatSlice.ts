import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { IChat } from "../../models/chat";
import { getUserSymptoms } from "../../api/chat.api";

const initialState: IChat = {
  sessionId: "",
  userSymptoms: "",
  user_info: "",
  followupQuestions: [],
  user_response: {},
  finalPrompt: "",
};

// Take user symptoms and start a chat session
export const startChat = createAsyncThunk(
  "chat/initialize",
  async ({
    sessionId,
    userSymptoms,
  }: {
    sessionId: string;
    userSymptoms: string;
  }) => {
    const response = await getUserSymptoms(sessionId, userSymptoms);
    console.log("Response from startChat:", response);
    return response;
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(startChat.pending, (state) => {
        console.log("Starting chat session...");
      })
      .addCase(startChat.fulfilled, (state, action) => {
        state.sessionId = action.payload.sessionId;
        state.userSymptoms = action.payload.userSymptoms;
      })
      .addCase(startChat.rejected, (state, action) => {
        console.error("Failed to start chat:", action.error.message);
      });
  },
});

export default chatSlice.reducer;
