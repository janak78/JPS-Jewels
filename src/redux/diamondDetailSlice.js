import { createSlice } from "@reduxjs/toolkit";
import AxiosInstance from "../Axiosinstance";

const initialState = {
  diamondDetail: null,
  loading: false,
  error: null,
};

const diamondDetailSlice = createSlice({
  name: "diamondDetail",
  initialState,
  reducers: {
    setDiamondDetail: (state, action) => {
      state.diamondDetail = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setDiamondDetail, setLoading, setError } =
  diamondDetailSlice.actions;

// Async Thunk for fetching diamond details
export const fetchDiamondDetail = (skuId) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const response = await AxiosInstance.get(
      `http://localhost:5000/api/stock/data/${skuId}`
    );

    if (response.data.statusCode === 200) {
      dispatch(setDiamondDetail(response.data.data));
    } else {
      dispatch(setError("Diamond details not found"));
    }
  } catch (error) {
    dispatch(setError("Error fetching diamond details"));
    console.error("Fetch Diamond Detail Error:", error);
  }
};

export default diamondDetailSlice.reducer;
