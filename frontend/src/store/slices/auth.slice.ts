import { sendOtp } from "@/api/auth.api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface AuthState {
  otp: string;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  otp: "",
  loading: false,
  error: null,
};

export const sendOtpToLogin = createAsyncThunk(
  "auth/sendOtpToLogin",
  async (email: string) => {
    const response = await sendOtp(email);
    return response;
  }
);
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(sendOtpToLogin.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(sendOtpToLogin.fulfilled, (state) => {
      state.loading = false;
      state.error = null;
    });
    builder.addCase(sendOtpToLogin.rejected, (state, action) => {
      state.loading = false;
      state.error = action?.error?.message || "Failed to send OTP.";
    });
  },
});
export default authSlice.reducer;
