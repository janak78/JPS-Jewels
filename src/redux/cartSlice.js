import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import showToast from "../components/Toast/Toaster";
import AxiosInstance from "../Axiosinstance";
import sendSwal from "../components/Swal/sendSwal";

const initialState = {
  cartCount: 0,
  cartData: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.cartCount = action.payload.count;
      state.cartData = action.payload.data;
    },
    removeCart: (state) => {
      state.cartCount = 0;
      state.cartData = [];
    },
    addItemToCart: (state, action) => {
      state.cartData.push(action.payload); // Optimistic update
      state.cartCount += 1;
    },
    removeItemFromCart: (state, action) => {
      state.cartData = state.cartData.filter(item => item.AddToCartId !== action.payload);
      state.cartCount -= 1;
    }
  },
});

export const { setCart, removeCart, addItemToCart, removeItemFromCart } = cartSlice.actions;

export const fetchCartCount = (userId) => async (dispatch) => {
  try {
    const token = localStorage.getItem("Token"); // Get token from localStorage

    const res = await AxiosInstance.get(
      `http://localhost:5000/api/cart/cart?userId=${userId}`
    );

    if (res.data.statusCode === 200) {
      dispatch(setCart({ count: res.data.TotalCount, data: res.data.data }));
    } else {
      dispatch(setCart({ count: 0, data: [] }));
    }
  } catch (error) {
    console.error("Cart fetch error:", error);
  }
};

export const addToCart = (item, userId) => async (dispatch) => {
  try {
    const token = localStorage.getItem("Token");

    const response = await AxiosInstance.post(
      "http://localhost:5000/api/cart/addtocart",
      { ...item, UserId: userId }
    );

    if (response.data.statusCode === 200) {
      dispatch(addItemToCart(response.data.data)); // Add item optimistically
      dispatch(fetchCartCount(userId));
      showToast.success("Item Added Successfully.");
    } else if (response.data.statusCode === 202) {
      showToast.error(response.data.message);
    } else {
      console.error("Failed to add item:", response.data.message);
      showToast.error("Your Session Expired.");
    }
  } catch (error) {
    console.error("Add to cart error:", error);
  }
};

export const removeFromCart = (AddToCartId, userId) => async (dispatch) => {
    // Show confirmation alert before deleting
    const willDelete = await sendSwal();
  
    if (willDelete) {
      try {
        const response = await AxiosInstance.delete(
          `http://localhost:5000/api/cart/updatecart/${AddToCartId}`
        );
  
        if (response.data.statusCode === 200) {
          dispatch(removeItemFromCart(AddToCartId));
          dispatch(fetchCartCount(userId));
          showToast.success("Item Removed Successfully.");
        } else {
          showToast.error("Failed to remove item.");
        }
      } catch (error) {
        console.error("Remove from cart error:", error);
        showToast.error("Something went wrong.");
      }
    }
  };

export default cartSlice.reducer;
