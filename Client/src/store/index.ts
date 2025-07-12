import { configureStore } from "@reduxjs/toolkit";
import chatSlice from "./slices/diagnosis.slice";
import threadSlice from "./slices/thread.slice";
import diagnosisSlice from "./slices/diagnosis.slice";
export const store = configureStore({
  reducer: {
    chat: chatSlice,
    thread: threadSlice,
    diagnosis: diagnosisSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type RootDispatch = typeof store.dispatch;
