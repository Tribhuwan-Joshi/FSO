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
    removeBlog(state, action) {
      return state.filter((b) => b.id != action.payload.id);
    },
    likeBlog(state, action) {
      const id = action.payload.id;
      return state
        .map((b) => {
          if (b.id == id) return action.payload;
          return b;
        })
        .sort((a, b) => b.likes - a.likes);
    },
  },
});

// redux thunk pattern
export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs.sort((a, b) => b.likes - a.likes)));
  };
};

export const createBlog = (blogObject) => {
  return async (dispatch) => {
    const newBlog = await blogService.createPost(blogObject);
    dispatch(addBlog(newBlog));
  };
};

export const deleteBlogThunk = (blogObject) => {
  // take id from the action.payload and delete and return
  return async (dispatch) => {
    await blogService.deleteBlog(blogObject);
    dispatch(removeBlog(blogObject));
  };
};

export const likeBlogThunk = (blogObject) => {
  return async (dispatch) => {
    const updatedBlog = await blogService.incrementLike(blogObject);
    dispatch(likeBlog(updatedBlog));
  };
};

export const { removeBlog, addBlog, likeBlog, setBlogs } = blogSlice.actions;

export default blogSlice.reducer;
