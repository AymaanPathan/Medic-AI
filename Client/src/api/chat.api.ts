import axiosSetup from "../utils/axiosSetup";

// 1 get user symptoms
export const getUserSymptoms = async (
  sessionId: string,
  userSymptoms: string
) => {
  try {
    const response = await axiosSetup.post("/init", {
      session_id: sessionId,
      userSymptoms: userSymptoms,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user symptoms:", error);
    throw error;
  }
};

// 2 get personal info
export const getUserPersonalInfo = async (
  sessionId: string,
  user_info: string
) => {
  try {
    const response = await axiosSetup.post("/get_personal_info", {
      session_id: sessionId,
      user_info: user_info,
    });
    return response.data;
  } catch (error) {
    console.error("Error Getting User info:", error);
    throw error;
  }
};
// 3 generate follow up questions
export const generateFollowUp = async (
  sessionId: string,
  user_info: string,
  userSymptoms: string
) => {
  try {
    const response = await axiosSetup.post("/generate_followUp", {
      session_id: sessionId,
      user_info: user_info,
      userSymptoms: userSymptoms,
    });
    return response.data;
  } catch (error) {
    console.error("Error generate followUp:", error);
    throw error;
  }
};

// Get users  answers to follow-up questions
export const submitFollowupAnswers = async (
  sessionId: string,
  userResponses: Record<string, string>
) => {
  try {
    const response = await axiosSetup.post("/get_answers", {
      session_id: sessionId,
      user_response: userResponses,
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting follow-up answers:", error);
    throw error;
  }
};

// Generate final Prompt
export const generateFinalPrompt = async (
  sessionId: string,
  userSymptoms: string[], // ✅ should be an array
  user_info: string,
  formatted_response: string,
  followupQuestions: string[]
) => {
  try {
    const response = await axiosSetup.post("/generate_final_prompt", {
      session_id: sessionId,
      userSymptoms,
      user_info,
      formatted_response,
      followupQuestions,
    });
    return response.data;
  } catch (error) {
    console.error("Error generating final prompt:", error);
    throw error;
  }
};
