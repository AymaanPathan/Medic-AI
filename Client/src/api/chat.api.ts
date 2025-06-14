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
