import { createSlice } from "@reduxjs/toolkit";
import loginService from "../services/login";
import blogService from "../services/blogs";

const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;

export const clearUserInfo = () => {
  return (dispatch) => {
    window.localStorage.removeItem("userInfo");
    dispatch(setUser(null));
  };
};

export const loginUser = (userInfo) => {
  return async (dispatch) => {
    const res = await loginService.loginUser(userInfo);
    blogService.setToken(res.data.token);
    setUser(res.data);
    localStorage.setItem("userInfo", JSON.stringify(res.data));
    dispatch(setUser(res.data));
  };
};

export const getUser = () => {
  return (dispatch) => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    dispatch(setUser(userInfo));
  };
};

export default userSlice.reducer;
