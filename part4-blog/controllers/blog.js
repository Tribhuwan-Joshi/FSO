const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
require("express-async-errors");
blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
    id: 1,
  });
  return response.status(200).json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  // get a randomuser for now
  const currentUser = await User.findOne({});
  console.log(currentUser);
  const blog = new Blog({ ...request.body, user: currentUser._id });
  currentUser.blogs = currentUser.blogs.concat(blog._id);

  await currentUser.save();
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
