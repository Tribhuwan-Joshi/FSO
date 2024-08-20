const notesRouter = require("express").Router();
const Note = require("../models/note");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const config = require("../utils/config");

const getTokenFrom = (req) => {
  const authorization = req.get("Authorization");
  if (authorization && authorization.startsWith("Bearer")) {
    return authorization.replace("Bearer ", "");
  }
  return null;
};

notesRouter.get("/", async (req, res) => {
  const notes = await Note.find({}).populate("user", { username: 1, name: 1 });
  return res.json(notes);
});

notesRouter.get("/:id", async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (note) res.json(note);
  else res.status(404).end();
});

notesRouter.post("/", async (req, res) => {
  const body = req.body;
  const decodeToken = jwt.verify(getTokenFrom(req), config.SECRET);
  if (!decodeToken.id) {
    return res.status(401).json({ error: "token invalid" });
  }
  const user = await User.findById(decodeToken.id);
  const note = new Note({
    content: body.content,
    important: Boolean(body.important) || false,
    user: user?.id,
  });

  const savedNote = await note.save();
  user.notes = user.notes.concat(savedNote._id);
  await user.save();
  res.status(201).json(savedNote);
});

notesRouter.delete("/:id", async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

notesRouter.put("/:id", async (request, response) => {
  const body = request.body;

  const note = {
    content: body.content,
    important: body.important,
  };

  const updatedNote = await Note.findByIdAndUpdate(request.params.id, note, {
    new: true,
    runValidators: true,
    context: "query",
  });
  response.json(updatedNote);
});

module.exports = notesRouter;
