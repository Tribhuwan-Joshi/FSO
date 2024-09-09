const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 3,
    unique: true,
  },
  name: String,
  passwordHash: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
  ],
});

// when matching user password, directly query from DB
userSchema.set("toJSON", {
  transform: (doc, ret) => {
<<<<<<< HEAD
    ret.id = ret._id?.toString();
=======
    ret.id = ret._id.toString();
>>>>>>> 6471985bd0c1106165c37812feb29dba9405b90a
    delete ret._id;
    delete ret._v;
    delete ret.passwordHash;
  },
});

module.exports = mongoose.model("User", userSchema);
