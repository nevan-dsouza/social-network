const { Schema, model } = require("mongoose");

// Create new schema for User
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      match: [
        /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,
        "Please enter a valid e-mail address.",
      ],
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: "thought",
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  },
);

// Create a virtual property "friendCount" that gets the total number of a user's friends
userSchema
  .virtual("friendCount")
  // Getter
  .get(function () {
  return this.friends.length;
});

// Initialize User model
const User = model("user", userSchema);

module.exports = User;