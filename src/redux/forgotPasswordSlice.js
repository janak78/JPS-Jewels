import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import showToast from "../components/Toast/Toaster";
import AxiosInstance from "../Axiosinstance";

const baseUrl = process.env.REACT_APP_BASE_API;

// Async thunk for sending reset password email
export const sendResetPasswordEmail = createAsyncThunk(
  "auth/sendResetPasswordEmail",
  async (email, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.post(
        `${baseUrl}/resetpassword/resetpasswordmail`,
        { PrimaryEmail: email }
      );

      if (response.data.statusCode === 200) {
        showToast.success("Password reset email sent successfully");
        return response.data;
      } else {
        showToast.warning(response.data.message);
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      showToast.error(error.response?.data.message || "Something went wrong");
      return rejectWithValue(error.response?.data.message || "An error occurred");
    }
  }
);

const forgotPasswordSlice = createSlice({
  name: "resetPassword",
  initialState: {
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendResetPasswordEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(sendResetPasswordEmail.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(sendResetPasswordEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetState } = forgotPasswordSlice.actions;
export default forgotPasswordSlice.reducer;
