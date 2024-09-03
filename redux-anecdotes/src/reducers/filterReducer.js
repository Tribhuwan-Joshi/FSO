// export const changeFilter = (content) => {
//   return {
//     type: "SET_FILTER",
//     payload: content,
//   };
// };

import { createSlice } from "@reduxjs/toolkit";

// const filterReducer = (state = "", action) => {
//   if (action.type === "SET_FILTER") {
//     return action.payload;
//   }
//   return state;
// };

const filterSlice = createSlice({
  name: "filter",
  initialState: "",
  reducers: {
    changeFilter(state, action) {
      return action.payload;
    },
  },
});

export default filterSlice.reducer;
export const { changeFilter } = filterSlice.actions;
