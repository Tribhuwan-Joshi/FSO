const User = require("../models/user");
const Note = require("../models/note");
const router = require("express").Router();

router.post("/reset", async (request, response) => {
  await Note.deleteMany({});
  await User.deleteMany({});

  response.status(204).end();
});

module.exports = router;
