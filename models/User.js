const mongooes = require("mongoose");

const UserSchema = new mongooes.Schema({
  username: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  roles: [
    {
      type: String,
      default: "employee",
    },
  ],
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongooes.model("User", UserSchema);

module.exports = User;
