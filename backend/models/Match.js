import mongoose from 'mongoose';

// Define achievement levels
const achievementLevels = {
  NotApplicable: 0,
  Participation: 1,
  QuarterFinalist: 2,
  SemiFinalist: 3,
  RunnerUp: 4,
  Winner: 5
};

const matchSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  sport: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sport',
    required: true,
  },
  teamA: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  },
  teamB: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  },
  status: {
    type: String,
    enum: ['scheduled', 'live', 'completed'],
    default: 'scheduled',
  },
  // Structured result for calculations
  result: {
    winnerTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    loserTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    winnerAchievement: { type: Number, default: 0 }, // 5, 4, 3...
    loserAchievement: { type: Number, default: 0 },
    score: { type: String } // "2-1"
  }
}, { timestamps: true });

const Match = mongoose.model('Match', matchSchema);
// Export the levels so we can use them elsewhere in our code
export { Match, achievementLevels };

