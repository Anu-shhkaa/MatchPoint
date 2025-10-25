import mongoose from 'mongoose';

// A "level" is "Winner", "RunnerUp", "SemiFinalist", etc.
const pointLevelSchema = new mongoose.Schema({
  // This is a "rank" for the Joker logic. 
  // Winner = 5, RunnerUp = 4...
  achievementLevel: { type: Number, required: true, unique: true }, 
  levelName: { type: String, required: true, unique: true }, // "Winner"
  points: { type: Number, required: true }      // 200
}, { _id: false });

const pointingSystemSchema = new mongoose.Schema({
  systemName: {
    type: String,
    required: true,
    unique: true, // "Sphurti Point System 2025"
  },
  levels: [pointLevelSchema]
});

// Helper to find points by achievement level
pointingSystemSchema.methods.getPointsForLevel = function(level) {
  const found = this.levels.find(l => l.achievementLevel === level);
  return found ? found.points : 0;
};

const PointingSystem = mongoose.model('PointingSystem', pointingSystemSchema);
export default PointingSystem;

