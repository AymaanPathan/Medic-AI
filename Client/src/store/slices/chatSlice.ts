import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { IChat } from "../../models/chat";
import {
  analyzeVoiceAndImage,
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
  audioUrl: "",
  loading: false,
  error: null,
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
    return response;
  }
);
// 3 Generate follow-up questions based on user info and symptoms
export const generatefollowUpQuestion = createAsyncThunk(
  "chat/generateFollowUp",
  async ({
    sessionId,
    userSymptoms,
  }: {
    sessionId: string;
    userSymptoms: string;
  }) => {
    const response = await generateFollowUp(sessionId, userSymptoms);
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
    return { user_response, formatted_response: response.formatted_response };
  }
);

export const generateFinalPromptThunk = createAsyncThunk(
  "chat/generateFinalPrompt",
  async ({
    sessionId,
    userSymptoms,
    formatted_response,
  }: {
    sessionId: string;
    userSymptoms: string;
    formatted_response: Record<string, string>;
  }) => {
    const response = await generateFinalPrompt(
      sessionId,
      userSymptoms,

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
    return response;
  }
);

export const analyzeImageAndVoiceThunk = createAsyncThunk(
  "chat/analyzeImageAndVoice",
  async (
    {
      imageFile,
      audioFile,
    }: {
      imageFile: File;
      audioFile: File;
    },
    { rejectWithValue }
  ) => {
    try {
      const result = await analyzeVoiceAndImage(imageFile, audioFile);
      return result;
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(startChat.pending, (state) => {
        state.loading = true;
        console.log("Starting chat session...");
      })
      .addCase(startChat.fulfilled, (state, action) => {
        state.sessionId = action.payload.sessionId;
        state.userSymptoms = action.payload.userSymptoms;
      })
      .addCase(startChat.rejected, (state, action) => {
        state.loading = false;
        console.error("Failed to start chat:", action.error.message);
      })
      .addCase(getPersonalInfo.pending, (state) => {
        state.loading = true;
        console.log("Fetching personal info...");
      })
      .addCase(getPersonalInfo.fulfilled, (state, action) => {
        state.user_info = action.payload.user_info;
      })
      .addCase(getPersonalInfo.rejected, (state, action) => {
        state.loading = false;
        console.error("Failed to get personal info:", action.error.message);
      })
      .addCase(generatefollowUpQuestion.pending, (state) => {
        state.loading = true;
        console.log("Generating follow-up questions...");
      })
      .addCase(generatefollowUpQuestion.fulfilled, (state, action) => {
        state.followupQuestions = action.payload.followupQuestions;
      })
      .addCase(generatefollowUpQuestion.rejected, (state, action) => {
        state.loading = false;
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
        state.finalPrompt = action.payload.final_prompt;
      })
      .addCase(generateLLMAnswer.fulfilled, (state, action) => {
        state.diagnosis = action.payload;
      })
      .addCase(analyzeImageAndVoiceThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(analyzeImageAndVoiceThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.diagnosis = action.payload.diagnosis;
      })
      .addCase(analyzeImageAndVoiceThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default chatSlice.reducer;
