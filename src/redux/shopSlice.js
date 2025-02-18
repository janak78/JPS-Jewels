import { createSlice } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// API Slice using Redux Toolkit Query
export const diamondsApi = createApi({
  reducerPath: "diamondsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api" }),
  endpoints: (builder) => ({
    fetchDiamonds: builder.query({
      query: ({ pageNumber, pageSize }) =>
        `/stock/data/page?pageNumber=${pageNumber}&pageSize=${pageSize}`,
    }),
  }),
});

export const { useFetchDiamondsQuery } = diamondsApi;

const shopSlice = createSlice({
  name: "shop",
  initialState: {
    totalPages: 5,
    currentPage: 1,
    itemsPerPage: 12,
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
  },
});

export const { setItemsPerPage, setCurrentPage, setTotalPages } = shopSlice.actions;
export default shopSlice.reducer;
