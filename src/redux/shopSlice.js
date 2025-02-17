import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../Axiosinstance";

// Initial state with cache
const initialState = {
  diamondsByPage: {}, // Store fetched pages here
  totalPages: 1,
  currentPage: 1,
  itemsPerPage: 12,
  loading: false,
  error: null,
};

// Async thunk to fetch diamonds **only if not cached**
export const fetchDiamonds = createAsyncThunk(
  "shop/fetchDiamonds",
  async ({ pageNumber, pageSize }, { getState, rejectWithValue }) => {
    const { shop } = getState();

    // ✅ Check if page is already in cache
    if (shop.diamondsByPage[pageNumber]) {
      return { diamonds: shop.diamondsByPage[pageNumber], totalPages: shop.totalPages, currentPage: pageNumber };
    }

    try {
      const response = await AxiosInstance.get("http://localhost:5000/api/stock/data/page", {
        params: { pageNumber, pageSize },
      });

      if (response.data.result.statusCode === 200) {
        return {
          diamonds: response.data.result.data,
          totalPages: response.data.result.totalPages,
          currentPage: pageNumber,
        };
      } else {
        return rejectWithValue("No diamonds found.");
      }
    } catch (error) {
      return rejectWithValue("Failed to fetch diamonds.");
    }
  }
);

const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {
    setItemsPerPage: (state, action) => {
      state.itemsPerPage = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDiamonds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDiamonds.fulfilled, (state, action) => {
        state.loading = false;
        state.diamondsByPage[action.payload.currentPage] = action.payload.diamonds; // ✅ Store page data
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchDiamonds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const { setItemsPerPage, setCurrentPage } = shopSlice.actions;

// Export reducer
export default shopSlice.reducer;
