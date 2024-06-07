const express = require("express");
const cors = require("cors");
let persons = require("./persons");
const morgan = require("morgan");
morgan.token("payload", (req, res) => {
  if (req.method == "POST") return JSON.stringify(req.body);
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
  res.status(200).json(persons);
});

app.get("/api/info", (req, res) => {
  const info = `Phonebook has info for ${persons.length} people`;
  const date = new Date();
  res.status(200).send(`<p>${info}<p><p>${date}</p>`);
});

app.get("/api/info/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((p) => p.id == id);
  if (!person) res.status(404).json({ error: "Person not found" });
  res.json(person);
});

app.delete("/api/info/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((p) => p.id == id);
  if (!person) return res.status(404).json({ error: "Person not found" });
  persons = persons.filter((p) => p.id != id);
  res.json(person);
});

app.post("/api/persons", (req, res) => {
  const body = req.body;
  if (!body) return res.status(400).json({ error: "Content is missing" });
  if (!body.name) return res.status(400).json({ error: "name is missing" });
  if (!body.number) return res.status(400).json({ error: "number is missing" });

  const alreadyExist = persons.find((p) => p.name == body.name);
  if (alreadyExist)
    return res.status(409).json({ error: "Name already exist" });
  const person = {
    id: Math.floor(Math.random() * 34000 - 12000) + 12000,
    name: body.name,
    number: body.number,
  };
  persons = persons.concat(person);
  res.status(201).send(person);
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server starteted at ${PORT}`));
