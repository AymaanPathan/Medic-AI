import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { IChat } from "../../models/chat";
import {
  generateFollowUp,
  getUserPersonalInfo,
  getUserSymptoms,
} from "../../api/chat.api";

const initialState: IChat = {
  sessionId: "",
  userSymptoms: "",
  user_info: "",
  followupQuestions: [],
  user_response: {},
  finalPrompt: "",
};

// 1 Take user symptoms and start a chat session
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

// 2 Take user personal info and continue the chat session
export const getPersonalInfo = createAsyncThunk(
  "chat/getPersonalInfo",
  async ({
    sessionId,
    user_info,
  }: {
    sessionId: string;
    user_info: string;
  }) => {
    const response = await getUserPersonalInfo(sessionId, user_info);
    console.log("Response from userInfo:", response);
    return response;
  }
);
// 3 Generate follow-up questions based on user info and symptoms
export const generatefollowUpQuestion = createAsyncThunk(
  "chat/generateFollowUp",
  async ({
    sessionId,
    user_info,
    userSymptoms,
  }: {
    sessionId: string;
    user_info: string;
    userSymptoms: string;
  }) => {
    const response = await generateFollowUp(sessionId, user_info, userSymptoms);
    console.log("Response from generateFollowUp:", response);
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
      })
      .addCase(getPersonalInfo.pending, (state) => {
        console.log("Fetching personal info...");
      })
      .addCase(getPersonalInfo.fulfilled, (state, action) => {
        state.user_info = action.payload.user_info;
      })
      .addCase(getPersonalInfo.rejected, (state, action) => {
        console.error("Failed to get personal info:", action.error.message);
      })
      .addCase(generatefollowUpQuestion.pending, (state) => {
        console.log("Generating follow-up questions...");
      })
      .addCase(generatefollowUpQuestion.fulfilled, (state, action) => {
        state.user_info = state.user_info || action.payload.user_info;
        state.userSymptoms = action.payload.userSymptoms;
      })
      .addCase(generatefollowUpQuestion.rejected, (state, action) => {
        console.error(
          "Failed to generate follow-up questions:",
          action.error.message
        );
      });
  },
});

export default chatSlice.reducer;
