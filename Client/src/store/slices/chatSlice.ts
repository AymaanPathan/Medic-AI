import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { IChat } from "../../models/chat";
import {
  generateFinalPrompt,
  generateFollowUp,
  getFinalDiagnosis,
  getUserPersonalInfo,
  getUserSymptoms,
  submitFollowupAnswers,
} from "../../api/chat.api";

const initialState: IChat = {
  sessionId: "",
  userSymptoms: "",
  user_info: "",
  followupQuestions: [],
  user_response: {},
  finalPrompt: "",
  diagnosis: "",
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

// 4. Submit answers to follow-up questions
export const submitFollowupAnswersThunk = createAsyncThunk(
  "chat/submitFollowupAnswers",
  async ({
    sessionId,
    user_response,
  }: {
    sessionId: string;
    user_response: Record<string, string>;
  }) => {
    const response = await submitFollowupAnswers(sessionId, user_response);
    console.log("Response from submitFollowupAnswers:", response);
    return { user_response, formatted_response: response.formatted_response };
  }
);

export const generateFinalPromptThunk = createAsyncThunk(
  "chat/generateFinalPrompt",
  async ({
    sessionId,
    userSymptoms,
    user_info,
    formatted_response,
  }: {
    sessionId: string;
    userSymptoms: string;
    user_info: string;
    formatted_response: Record<string, string>;
  }) => {
    const response = await generateFinalPrompt(
      sessionId,
      userSymptoms,
      user_info,
      formatted_response
    );
    return response;
  }
);
export const generateLLMAnswer = createAsyncThunk(
  "chat/generateLLMAnswer",
  async ({
    session_id,
    finalPrompt,
  }: {
    session_id: string;
    finalPrompt: string;
  }) => {
    const response = await getFinalDiagnosis(session_id, finalPrompt);
    console.log("Response from generateFinalPrompt:", response);
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
        state.followupQuestions = action.payload.followupQuestions;
      })
      .addCase(generatefollowUpQuestion.rejected, (state, action) => {
        console.error(
          "Failed to generate follow-up questions:",
          action.error.message
        );
      })
      .addCase(submitFollowupAnswersThunk.fulfilled, (state, action) => {
        state.user_response = action.payload.user_response;
        // Store formatted response in state temporarily (for prompt generation)
        state.finalPrompt = action.payload.formatted_response;
      })
      .addCase(generateFinalPromptThunk.fulfilled, (state, action) => {
        console.log("action.payload:", action.payload);
        console.log("action.payload.prompt:", action.payload.final_prompt);
        state.finalPrompt = action.payload.final_prompt;
      })
      .addCase(generateLLMAnswer.fulfilled, (state, action) => {
        state.diagnosis = action.payload;
      });
  },
});

export default chatSlice.reducer;
