import mongoose from 'mongoose';

const jokerSubmissionSchema = new mongoose.Schema({
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
  boysJokerSport: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sport',
  },
  girlsJokerSport: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sport',
  },
  // We update these after running the logic
  boysJokerConverted: {
    type: Boolean,
    default: false,
  },
  girlsJokerConverted: {
    type: Boolean,
    default: false,
  }
});

jokerSubmissionSchema.index({ event: 1, team: 1 }, { unique: true });

const JokerSubmission = mongoose.model('JokerSubmission', jokerSubmissionSchema);
export default JokerSubmission;
