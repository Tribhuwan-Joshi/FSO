import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: "",
  reducers: {
    notify(state, action) {
      state = action.payload;
      return state;
    },
  },
});

export const { notify } = notificationSlice.actions;

export const setNotification = (notice) => {
  return async (dispatch) => {
    dispatch(notify(notice));
    setTimeout(() => dispatch(notify("")), 5000);
  };
};

export default notificationSlice.reducer;
