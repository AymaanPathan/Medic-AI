import axiosSetup from "@/utils/axiosSetup";

export const createInitialThread = async () => {
  const response = await axiosSetup.post("/threads/saveInitialThread");
  return response;
};
