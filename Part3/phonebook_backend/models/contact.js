const mongoose = require("mongoose");
require("dotenv").config();
mongoose.set("strictQuery", false);

const url = process.env.MONGO_URI;

mongoose
  .connect(url)
  .then((res) => console.log("mongoDB connected"))
  .catch((err) => console.log(err.message));

const contactSchema = mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    requried: true,
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: function (v) {
        return /\d{3,4}-\d+/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    required: [true, "User phone number is required"],
  },
});

contactSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

module.exports = new mongoose.model("Contact", contactSchema);
