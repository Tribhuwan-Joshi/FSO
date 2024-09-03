const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const Contact = require("./models/contact");

morgan.token("payload", (req) => {
  if (req.method === "POST") return JSON.stringify(req.body);
  return "";
});

const app = express();
app.use(express.static("dist"));
app.use(express.json()); // json-parser
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :payload"
  )
);
app.use(cors());

app.get("/api/persons", (req, res) => {
  Contact.find({})
    .then((data) => res.json(data))
    .catch(() => res.status(500).send({ error: "Error occured" }));
});

app.get("/api/info", (req, res) => {
  Contact.countDocuments()
    .then((len) => {
      const info = `Phonebook has info for ${len} people`;
      const date = new Date();
      res.status(200).send(`<p>${info}<p><p>${date}</p>`);
    })
    .catch(() => res.status(500));
});

app.get("/api/info/:id", async (req, res, next) => {
  try {
    const person = await Contact.findById(req.params.id);
    if (person) {
      res.json(person);
    } else {
      res.status(404).send({ error: "Contact not found" });
    }
  } catch (err) {
    next(err);
  }
});

app.delete("/api/info/:id", (req, res, next) => {
  Contact.findByIdAndDelete(req.params.id)
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((err) => next(err));
});

app.post("/api/persons", (req, res, next) => {
  const body = req.body;
  if (!body) return res.status(400).json({ error: "Content is missing" });
  if (!body.name) return res.status(400).json({ error: "name is missing" });
  if (!body.number) return res.status(400).json({ error: "number is missing" });

  const contact = new Contact({
    name: body.name,
    number: body.number,
  });

  contact
    .save()
    .then((doc) => res.json(doc))
    .catch((err) => next(err));
});

app.put("/api/info/:id", (req, res, next) => {
  const body = req.body;

  const contact = {
    name: body.name,
    number: body.number,
  };

  Contact.findByIdAndUpdate(req.params.id, contact, {
    new: true,
    context: "query",
    runValidators: true,
  })
    .then((doc) =>
      doc ? res.json(doc) : res.status(404).send({ error: "Record not found" })
    )
    .catch((err) => next(err));
});

const unknownPoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownPoint);

const errorHandler = (err, req, res, next) => {
  console.error(err.message);

  if (err.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }
  next(err);
};

app.use(errorHandler);

const PORT = 3001;
app.listen(PORT, () => console.log(`Server starteted at ${PORT}`));
