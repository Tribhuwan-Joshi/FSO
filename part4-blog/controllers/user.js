const User = require("../models/user");
const userRouter = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../utils/config");
userRouter.get("/", async (req, res) => {
  const users = await User.find({}).populate("blogs");
  res.status(200).json(users);
});

userRouter.post("/", async (req, res) => {
  const { username, name, password } = req.body;
  // check if username is unique

  if (password.length < 3) {
    return res
      .status(400)
      .json({ error: "password should contain atleast 3 characters" });
  }
  const user = await User.findOne({ username });

  if (user) return res.status(400).json({ error: "username already in use" });
  const saltRound = 10;
  const passwordHash = await bcrypt.hash(password, saltRound);

  const newUser = new User({
    username,
    name,
    passwordHash,
  });
  await newUser.save();

  // create jwt token now
  const userForToken = {
    username: newUser.username,
    id: newUser._id,
  };

  const token = jwt.sign(userForToken, config.SECRET, {
    expiresIn: 60 * 60,
  });
  res.status(200).json({ token, username: newUser.username });
});

module.exports = userRouter;
