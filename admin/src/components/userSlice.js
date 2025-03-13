import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../AxiosInstance"; // Adjust path if needed

// Async thunk to fetch user count data
export const fetchUsers = createAsyncThunk("user/fetchUsers", async (_, { dispatch }) => {
  try {
    dispatch(setLoading(true));
    const res = await AxiosInstance.get(`/user/countdata`);

    if (res.status === 200) {
      dispatch(setUserData(res.data.data)); // Update Redux state
    } else {
      console.warn("Unexpected response:", res.message);
    }
  } catch (error) {
    console.error("Error fetching user data:", error.message || error);
  } finally {
    dispatch(setLoading(false));
  }
});

const initialState = {
  signupCount: 0,
  billingCount: 0,
  usersCount: 0,
  addtoCarts: 0,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.signupCount = action.payload.signupCount ?? 0;
      state.billingCount = action.payload.billingCount ?? 0;
      state.usersCount = action.payload.usersCount ?? 0;
      state.addtoCarts = action.payload.addtoCarts ?? 0;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setUserData, setLoading } = userSlice.actions;
export default userSlice.reducer;
