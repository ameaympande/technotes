const User = require("../models/User");
const Note = require("../models/Note");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// @desc get all users
// @route GET /users
// @access private
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 }).select("-password");
  if (!users || users.length === 0) {
    return res.status(400).json({ message: "No users found." });
  }
  res.json({ data: users });
});

// @desc get all users
// @route POST /users
// @access private
const createNewUser = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body;
  try {
    if (!username || !password || !Array.isArray(roles)) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const duplicateUser = await User.findOne({ username });
    if (duplicateUser) {
      return res.status(400).json({ message: "User already exist." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User({
      username,
      password: hashedPassword,
      roles,
    });

    await newUser.save();

    res
      .status(201)
      .json({ message: `User ${newUser.username} registered successfully.` });
  } catch (error) {
    console.error("Error creating user:", error);
    res
      .status(400)
      .json({ message: "Failed to register user. Please try again later." });
  }
});

// @desc get all users
// @route PATCH /users
// @access private
const updateUser = asyncHandler(async (req, res) => {
  const { id, username, password, roles, isActive } = req.body;

  if (
    !id ||
    !username ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof isActive !== "boolean"
  ) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const user = await User.findById(id).exec();

  if (!user) return res.status(400).json({ message: "User not found." });

  const duplicateUser = await User.findOne({ username }).lean().exec();

  if (duplicateUser && duplicateUser?._id.toString() !== id) {
    return res.status(400).json({ message: "Duplicate username." });
  }
  user.username = username;
  user.roles = roles;
  user.isActive = isActive;

  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await user.save();

  res.status(200).json({ message: `${updatedUser.username} updated.` });
});

// @desc get all users
// @route DELETE /users
// @access private
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "User Id required." });
  }

  const notes = await Note.findOne({ user: id });

  if (notes) {
    return res.status(400).json({ message: "User has assigned notes." });
  }

  const user = await User.findById(id);

  if (!user) return res.status(400).json({ message: "User does not found." });

  const reply = `User with ${user.username} with ID ${user._id} deleted.`;
  await user.deleteOne();

  res.json({ message: reply });
});

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
