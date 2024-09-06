import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./reducers/notification";
import blogReducer from "./reducers/blog";
import userReducer from "./reducers/user";

export const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogReducer,
    user: userReducer,
  },
});
