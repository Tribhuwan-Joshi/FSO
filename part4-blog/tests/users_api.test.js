const { describe, test, beforeEach, after } = require("node:test");
const assert = require("node:assert");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const app = require("../app");
const supertest = require("supertest");
const helper = require("./test_helper");
const mongoose = require("mongoose");
const api = supertest(app);

describe("when there is initially a user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash("tjsmpasswd", 10);
    const newUser = new User({
      name: "Tribhuwan",
      username: "tjsm",
      passwordHash,
    });
    await newUser.save();
  });

  test("user is returned when requested", async () => {
    const res = await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);
    const usernames = res.body.map((r) => r.username);
    assert(usernames.includes("tjsm"));
  });

  test("creation succeed with new username", async () => {
    const newUser = {
      username: "alpha",
      name: "Alphanzo",
      password: "alphapasswd",
    };
    const usersAtStart = await helper.usersInDB();
    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDB();
    assert.strictEqual(usersAtStart.length + 1, usersAtEnd.length);
    const usernames = usersAtEnd.map((u) => u.username);
    assert(usernames.includes(newUser.username));
  });
  test("creation fails with proper status code if username is already taken", async () => {
    const usersAtStart = await helper.usersInDB();
    const newUser = {
      username: "tjsm",
      name: "Alphanzo",
      password: "alphapasswd",
    };

    const res = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDB();

    assert(res.body.error.includes("expected `username` to be unique"));
    assert.strictEqual(usersAtStart.length, usersAtEnd.length);
  });

  test("validation error occurr if password is too short", async () => {
    const newUser = {
      username: "alpha",
      name: "Alphanzo",
      password: "al",
    };
    const usersAtStart = await helper.usersInDB();
    const res = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);
    assert(
      res.body.error.includes("password should contain atleast 3 characters")
    );
    const usersAtEnd = await helper.usersInDB();
    assert.strictEqual(usersAtStart.length, usersAtEnd.length);
  });
});

after(() => {
  mongoose.connection.close();
});
