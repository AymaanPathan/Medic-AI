import axiosSetup from "@/utils/axiosSetup";

export const getUserCurrentThreadId = async () => {
  const response = await axiosSetup.get("/users/getCurrentThreadId");
  return response;
};
