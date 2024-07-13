const logger = require("./logger");
const unknownEndPoint = (req, res) =>
  res.status(404).send({ error: "unknow endpoint" });

const errorHandler = (error, request, response, next) => {
  logger.error("full error object", error, "\n");

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

module.exports = { unknownEndPoint, errorHandler };
