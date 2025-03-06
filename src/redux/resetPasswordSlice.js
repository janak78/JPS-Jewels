import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import showToast from "../components/Toast/Toaster";
import AxiosInstance from "../Axiosinstance";

const baseUrl = process.env.REACT_APP_BASE_API;

// Async thunk to verify if the token is valid
export const checkTokenStatus = createAsyncThunk(
  "auth/checkTokenStatus",
  async (token, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.get(`${baseUrl}/resetpassword/check_token_status/${token}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data.message || "Token validation failed");
    }
  }
);
// Async thunk to reset the password
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.put(`${baseUrl}/resetpassword/reset_passwords/${token}`, {
        UserPassword: password,
      });

      if (response.status === 200) {
        showToast.success("Password updated successfully");
        return response.data;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      showToast.error(error.response?.data.message || "Something went wrong");
      return rejectWithValue(error.response?.data.message || "An error occurred");
    }
  }
);

const resetPasswordSlice = createSlice({
  name: "resetPassword",
  initialState: {
    loading: false,
    success: false,
    error: null,
    tokenExpired: false,
  },
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.tokenExpired = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkTokenStatus.fulfilled, (state, action) => {
        state.tokenExpired = action.payload.expired;
      })
      .addCase(checkTokenStatus.rejected, (state) => {
        state.tokenExpired = true;
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetState } = resetPasswordSlice.actions;
export default resetPasswordSlice.reducer;
