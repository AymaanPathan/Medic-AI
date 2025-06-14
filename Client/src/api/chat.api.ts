import axiosSetup from "../utils/axiosSetup";

export const getUserSymptoms = async (
  sessionId: string,
  userSymptoms: string
) => {
  try {
    const response = await axiosSetup.post("/init", {
      sessionid: sessionId,
      userSymptoms: userSymptoms,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user symptoms:", error);
    throw error;
  }
};
