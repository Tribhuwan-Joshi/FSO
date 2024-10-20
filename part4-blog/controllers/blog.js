const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
require("express-async-errors");

//get token

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({})
    .populate("user", {
      username: 1,
      name: 1,
      id: 1,
    })
    .populate("comments.user", { username: 1, name: 1, id: 1 });
  return response.status(200).json(blogs);
});

// post comment on specific blog

blogsRouter.post("/:id", async (req, res) => {
  const blogId = req.params.id;

  const comment = { content: req.body.comment, user: req.user.id };
  console.log("comment is ", comment);
  if (!comment.content)
    return res.status(400).json({ error: "Comment must be of length 1" });
  const blog = await Blog.findById(blogId).populate("user");
  if (!blog) return res.status(404).json({ error: "Blog not found" });

  blog.comments.push(comment);
  await blog.save();
  return res.status(201).json(blog);
});

blogsRouter.post("/", async (request, response) => {
  // get token and verify using jwt.verify
  // throw error if no token

  const currentUser = request.user;
  if (!currentUser)
    return response.status(401).json({ error: "Invalid token" });

  const blog = new Blog({ ...request.body, user: currentUser._id });
  currentUser.blogs = currentUser.blogs.concat(blog._id);
  blog.user = currentUser;
  await currentUser.save();
  await blog.save();
  return response.status(201).json(blog);
});

blogsRouter.delete("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("user");
  if (!blog) return res.status(401).json({ error: "blog don't exist" });
  const user = await User.findById(blog.user._id).populate("blogs");

  const updatedBlogs = user.blogs.filter((blog) => blog._id != req.params.id);
  user.blogs = updatedBlogs;
  if (blog.user._id.toString() == req.user._id) {
    await blog.deleteOne();
    return res.status(204).end();
  } else return res.status(401).json({ error: "Unauthorized to delete" });
});

blogsRouter.put("/:id", async (req, response) => {
  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
    context: "query",
  }).populate("user");

  return response.status(200).json(updatedBlog);
});

module.exports = blogsRouter;
