import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import cartReducer from "./cartSlice";
import shopReducer from "./shopSlice";
import { diamondsApi } from "./shopSlice"; // Import RTK Query API

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    shop: shopReducer,
    [diamondsApi.reducerPath]: diamondsApi.reducer, // Add API reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(diamondsApi.middleware), // Add API middleware
});

export default store;
