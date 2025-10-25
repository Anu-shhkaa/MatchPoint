import mongoose from 'mongoose';

// This stores the live points for each team in each event
const pointsTableSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  },
  basePoints: {
    type: Number,
    default: 0,
  },
  jokerPoints: {
    type: Number,
    default: 0,
  },
  totalPoints: {
    type: Number,
    default: 0,
  },
  // We need to track each team's max achievement for the Joker logic
  maxAchievementByGender: {
    Boys: { type: Number, default: 0 }, // 5, 4, 3...
    Girls: { type: Number, default: 0 }
  }
});

// One entry per team per event
pointsTableSchema.index({ event: 1, team: 1 }, { unique: true });

const PointsTable = mongoose.model('PointsTable', pointsTableSchema);
export default PointsTable;
