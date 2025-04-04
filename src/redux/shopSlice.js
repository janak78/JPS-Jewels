import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import AxiosInstance from "../Axiosinstance";

const baseUrl = process.env.REACT_APP_BASE_API;

// API Slice using Redux Toolkit Query
export const diamondsApi = createApi({
  reducerPath: "diamondsApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${baseUrl}` }),
  tagTypes: ["Diamonds"], // Add tag
  endpoints: (builder) => ({
    fetchDiamonds: builder.query({
      query: ({ pageNumber, pageSize, filterData }) => ({
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

export const fetchSimilarDiamonds =
  (carat, color, clarity, shape, IsNatural, IsLabgrown) => async (dispatch) => {
    try {
      const res = await AxiosInstance.get(
        `${baseUrl}/stock/similarproducts?carat=${carat}&color=${color}&clarity=${clarity}&shape=${shape}&IsNatural=${IsNatural}&IsLabgrown=${IsLabgrown}`
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
    const res = await AxiosInstance.get(`${baseUrl}/stock/caretdata`);

    if (res.data.result.statusCode === 200) {
      dispatch(setCaretData(res.data.result.data.slice(0, 5)));
    } else {
      dispatch(setCaretData({ caretData: [] }));
    }
  } catch (error) {
    console.error("Cart fetch error:", error);
  }
};

export const fetchShapeData = createAsyncThunk(
  "shop/fetchShapeData",
  async (shapeValue = null, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.get(`${baseUrl}/stock/shapedata`, {
        params: shapeValue ? { shape: shapeValue } : {},
      });

      if (response.data.result.statusCode === 200) {
        return response.data.result.data; // Returning full data without slicing
      } else {
        return rejectWithValue("No data found.");
      }
    } catch (error) {
      console.error("API Error:", error);
      return rejectWithValue("Error fetching data. Try again.");
    }
  }
);

export const { useFetchDiamondsQuery } = diamondsApi;

const shopSlice = createSlice({
  name: "shop",
  initialState: {
    totalPages: 5,
    currentPage: 1,
    itemsPerPage: 12,
    caretData: [],
    similarDiamonds: [],
    shape: [""],
    shapeLoading: false, // Added loading state
    shapeError: null, // Added error state
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
      state.caretData = action.payload;
    },
    setSimilarDiamonds: (state, action) => {
      state.similarDiamonds = action.payload;
    },
    setShape: (state, action) => {
      state.shape = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShapeData.pending, (state) => {
        state.shapeLoading = true;
        state.shapeError = null;
      })
      .addCase(fetchShapeData.fulfilled, (state, action) => {
        state.caretData = action.payload;
        state.shapeLoading = false;
        state.shapeError = null;
      })
      .addCase(fetchShapeData.rejected, (state, action) => {
        state.caretData = [];
        state.shapeLoading = false;
        state.shapeError = action.payload;
      });
  },
});


export const {
  setItemsPerPage,
  setCurrentPage,
  setTotalPages,
  setCaretData,
  setSimilarDiamonds,
  setShape,
} = shopSlice.actions;
export default shopSlice.reducer;
