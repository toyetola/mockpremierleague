const mongoose = require("mongoose");

const fixtureSchema = new mongoose.Schema({
  team1: {
    type: String,
    required: true,
    unique: true,
  },
  team2: {
    type: String,
    required: true,
  },
  team1_score: {
    type: String,
    default: null
  },
  team2_score: {
    type: String,
    default: null
  },
  start_time: {
    type: Date,
    required: true
  },
  end_time: {
    type: Date,
    required: true
  },
  unique_link_id: {
    type: String,
    required: true,
    unique: true
  },
  team: {type: mongoose.Schema.Types.ObjectId, ref: 'Team'}
}, {timestamps:true});

//

module.exports = mongoose.model("Fixture", fixtureSchema);