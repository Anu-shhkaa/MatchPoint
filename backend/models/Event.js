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
    ref: 'Sport',
    // required: true 
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
  description: {  // Add missing fields
    type: String,
  }, startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  location: {
    type: String,
  },
  poster: {  // Add this missing field
    type: String,
  },
  // createdBy: {  // Add createdBy field
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User',
  //   //required: true
  // }
  // ... poster, dates ...
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);
export default Event;

