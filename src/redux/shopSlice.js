import { createSlice } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import AxiosInstance from "../Axiosinstance";

// API Slice using Redux Toolkit Query
export const diamondsApi = createApi({
  reducerPath: "diamondsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api" }),
  tagTypes: ["Diamonds"], // Add tag
  endpoints: (builder) => ({
    fetchDiamonds: builder.query({
      query: ({pageNumber, pageSize, filterData}) => ({
        url: `/stock/data/page?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        method: "POST",
        body: filterData,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Diamonds"],
    }),
  }),
});

export const fetchSimilarDiamonds = (carat, color, clarity, shape) => async (dispatch) => {
  try {
    const res = await AxiosInstance.get(
      `http://localhost:5000/api/stock/similarproducts?carat=${carat}&color=${color}&clarity=${clarity}&shape=${shape}`
    );

    if (res.data.statusCode === 200) {
      dispatch(setSimilarDiamonds(res.data.data.slice(0, 4)));
    } else {
      dispatch(setSimilarDiamonds([]));
    }
  } catch (error) {
    console.error("Error fetching similar diamonds:", error);
  }
};



export const fetchCaretData = () => async (dispatch) => {
  try {
    const res = await AxiosInstance.get(
      `http://localhost:5000/api/stock/caretdata`
    );

    if (res.data.result.statusCode === 200) {
      dispatch(setCaretData(res.data.result.data.slice(0, 5)));
    } else {
      dispatch(setCaretData({ caretData: [] }));
    }
  } catch (error) {
    console.error("Cart fetch error:", error);
  }
};

export const { useFetchDiamondsQuery } = diamondsApi;

const shopSlice = createSlice({
  name: "shop",
  initialState: {
    totalPages: 5,
    currentPage: 1,
    itemsPerPage: 12,
    caretData: [],
    similarDiamonds: [],
  },
  reducers: {
    setItemsPerPage: (state, action) => {
      state.itemsPerPage = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setTotalPages: (state, action) => {
      state.totalPages = action.payload;
    },
    setCaretData: (state, action) => {
      state.caretData = action.payload; // Directly set the array
    },
    setSimilarDiamonds: (state, action) => {
      state.similarDiamonds = action.payload;  // Store Similar Diamonds
    },
  },
});

export const { setItemsPerPage, setCurrentPage, setTotalPages, setCaretData, setSimilarDiamonds } =
  shopSlice.actions;
export default shopSlice.reducer;
