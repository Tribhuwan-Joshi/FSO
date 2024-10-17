const mongoose = require("mongoose");

// Function to format the date as '12 Sep 2023'
const formatDate = (dateString) => {
  const options = { day: "numeric", month: "short", year: "numeric" };
  return new Date(dateString).toLocaleDateString("en-GB", options);
};

// Blog schema
const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  likes: { type: Number, default: 0 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  description: { type: String, maxlength: 500 },
  createdAt: { type: Date, default: Date.now },
  comments: [
    {
      content: { type: String, required: true },
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
  ],
});

// Create a virtual field 'formattedDate' to format the 'createdAt' field
blogSchema.virtual("formattedDate").get(function () {
  return formatDate(this.createdAt);
});

// Ensure virtual fields are included when converting documents to JSON
blogSchema.set("toJSON", { virtuals: true });
blogSchema.set("toObject", { virtuals: true });

// Set the toJSON transform function to clean up the output
blogSchema.set("toJSON", {
  virtuals: true, // include virtuals
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

module.exports = mongoose.model("Blog", blogSchema);
