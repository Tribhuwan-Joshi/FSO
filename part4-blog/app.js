const express = require("express");
require("express-async-errors");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("./utils/config");
const logger = require("./utils/logger");
const blogsRouter = require("./controllers/blog");
const usersRouter = require("./controllers/user");
const middleware = require("./utils/middleware");
const loginRouter = require("./controllers/login");

mongoose
  .connect(config.MONGODB_URI)
  .then(() => logger.info("MongoDB connected"))
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());
app.use("/api/blogs", middleware.userExtractor, blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
if (process.env.NODE_ENV === "test") {
  const testingRouter = require("./controllers/testing");
  app.use("/api/testing", testingRouter);
}
app.use(middleware.unknownEndPoint);
app.use(middleware.errorHandler);

module.exports = app;
