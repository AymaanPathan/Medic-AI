import { configureStore } from "@reduxjs/toolkit";
import chatSlice from "./slices/chatSlice";
import threadSlice from "./slices/threadSlice";
export const store = configureStore({
  reducer: {
    chat: chatSlice,
    thread: threadSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type RootDispatch = typeof store.dispatch;
