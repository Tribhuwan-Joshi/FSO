const Blog = require("../models/blog");
const User = require("../models/user");

const intitalBlogs = [
  {
    title: "HTML Intro",
    url: "xyz",
    likes: 15,
  },
  {
    title: "Understand Event Loops",
    url: "xyz",
    likes: 12,
  },
];

const blogsInDB = async () => {
  const blogs = await Blog.find({});
  return blogs.map((b) => b.toJSON());
};

const usersInDB = async () => {
  const blogs = await User.find({});
  return blogs.map((b) => b.toJSON());
};

module.exports = { intitalBlogs, blogsInDB, usersInDB };
