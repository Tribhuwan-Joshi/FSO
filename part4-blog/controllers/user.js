const User = require("../models/user");
const userRouter = require("express").Router();
const bcrypt = require("bcrypt");
userRouter.get("/", async (req, res) => {
  const users = await User.find({}).populate("blogs");
  res.status(200).json(users);
});

userRouter.post("/", async (req, res) => {
  console.log("gonna create user with ", req.body);
  const { username, name, password } = req.body;
  // check if username is unique

  if (password.length < 3) {
    return res
      .status(400)
      .json({ error: "password should contain atleast 3 characters" });
  }
  const saltRound = 10;
  const passwordHash = await bcrypt.hash(password, saltRound);

  const newUser = new User({
    username,
    name,
    passwordHash,
  });
  await newUser.save();
  res.status(201).json(newUser);
});

module.exports = userRouter;
