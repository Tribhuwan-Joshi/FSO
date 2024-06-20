const mongoose = require("mongoose");
require("dotenv").config();
mongoose.set("strictQuery", false);

const url = process.env.MONGO_URI;

mongoose
  .connect(url)
  .then((res) => console.log("mongoDB connected"))
  .catch((err) => console.log(err.message));

const contactSchema = mongoose.Schema({
  name: String,
  number: String,
});

contactSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

module.exports = new mongoose.model("Contact", contactSchema);
