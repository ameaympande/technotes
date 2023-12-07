const mongooes = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongooes);
const User = require("./User");

const noteSchema = new mongooes.Schema(
  {
    user: {
      type: mongooes.Schema.Types.ObjectId,
      require: true,
      ref: User,
    },
    title: {
      type: String,
      require: true,
    },
    text: {
      type: String,
      require: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

noteSchema.plugin(AutoIncrement, {
  inc_field: "ticket",
  id: "ticketNums",
  start_seq: 500,
});

const Note = mongooes.model("Note", noteSchema);

module.exports = Note;
