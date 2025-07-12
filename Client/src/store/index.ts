import { configureStore } from "@reduxjs/toolkit";
import chatSlice from "./slices/diagnosis.slice";
import threadSlice from "./slices/thread.slice";
export const store = configureStore({
  reducer: {
    chat: chatSlice,
    thread: threadSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type RootDispatch = typeof store.dispatch;
