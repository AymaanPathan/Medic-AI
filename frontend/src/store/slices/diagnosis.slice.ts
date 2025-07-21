import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { IDiagnosisResponse } from "../../models/chat";
import {
  analyzeVoiceAndImage,
  generateFinalPrompt,
  generateFollowUp,
  getFinalDiagnosis,
  getUserPersonalInfo,
  getUserSymptoms,
  submitFollowupAnswers,
} from "../../api/diagnosis.api";

const initialState: IDiagnosisResponse = {
  sessionId: "",
  userSymptoms: "",
  user_info: "",
  followupQuestions: [],
  user_response: {},
  finalPrompt: "",
  diagnosis: {
    diseaseName: "",
    diseaseSummary: "",
    whyYouHaveThis: "",
    whatToDoFirst: "",
    dangerSigns: [],
    lifestyleChanges: [],
    medicines: [],
  },
  audioUrl: "",
  loading: false,
  error: null,
};

// 1 Take user symptoms and start a diagnosis session
export const startdiagnosis = createAsyncThunk(
  "diagnosis/initialize",
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

// 2 Take user personal info and continue the diagnosis session
export const getPersonalInfo = createAsyncThunk(
  "diagnosis/getPersonalInfo",
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
  "diagnosis/generateFollowUp",
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
  "diagnosis/submitFollowupAnswers",
  async ({
    sessionId,
    userSymptoms,
    user_response,
  }: {
    sessionId: string;
    userSymptoms: string;
    user_response: Record<string, string>;
  }) => {
    const response = await submitFollowupAnswers(
      sessionId,
      userSymptoms,
      user_response
    );
    return { user_response, formatted_response: response.formatted_response };
  }
);

export const generateFinalPromptThunk = createAsyncThunk(
  "diagnosis/generateFinalPrompt",
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
  "diagnosis/generateLLMAnswer",
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
  "diagnosis/analyzeImageAndVoice",
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

const diagnosisSlice = createSlice({
  name: "diagnosis",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(startdiagnosis.pending, (state) => {
        state.loading = true;
      })
      .addCase(startdiagnosis.fulfilled, (state, action) => {
        state.sessionId = action.payload.sessionId;
        state.userSymptoms = action.payload.userSymptoms;
      })
      .addCase(startdiagnosis.rejected, (state, action) => {
        state.loading = false;
        console.error("Failed to start diagnosis:", action.error.message);
      })
      .addCase(getPersonalInfo.pending, (state) => {
        state.loading = true;
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
        console.log("Formatted response:", action.payload);
      })
      .addCase(generateFinalPromptThunk.fulfilled, (state, action) => {
        console.log("Final prompt generated:", action.payload?.final_prompt);
        state.finalPrompt = action.payload?.final_prompt;
      })
      .addCase(generateLLMAnswer.fulfilled, (state, action) => {
        console.log("llm answer ", action.payload);
        state.diagnosis = {
          diseaseName: action.payload?.diseaseName || "",
          diseaseSummary: action.payload?.diseaseSummary || "",
          whyYouHaveThis: action.payload?.whyYouHaveThis || "",
          whatToDoFirst: action.payload?.whatToDoFirst || "",
          dangerSigns: action.payload?.dangerSigns || [],
          lifestyleChanges: action.payload?.lifestyleChanges || [],
          medicines: action.payload?.medicines || [],
        };
      })

      .addCase(analyzeImageAndVoiceThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(analyzeImageAndVoiceThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.audioUrl = action.payload?.audio_url || "";
      })
      .addCase(analyzeImageAndVoiceThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default diagnosisSlice.reducer;
