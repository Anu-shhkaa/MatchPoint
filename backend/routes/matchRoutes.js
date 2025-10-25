import express from 'express';
import {Match} from '../models/Match.js';
import { protect } from '../middleware/authMiddleware.js'; // Import the protection

const router = express.Router();

// --- PUBLIC ROUTE ---
// GET /api/matches
// Get all matches (for viewers)
router.get('/', async (req, res) => {
  try {
    const matches = await Match.find({}).populate('event', 'name'); // Get event name
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching matches' });
  }
});

// --- ADMIN-ONLY ROUTES ---

// POST /api/matches
// Create a new match (protected)
router.post('/', protect, async (req, res) => {
  // Logic to create a new match...
  // const { eventId, teamA, teamB, matchTime } = req.body;
  // const newMatch = new Match({...});
  // await newMatch.save();
  // res.status(201).json(newMatch);
  res.send('Admin route to create a match');
});

// PUT /api/matches/:id/score
// Update a match's score (protected)
router.put('/:id/score', protect, async (req, res) => {
  try {
    const matchId = req.params.id;
    const newScore = req.body.score; // The new score object from the admin panel

    const updatedMatch = await Match.findByIdAndUpdate(
      matchId,
      { 
        score: newScore,
        status: 'live' // Automatically set to live on score update
      },
      { new: true } // Return the updated document
    ).populate('event', 'name');

    if (!updatedMatch) {
      return res.status(404).json({ message: 'Match not found' });
    }

    // --- THIS IS THE REAL-TIME PART ---
    // Get the 'io' instance we attached in server.js
    const io = req.app.get('io');
    // Emit an event to ALL connected clients
    io.emit('scoreUpdated', updatedMatch);
    
    res.json(updatedMatch);

  } catch (error) {
    console.error('Score update error:', error);
    res.status(500).json({ message: 'Error updating score' });
  }
});

// You would add more routes here, e.g., to set status to 'completed'
// PUT /api/matches/:id/complete
// ...

export default router;
