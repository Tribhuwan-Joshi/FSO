const jwt = require("jsonwebtoken");
const User = require("../models/user");
const logger = require("./logger");
require("express-async-errors");
const config = require("../utils/config");
const unknownEndPoint = (req, res) =>
  res.status(404).send({ error: "unknow endpoint" });

const userExtractor = async (req, res, next) => {
  const authentication = req.get("authorization");
  if (authentication && authentication.startsWith("Bearer")) {
    const decodeToken = jwt.verify(
      authentication.replace("Bearer ", ""),
      config.SECRET
    );
    if (!decodeToken.id) {
      return res.status(401).json({ error: "token invalid" });
    } else {
      const user = await User.findById(decodeToken.id);
      if (!user) return res.status(401).json({ error: "Unauthorized" });
      else req.user = user;
    }
  } else {
<<<<<<< HEAD
    req.user = null;
=======
    res.user = null;
>>>>>>> 6471985bd0c1106165c37812feb29dba9405b90a
  }
  next();
};

const errorHandler = (error, request, response, next) => {
  logger.error("full error object", error, "\n");

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (
    error.name === "MongoServerError" &&
    error.message.includes("E11000 duplicate key error")
  ) {
    return response
      .status(400)
      .json({ error: "expected `username` to be unique" });
  } else if (error.name === "JsonWebTokenError")
    return response.status(401).json({ error: "token invalid" });
  next(error);
};

module.exports = { unknownEndPoint, errorHandler, userExtractor };
