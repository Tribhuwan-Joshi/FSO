const logger = require("./utils/logger");
const config = require("./utils/config");
const express = require("express");
const app = express();
const notesRouter = require("./controllers/notes");
const cors = require("cors");
const middleware = require("./utils/middleware");
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);
mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);
app.use(express.static("dist"));

app.get("/", (req, res) => res.send("<h1>Hello World!</h1>"));
app.use("/api/notes", notesRouter);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
