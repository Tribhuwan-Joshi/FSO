const { describe, test, beforeEach, after } = require("node:test");
const assert = require("node:assert");
const app = require("../app");
const supertest = require("supertest");
const mongoose = require("mongoose");
const Blog = require("../models/blog");
const helper = require("./test_helper");

const api = supertest(app);

describe.only("when there is initially some blogs saved", () => {
  // before each clause
  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(helper.intitalBlogs);
  });

  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
  test("correct amount of blogs are returned", async () => {
    const response = await api.get("/api/blogs");

    assert.strictEqual(response.body.length, helper.intitalBlogs.length);
  });
  test("Unique identifier id is returned as blog property", async () => {
    const response = await api.get("/api/blogs");
    response.body.forEach((blog, index) => {
      assert(Object.hasOwn(blog, "id"));
    });
  });
  describe("addition of a new blog", () => {
    test("succeed with valid response", async () => {
      const newBlog = {
        title: "How to eat pancakes",
        url: "xyz",
        likes: 123,
      };

      await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const response = await helper.blogsInDB();
      assert(response.some((r) => r.title === "How to eat pancakes"));
      assert.strictEqual(response.length, helper.intitalBlogs.length + 1);
    });
    test("set likes to 0 as default", async () => {
      const newBlog = {
        title: "Why Peace of Mind is greatest achievement?",
        url: "xyz",
      };
      const response = await api.post("/api/blogs").send(newBlog);
      assert(response.body.likes === 0);
    });
    test("fails with status 400 if data is invalid", async () => {
      const newBlog = {
        title: "Why Peace of Mind is greatest achievement?",
      };
      await api.post("/api/blogs").send(newBlog).expect(400);

      const blogsInEnd = await helper.blogsInDB();

      assert.strictEqual(blogsInEnd.length, helper.intitalBlogs.length);
    });
  });

  describe("deletion of a blog", () => {
    test("that exists succeed with status 204", async () => {
      const blogsAtStart = await helper.blogsInDB();

      const blogToDelete = blogsAtStart[0];

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

      const blogsAtEnd = await helper.blogsInDB();

      assert.strictEqual(blogsAtStart.length, blogsAtEnd.length + 1);
    });
  });

  describe("updation of a blog", () => {
    test("succeed if id is valid", async () => {
      const blogsAtStart = await helper.blogsInDB();
      const blogToUpdate = blogsAtStart[0];
      const newBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 };
      const updatedBlog = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(newBlog);

      assert.strictEqual(updatedBlog.body.likes, blogToUpdate.likes + 1);
    });
  });
});

after(async () => {
  mongoose.connection.close();
  console.log("Connection closed");
});
