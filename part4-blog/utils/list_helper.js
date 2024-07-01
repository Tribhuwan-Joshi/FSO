const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const total = blogs.reduce((acc, curr) => acc + curr.likes, 0);
  console.log("total is ", total);
  return total;
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null;
  return blogs.reduce((acc, curr) => (acc.likes < curr.likes ? curr : acc), {
    likes: -1,
  });
};

const mostBlogs = (blogs) => {
  if (blogs.length == 0) return null;

  // custom function with no library
  const authors = _.groupBy(blogs, (b) => b.author);
  let res = null;
  let maxi = 0;
  for (let author in authors) {
    if (maxi < authors[author].length)
      res = { author, blogs: authors[author].length };
    maxi = authors[author].length;
  }
  return res;
};

mostBlogs([
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  },
]);

const mostLikes = (blogs) => {
  // custom function with no library
  if (blogs.length == 0) return null;
  const authors = _.groupBy(blogs, (b) => b.author);
  let res = null;
  let maxi = 0;

  for (let author in authors) {
    const authorMaxLikes = authors[author].reduce(
      (acc, curr) => acc + curr.likes,
      0
    );
    console.log(authorMaxLikes);
    if (maxi < authorMaxLikes) {
      res = { author, likes: authorMaxLikes };
      maxi = authorMaxLikes;
    }
  }

  return res;
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
