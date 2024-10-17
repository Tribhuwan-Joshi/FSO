import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const createPost = async ({ title, description, author, url }) => {
  const config = { headers: { authorization: token } };
  console.log("posting blog with", config, { title, description, url });
  const res = await axios.post(baseUrl, { title, description, url }, config);
  return res.data;
};

const deleteBlog = async (blogObject) => {
  // also delete it from user
  const config = { headers: { authorization: token } };

  const res = await axios.delete(`${baseUrl}/${blogObject.id}`, config);
  return res.data;
};

const addComment = async ({ comment, blogId }) => {
  const config = { headers: { authorization: token } };
  const res = await axios.post(`${baseUrl}/${blogId}`, { comment }, config);
  return res.data;
};

const incrementLike = async (updatedBlog) => {
  const res = await axios.put(`${baseUrl}/${updatedBlog.id}`, updatedBlog);
  return res.data;
};

export default {
  getAll,
  createPost,
  deleteBlog,
  setToken,
  incrementLike,
  addComment,
};
