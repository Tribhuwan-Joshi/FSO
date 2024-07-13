const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  return response.status(200).json(blogs);
});

blogsRouter.post("/", async (request, response, next) => {
  try {
    const blog = new Blog(request.body);
    await blog.save();
    return response.status(201).json(blog);
  } catch (err) {
    next(err);
  }
});

module.exports = blogsRouter;
