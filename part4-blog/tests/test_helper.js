const Blog = require("../models/blog");

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

module.exports = { intitalBlogs, blogsInDB };
