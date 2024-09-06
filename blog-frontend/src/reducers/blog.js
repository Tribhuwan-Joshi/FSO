import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";

const blogSlice = createSlice({
  name: "blog",
  initialState: [],
  reducers: {
    addBlog(state, action) {
      // payload has the whole blog
      state.push(action.payload);
    },
    setBlogs(state, action) {
      return action.payload;
    },
    deleteBlog(state, action) {
      // take id from the action.payload and filter and return
      const id = action.payload.id;
      return state.filter((b) => b.id != id);
    },

    likeBlog(state, action) {
      const id = action.payload.id;
      return state.map((b) => {
        if (b.id == id) return action.payload;
        return b;
      });
    },
  },
});

// redux thunk pattern
export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs));
  };
};

export const createBlog = (blogObject) => {
  return async (dispatch) => {
    const newBlog = await blogService.createPost(blogObject);
    dispatch(addBlog(newBlog));
  };
};

export const { addBlog, deleteBlog, likeBlog, setBlogs } = blogSlice.actions;

export default blogSlice.reducer;
