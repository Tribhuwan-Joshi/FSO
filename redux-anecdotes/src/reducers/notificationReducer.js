import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: "",
  reducers: {
    notify(state, action) {
      return action.payload;
    },
  },
});

export default notificationSlice.reducer;
const { notify } = notificationSlice.actions;
export const setNotification = (message, time) => {
  return async (dispatch) => {
    dispatch(notify(message));
    // await new Promise((res) => setTimeout(res, time * 1000));
    setTimeout(() => dispatch(notify("")), time * 1000);
  };
};
