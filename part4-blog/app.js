const express = require("express");
require("express-async-errors");
const { rateLimit } = require("express-rate-limit");
const { slowDown } = require("express-slow-down");
const path = require("path");
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

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   limit: 1,
//   standardHeaders: "draft-7",
//   legacyHeaders: false,
// });

// app.use(limiter);
// const speedLimiter = slowDown({
//   windowMs: 15 * 60 * 1000,
//   delayAfter: 1,
//   delayMs: () => 2000,
// });
// app.use(speedLimiter);
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
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "dist", "index.html"));
});
app.use(middleware.unknownEndPoint);
app.use(middleware.errorHandler);

module.exports = app;
