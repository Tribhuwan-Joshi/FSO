const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
require("express-async-errors");
blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  return response.status(200).json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const blog = new Blog(request.body);
  await blog.save();
  return response.status(201).json(blog);
});

blogsRouter.delete("/:id", async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

blogsRouter.put("/:id", async (req, response) => {
  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
    context: "query",
  });

  return response.json(updatedBlog);
});

module.exports = blogsRouter;
