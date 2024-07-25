const { test, before, after } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const api = supertest(app);

before(async () => {
  await User.deleteMany({});
  const randomUser = { username: "random", name: "user" };
  const passwordHash = await bcrypt.hash("myPassword", 10);
  const user = new User({ ...randomUser, passwordHash });
  await user.save();
});

test("exisiting user can login and get token ", async () => {
  const res = await api
    .post("/api/login")
    .send({ username: "random", password: "myPassword" })
    .expect(200)
    .expect("Content-Type", /application\/json/);

  assert("token" in res.body);
});

test("received 401 if user or password is incorrect", async () => {
  const res = await api
    .post("/api/login")
    .send({ username: "don't exist", password: "myPassword" })
    .expect(401)
    .expect("Content-Type", /application\/json/);

  assert(!("token" in res.body));
});

after(() => {
  mongoose.connection.close();
});
