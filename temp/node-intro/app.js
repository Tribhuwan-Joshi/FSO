const logger = require("./utils/logger");
const config = require("./utils/config");
const express = require("express");
require("express-async-errors");
const app = express();
const notesRouter = require("./controllers/notes");
const cors = require("cors");
const middleware = require("./utils/middleware");
const mongoose = require("mongoose");
const userRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");

mongoose.set("strictQuery", false);
console.log("start connecting...");
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
app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);
if (process.env.NODE_ENV === "test") {
  const testingRouter = require("./controllers/testing");
  app.use("/api/testing", testingRouter);
}
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
