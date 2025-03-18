import { createSlice } from "@reduxjs/toolkit";
import AxiosInstance from "../Axiosinstance";

const baseUrl = process.env.REACT_APP_BASE_API;

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
      `${baseUrl}/stock/data/${skuId}`
    );

    if (response.data.statusCode === 200) {
      dispatch(setDiamondDetail(response.data.data));
    } else if (response.data.statusCode === 400){
      dispatch(setError("Diamond not found"));
    } else {
      dispatch(setError("Diamond details not found"));
    }
  } catch (error) {
    dispatch(setError("Diamond not found"));
    console.error("Fetch Diamond Detail Error:", error);
  }
};

export default diamondDetailSlice.reducer;
