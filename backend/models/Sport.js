import mongoose from 'mongoose';

const sportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // "Chess"
  },
  genderCategory: {
    type: String,
    enum: ['Boys', 'Girls', 'Mixed'],
    required: true,
  },
});

const Sport = mongoose.model('Sport', sportSchema);
export default Sport;

