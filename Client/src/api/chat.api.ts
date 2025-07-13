import axiosSetup from "@/utils/axiosSetup";

export const getChatById = async (threadId: number) => {
  const response = await axiosSetup.get(
    `/chats/getChatByThreadId?threadId=${threadId}`
  );
  return response;
};

export const getMessageByThreadIdForSideBar = async () => {
  const response = await axiosSetup.get(`/chats/getFirstAiMessages`);
  return response;
};
