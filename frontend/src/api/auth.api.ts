import axiosSetup from "../utils/axiosSetup";

export const sendOtp = async (email: string): Promise<void> => {
  const response = await axiosSetup.post("/auth/send-otp", { email });
  return response.data;
};
