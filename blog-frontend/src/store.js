import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./reducers/notification";
import blogReducer from "./reducers/blog";

export const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogReducer,
  },
});
