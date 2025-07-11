import axiosSetup from "@/utils/axiosSetup";

export const createInitialThread = async () => {
  const response = await axiosSetup.post("/threads/saveInitialThread");
  return response;
};

export const getInitialState = async () => {
  const response = await axiosSetup.get("/threads/getInitalThread");
  return response;
};
