const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    min: 3,
    max: 255,
  },
  location: {
    type: String,
    required: false,
    min: 6,
    max: 255,
  },
  fixtures: [
    {type: mongoose.Schema.Types.ObjectId, ref: 'Fixture'}
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Team", teamSchema);