const { Schema, model, Types } = require("mongoose");
const dayjs = require("dayjs");

// Create new subdocument schema for Reaction
const reactionSchema = new Schema(
  {
    reactionId: {
      type: Types.ObjectId,
      default: new Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: true,
      trim: true,
      maxlength: [280, "Your reaction cannot be more than 280 characters."],
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) =>
        dayjs(createdAtVal).format("MMM DD, YYYY [at] hh:mm a"),
    },
  },
  {
    toJSON: {
      getters: true,
    },
    id: false,
  }
);

// Create new schema for Thought
const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minlength: [1, "You cannot have an empty thought."],
      maxlength: [280, "Your thought cannot be more than 280 characters."],
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) =>
        dayjs(createdAtVal).format("MMM DD, YYYY [at] hh:mm a"),
    },
    username: {
      type: String,
      required: true,
      ref: "user",
    },
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

// Create a virtual property "reactionCount" that gets the total number of reactions for a thought
thoughtSchema
  .virtual("reactionCount")
  .get(function () {
    return this.reactions.length;
  });

const Thought = model("thought", thoughtSchema);

module.exports = Thought;