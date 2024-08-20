const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
require("express-async-errors");

//get token

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
    id: 1,
  });
  return response.status(200).json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  // get token and verify using jwt.verify
  // throw error if no token

  const currentUser = request.user;
  if (!currentUser)
    return response.status(401).json({ error: "Invalid token" });

  const blog = new Blog({ ...request.body, user: currentUser._id });
  currentUser.blogs = currentUser.blogs.concat(blog._id);
  await currentUser.save();
  await blog.save();
  return response.status(201).json(blog);
});

blogsRouter.delete("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("user");
  if (blog.user._id.toString() == req.user._id) {
    await blog.deleteOne();
    return res.status(204).end();
  } else return res.status(401).json({ error: "Unauthorized to delete" });
});

blogsRouter.put("/:id", async (req, response) => {
  const userId = req.body.user;
  const user = await User.findById(userId);
  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
    context: "query",
  });

  updatedBlog.user = user;

  return response.status(200).json(updatedBlog);
});

module.exports = blogsRouter;
