import { configureStore } from "@reduxjs/toolkit";
import ChatSlice from "./slices/chat.slice";
import threadSlice from "./slices/thread.slice";
import diagnosisSlice from "./slices/diagnosis.slice";
export const store = configureStore({
  reducer: {
    chat: ChatSlice,
    thread: threadSlice,
    diagnosis: diagnosisSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type RootDispatch = typeof store.dispatch;
