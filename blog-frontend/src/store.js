import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./reducers/notification";
export const store = configureStore({
  reducer: {
    notification: notificationReducer,
  },
});
