require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const Note = require("./models/note");
app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

app.get("/", (req, res) => res.send("<h1>Hello World!</h1>"));

app.get("/api/notes", (req, res) => {
  Note.find({})
    .then((notes) => res.json(notes))
    .catch((err) => console.log(err.message));
});

app.get("/api/notes/:id", (req, res, next) => {
  Note.findById(req.params.id)
    .then((note) => {
      if (note) res.json(note);
      else res.status(404).end();
    })
    .catch((err) => next(err));
});

app.post("/api/notes", (req, res) => {
  const body = req.body;

  if (body.content == undefined) {
    return res.status(400).json({ error: "Content is missing" });
  }

  const note = new Note({
    content: body.content,
    important: Boolean(body.important) || false,
  });

  note.save().then((savedNote) => {
    res.json(savedNote);
  });
});

app.delete("/api/notes/:id", (req, res, next) => {
  Note.findByIdAndDelete(req.params.id)
    .then((result) => {
      console.log("deleted ", result);
      res.status(204).end();
    })
    .catch((err) => next(err));
});

app.put("/api/notes/:id", (request, response, next) => {
  const body = request.body;

  const note = {
    content: body.content,
    important: body.important,
  };

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});
const unknownEndpoint = (req, res) =>
  res.status(404).send({ error: "unknown endpoint" });

app.use(unknownEndpoint);

// error middleware
const errorHandler = (err, req, res, next) => {
  console.error(err);
  if (err.name == "CastError")
    return res.status(400).send({ error: "malformatted id" });
  next(err);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
