const express = require("express");
const Note = require("../models/Note");
const asyncHandler = require("express-async-handler");

// @desc get all notes
// @route GET /notes
// @access private
const getAllNotes = asyncHandler(async (req, res) => {
  const notes = Note.find().sort({ createAt: -1 });
  if (!notes || notes.length === 0) {
    return res.status(400).json({ message: "No notes found." });
  }
  res.json({ data: notes });
});

module.exports = {
  getAllNotes,
};
