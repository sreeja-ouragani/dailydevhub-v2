import mongoose from "mongoose";

const streakSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  currentStreak: {
    type: Number,
    default: 0,
  },
  lastUpdated: {
    type: Date,
    default: null,
  },
  longestStreak: {
    type: Number,
    default: 0,
  },
});

const Streak = mongoose.model("Streak", streakSchema);
export default Streak;
