    import { createSlice } from "@reduxjs/toolkit";
    import axios from "axios";
    import AxiosInstance from "../Axiosinstance";

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
    },
    });

    export const { setCart, removeCart, addItemToCart } = cartSlice.actions;

    export const fetchCartCount = (userId) => async (dispatch) => {
    try {
        const token = localStorage.getItem("Token"); // Get token from localStorage

        const res = await AxiosInstance.get(
        `http://localhost:5000/api/cart/cart?userId=${userId}`,
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
        { ...item, UserId: userId },
        );

        if (response.data.statusCode === 200) {
        dispatch(addItemToCart(response.data.data)); // Add item optimistically
        dispatch(fetchCartCount(userId)); 
        } else {
        console.error("Failed to add item:", response.data.message);
        }
    } catch (error) {
        console.error("Add to cart error:", error);
    }
    };

    export default cartSlice.reducer;
