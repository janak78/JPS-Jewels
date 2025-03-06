import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import cartReducer from "./cartSlice";
import shopReducer from "./shopSlice";
import diamondDetailReducer from "./diamondDetailSlice";
import { diamondsApi } from "./shopSlice";
import forgotPasswordSlice from "./forgotPasswordSlice";
import resetPasswordSlice from "./resetPasswordSlice";
import userSlice from "./userSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    shop: shopReducer,
    diamondDetail: diamondDetailReducer,
    [diamondsApi.reducerPath]: diamondsApi.reducer,
    forgotPasswordSlice: forgotPasswordSlice,
    resetPasswordSlice: resetPasswordSlice,
    userSlice: userSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(diamondsApi.middleware),
});

export default store;
