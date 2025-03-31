import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import showToast from "../components/Toast/Toaster";
import AxiosInstance from "../Axiosinstance";
import sendSwal from "../components/Swal/sendSwal";

const initialState = {
  cartCount: 0,
  cartData: [],
};
const baseUrl = process.env.REACT_APP_BASE_API;

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
      state.cartData = state.cartData.filter(
        (item) => item.AddToCartId !== action.payload
      );
      state.cartCount -= 1;
    },
  },
});

export const { setCart, removeCart, addItemToCart, removeItemFromCart } =
  cartSlice.actions;

export const fetchCartCount = (userId) => async (dispatch) => {
  try {
    const token = localStorage.getItem("Token"); // Get token from localStorage

    const res = await AxiosInstance.get(
      `${baseUrl}/cart/cart?userId=${userId}`
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

export const addToCart = (item, userId, shouldShowToast, navigate) => async (dispatch) => {
  try {
    const token = localStorage.getItem("Token");

    const response = await AxiosInstance.post(
      `${baseUrl}/cart/addtocart`,
      { ...item, UserId: userId }
    );

    if (response.data.statusCode === 200) {
      dispatch(addItemToCart(response.data.data)); // Add item optimistically
      dispatch(fetchCartCount(userId));

      if(shouldShowToast){
        showToast.success(response.data.message);
      }

    } else if (response.data.statusCode === 202) {
      if(shouldShowToast){
      showToast.warning(response.data.message);
    }
    } else if (response.data.statusCode === 203) {
      if(shouldShowToast){
      showToast.warning(response.data.message);
    }
    } else if (response.data.statusCode === 401) {
      showToast.error("Your Session Expired. Please Login Again");
    } else {
      console.error("Failed to add item:", response.data.message);
      showToast.warning("Your Session Expired. Please Login Again");
    }
  } catch (error) {
    showToast.error("Your Session Expired. Please Login Again");
    navigate("/login");
  } 
};

// export const removeFromCart = (AddToCartId, userId) => async (dispatch) => {
//   // Show confirmation alert before deleting
//   const willDelete = await sendSwal();

//   if (willDelete) {
//     try {
//       const response = await AxiosInstance.delete(
//         `${baseUrl}/cart/updatecart/${AddToCartId}`
//       );

//       if (response.data.statusCode === 200) {
//         dispatch(removeItemFromCart(AddToCartId));
//         dispatch(fetchCartCount(userId));
//         showToast.success("Item Removed Successfully.");
//       } else {
//         showToast.error("Failed to remove item.");
//       }
//     } catch (error) {
//       console.error("Remove from cart error:", error);
//       showToast.error("Something went wrong.");
//     }
//   }
// };

export const removeFromCart = (AddToCartId, userId) => async (dispatch, getState) => {
  const willDelete = await sendSwal();

  if (willDelete) {
    // Optimistically remove the item from the UI
    const prevCartData = getState().cart.cartData;
    const updatedCartData = prevCartData.filter((item) => item.AddToCartId !== AddToCartId);
    dispatch(removeItemFromCart(AddToCartId));

    try {
      const response = await AxiosInstance.delete(
        `${baseUrl}/cart/updatecart/${AddToCartId}`
      );

      if (response.data.statusCode === 200) {
        dispatch(fetchCartCount(userId)); // Ensure the latest cart count is fetched
        showToast.success("Item Removed Successfully.");
      } else {
        showToast.error("Failed to remove item.");
        dispatch(setCart({ count: prevCartData.length, data: prevCartData })); // Rollback on failure
      }
    } catch (error) {
      console.error("Remove from cart error:", error);
      showToast.error("Something went wrong.");
      dispatch(setCart({ count: prevCartData.length, data: prevCartData })); // Rollback on error
    }
  }
};


export default cartSlice.reducer;
