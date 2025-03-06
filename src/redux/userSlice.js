import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../Axiosinstance";
import showToast from "../components/Toast/Toaster";

const baseUrl = process.env.REACT_APP_BASE_API;

// Async thunk to fetch user data
export const fetchUserData = createAsyncThunk(
  "user/fetchUserData",
  async (UserId, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.get(
        `${baseUrl}/user/userdata?UserId=${UserId}`
      );

      if (response.data.statusCode === 200) {
        return response.data.data;
      } else {
        showToast.warning("User data not found");
        return rejectWithValue("User data not found");
      }
    } catch (error) {
      showToast.error("Error fetching user data");
      return rejectWithValue("Error fetching user data");
    }
  }
);

// Async thunk to update user profile
export const updateUserProfile = createAsyncThunk(
    "user/updateUserProfile",
    async ({ UserId, userData }, { rejectWithValue }) => {
      try {
        const response = await AxiosInstance.put(
          `${baseUrl}/user/updateuserprofile?UserId=${UserId}`,
          userData
        );
  
        if (response.data.statusCode === 200) {
          return response.data.data;
        } else {
          return rejectWithValue("Failed to update user data");
        }
      } catch (error) {
        return rejectWithValue("Error updating user data");
      }
    }
  );
  

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetUserState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.userData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
        state.success = true;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
        state.success = true;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { resetUserState } = userSlice.actions;
export default userSlice.reducer;