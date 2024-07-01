const unknownEndPoint = (req, res) =>
  res.status(404).send({ error: "unknow endpoint" });

module.exports = { unknownEndPoint };
