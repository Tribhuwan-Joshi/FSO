const { describe, test, beforeEach, after } = require("node:test");
const assert = require("assert");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Blog = require("../models/blog");
const helper = require("./test_helper");
const config = require("../utils/config");
const { default: mongoose } = require("mongoose");

/*
test for
- creation - valid - auth is provided, invalid - id is not provided
- read - valid -> blogs are returned
- deletion - valid - id match , invalid - id don't match
- updation - valid - updated blog if valid id, invalid - error returned if invalid

*/

describe("When initial blog is there", () => {
  let authToken;
  beforeEach(async () => {
    // create user  and blog
    await User.deleteMany({});
    await Blog.deleteMany({});
    const userObj = {
      username: "root1",
      name: "root-1",
    };
    const passwordHash = await bcrypt.hash("root1", 10);
    const user = new User({ ...userObj, passwordHash });
    await user.save();
    const res = await api
      .post("/api/login")
      .send({ username: user.username, password: "root1" });

    authToken = `Bearer ${res.body.token}`;
    const blog = {
      title: "test 1",
      url: "/myblog",
    };
    await api.post("/api/blogs").set("authorization", authToken).send(blog);
  });

  test("get request work properly", async () => {
    const blogsBefore = await Blog.find({});
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const blogsAfter = await Blog.find({});
    assert(blogsAfter.length === blogsBefore.length);
  });

  test("adding new blog return 401 if auth is not provided", async () => {
    const newBlog = { title: "test2", url: "/test2" };
    const beforeBlogs = await helper.blogsInDB();
    await api.post("/api/blogs").send(newBlog).expect(401);
    const afterBlogs = await helper.blogsInDB();

    assert.strictEqual(beforeBlogs.length, afterBlogs.length);
  });

  test("creating new blog succeed with proper token", async () => {
    const newBlog = { title: "test2", url: "/test2" };
    const beforeBlogs = await helper.blogsInDB();
    await api
      .post("/api/blogs")
      .set("authorization", authToken)
      .send(newBlog)
      .expect(201);
    const afterBlogs = await helper.blogsInDB();

    assert.strictEqual(beforeBlogs.length + 1, afterBlogs.length);
  });

  test("creation failed with 400 if blog body is missing property", async () => {
    const newBlog = { url: "/test2" };
    const beforeBlogs = await helper.blogsInDB();
    await api
      .post("/api/blogs")
      .set("authorization", authToken)
      .send(newBlog)
      .expect(400);
    const afterBlogs = await helper.blogsInDB();

    assert.strictEqual(beforeBlogs.length, afterBlogs.length);
  });
});

describe.only("deletion of a blog", () => {
  let authToken;
  let userId;
  beforeEach(async () => {
    await User.deleteMany({});
    await Blog.deleteMany({});
    const userObj = {
      username: "root2",
      name: "root-2",
    };
    const passwordHash = await bcrypt.hash("root2", 10);
    const user = new User({ ...userObj, passwordHash });
    await user.save();
    userId = user._id;
    const res = await api
      .post("/api/login")
      .send({ username: user.username, password: "root2" });

    authToken = `Bearer ${res.body.token}`;
    const blog = {
      title: "blog to delete",
      url: "/myblogdelete",
    };
    await api.post("/api/blogs").set("authorization", authToken).send(blog);
  });
  test("succeed if the token matches", async () => {
    const blog = await Blog.find({ user: userId });

    const beforeBlogs = await helper.blogsInDB();
    await api
      .delete(`/api/blogs/${blog[0]._id.toString()}`)
      .set("authorization", authToken)
      .expect(204);
    const afterBlogs = await helper.blogsInDB();
    assert.strictEqual(afterBlogs.length + 1, beforeBlogs.length);
  });
  test("failed with 401 if the token don't matches", async () => {
    const blog = await Blog.find({ user: userId });
    const randomUser = new User({ username: "joji" });
    const invalidAuthToken = await jwt.sign(
      {
        username: "joji",
        id: randomUser._id,
      },
      config.SECRET,
      { expiresIn: 60 * 60 }
    );
    const beforeBlogs = await helper.blogsInDB();
    await api
      .delete(`/api/blogs/${blog[0]._id.toString()}`)
      .set("authorization", `Bearer ${invalidAuthToken}`)
      .expect(401);
    const afterBlogs = await helper.blogsInDB();
    assert.strictEqual(afterBlogs.length, beforeBlogs.length);
  });
});

describe("updation of a blog", () => {
  let authToken;
  let userId;
  beforeEach(async () => {
    await User.deleteMany({});
    await Blog.deleteMany({});
    const userObj = {
      username: "root2",
      name: "root-2",
    };
    const passwordHash = await bcrypt.hash("root2", 10);
    const user = new User({ ...userObj, passwordHash });
    await user.save();
    userId = user._id;
    const res = await api
      .post("/api/login")
      .send({ username: user.username, password: "root2" });

    authToken = `Bearer ${res.body.token}`;
    const blog = {
      title: "blog to delete",
      url: "/myblogdelete",
    };
    await api.post("/api/blogs").set("authorization", authToken).send(blog);
  });
  test("succeed if the token matches", async () => {
    const blog = await Blog.find({ user: userId });
    const updatedBlog = { title: "update title", url: "/updated" };
    const beforeBlogs = await helper.blogsInDB();
    await api
      .put(`/api/blogs/${blog[0]._id.toString()}`)
      .set("authorization", authToken)
      .send(updatedBlog)
      .expect(200);
    const afterBlogs = await helper.blogsInDB();
    assert.strictEqual(afterBlogs.length, beforeBlogs.length);
    const titles = afterBlogs.map((b) => b.title);
    assert(titles.includes(updatedBlog.title));
  });
  test("failed with 401 if the token don't matches", async () => {
    const blog = await Blog.find({ user: userId });
    const updatedBlog = { title: "update title", url: "/updated" };
    const randomUser = new User({ username: "joji" });
    const invalidAuthToken = await jwt.sign(
      {
        username: "joji",
        id: randomUser._id,
      },
      config.SECRET,
      { expiresIn: 60 * 60 }
    );
    const beforeBlogs = await helper.blogsInDB();
    await api
      .delete(`/api/blogs/${blog[0]._id.toString()}`)
      .set("authorization", `Bearer ${invalidAuthToken}`)
      .send(updatedBlog)
      .expect(401);
    const afterBlogs = await helper.blogsInDB();
    assert.strictEqual(afterBlogs.length, beforeBlogs.length);
    const titles = afterBlogs.map((b) => b.title);
    assert(!titles.includes(updatedBlog.title));
  });
});

after(() => {
  mongoose.connection.close();
  console.log("Connection closed");
});
