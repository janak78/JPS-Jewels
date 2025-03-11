import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const getTokenData = () => {
  if (localStorage.getItem("Token")) {
    return jwtDecode(localStorage.getItem("Token"));
  } else {
    return undefined;
  }
};

const initialState = {
  isAuthenticated: !!localStorage.getItem("Token"),
  token: localStorage.getItem("Token") || null,
  user: getTokenData(),
  Username: getTokenData()?.Username,
  Mail: getTokenData()?.Mail,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.Username = action.payload.user.Username;
      state.Mail = action.payload.user?.PrimaryEmail;

      localStorage.setItem("Token", action.payload.token);
      localStorage.setItem("UserId", action.payload.user.UserId);
    },
    logout: (state) => {
      state.isAuthenticated = false;

      state.user = null;
      state.token = null;
      state.Username = null;
      state.Mail = null;

      localStorage.removeItem("Token");
      localStorage.removeItem("UserId");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
