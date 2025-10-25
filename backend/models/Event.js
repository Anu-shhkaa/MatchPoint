import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // "Indoor Sphurti 2025"
  },
  eventType: {
    type: String, // "Sphurti", "VCL"
  },
  sports: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sport'
  }],
  teams: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  }],
  pointingSystem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PointingSystem',
    required: true,
  },
  hasJokerFeature: {
    type: Boolean,
    default: false,
  },
  // ... poster, dates ...
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);
export default Event;

