import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  
  teamType: {
    type: String,
    enum: ['Department', 'Franchise'],
    required: true,
    default: 'Department',
  },

  // This is for 'Department' teams like "IT", "COMPS"
  department: {
    type: String, 
  },

  // --- NEW FIELDS FOR VPL/VCL ("Franchise" teams) ---
  
  // We link a franchise team to a specific event.
  // This lets us have "IT Strikers 2024" and "IT Strikers 2025" as two separate teams.
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    // This is only required if the teamType is 'Franchise'
    required: function() { return this.teamType === 'Franchise'; }
  },
  
  // You mentioned captains. Let's add them.
  captain: {
    type: String,
  },
  
  // You mentioned bidding and players. Let's add a roster.
  players: [{
    type: String, // An array of player names
  }]
});

// This ensures we can't have two teams with the SAME name in the SAME event.
// But it allows "IT Strikers" in VPL 2024 and "IT Strikers" in VPL 2025.
teamSchema.index({ name: 1, event: 1 }, { unique: true });

const Team = mongoose.model('Team', teamSchema);
export default Team;

