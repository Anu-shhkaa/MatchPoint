import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createMatch,
  getMatchesForEvent,
  startMatchLive,
  updateMatchResult
} from '../controllers/matchController.js';
import { Match } from '../models/Match.js';

const router = express.Router();
// GET /api/matches - Get all matches with filters
router.get('/', async (req, res) => {
  try {
    const { status, limit, sort } = req.query;
    
    console.log('📡 Fetching matches with filters:', { status, limit, sort });

    let filter = {};
    if (status) {
      filter.status = status;
    }

    let query = Match.find(filter)
      .populate('event', 'name')  // Populate event name
      .populate('teamA', 'name')  // Populate teamA name
      .populate('teamB', 'name')  // Populate teamB name
      .populate('sport', 'name genderCategory'); // Populate sport with more fields

    if (sort === 'desc') {
      query = query.sort({ createdAt: -1 });
    } else {
      query = query.sort({ createdAt: 1 });
    }

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const matches = await query;
    console.log(`✅ Found ${matches.length} matches`);
    
    // Debug: Log first match to see populated data
    if (matches.length > 0) {
      console.log('🔍 Sample match after population:', {
        id: matches[0]._id,
        teamA: matches[0].teamA,
        teamB: matches[0].teamB,
        sport: matches[0].sport
      });
    }
    
    res.json(matches);

  } catch (error) {
    console.error('❌ Error fetching matches:', error);
    res.status(500).json({ 
      message: 'Error fetching matches', 
      error: error.message 
    });
  }
});

// --- PUBLIC ROUTES ---
// GET /api/matches - Get all matches with filters
// ✅ ADD THIS ROUTE IMMEDIATELY - PUT IT AT THE TOP
router.get('/:id', async (req, res) => {
  try {
    console.log('📡 Fetching match by ID:', req.params.id);
    const match = await Match.findById(req.params.id)
      .populate('event')
      .populate('teamA')
      .populate('teamB')
      .populate('sport');

    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    console.log(`✅ Found match: ${match._id}`);
    res.json(match);

  } catch (error) {
    console.error('❌ Error fetching match:', error);
    res.status(500).json({ 
      message: 'Error fetching match', 
      error: error.message 
    });
  }
});
router.get('/', async (req, res) => {
  try {
    const { status, limit, sort } = req.query;
    
    console.log('📡 Fetching matches with filters:', { status, limit, sort });

    let filter = {};
    if (status) {
      filter.status = status;
    }

    let query = Match.find(filter)
      .populate('event', 'name')
      .populate('teamA', 'name')
      .populate('teamB', 'name')
      .populate('sport', 'name');

    if (sort === 'desc') {
      query = query.sort({ createdAt: -1 });
    } else {
      query = query.sort({ createdAt: 1 });
    }

    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const matches = await query;
    console.log(`✅ Found ${matches.length} matches`);
    res.json(matches);

  } catch (error) {
    console.error('❌ Error fetching matches:', error);
    res.status(500).json({ 
      message: 'Error fetching matches', 
      error: error.message 
    });
  }
});

// ✅ ADD THIS ROUTE: GET /api/matches/:id - Get single match by ID
router.get('/:id', async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate('event')
      .populate('teamA')
      .populate('teamB')
      .populate('sport');

    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    console.log(`✅ Found match: ${match._id}`);
    res.json(match);

  } catch (error) {
    console.error('❌ Error fetching match:', error);
    res.status(500).json({ 
      message: 'Error fetching match', 
      error: error.message 
    });
  }
});

// GET /api/matches/by-event/:eventId - Get matches by event
router.get('/by-event/:eventId', getMatchesForEvent);

// --- ADMIN-ONLY ROUTES ---
// POST /api/matches - Create a new match
router.post('/', protect, createMatch);

// PUT /api/matches/:id/live - Start match live (WebSocket)
router.put('/:id/live', protect, startMatchLive);

// PUT /api/matches/:id/result - Update match result (WebSocket)
router.put('/:id/result', protect, updateMatchResult);

// PUT /api/matches/:id/score - Update match score (WebSocket)
router.put('/:id/score', protect, async (req, res) => {
  try {
    const matchId = req.params.id;
    const newScore = req.body.score;

    const updatedMatch = await Match.findByIdAndUpdate(
      matchId,
      { 
        score: newScore,
        status: 'live'
      },
      { new: true }
    )
    .populate('event', 'name')
    .populate('teamA', 'name')
    .populate('teamB', 'name');

    if (!updatedMatch) {
      return res.status(404).json({ message: 'Match not found' });
    }

    const io = req.app.get('io');
    io.emit('scoreUpdated', updatedMatch);
    
    res.json(updatedMatch);

  } catch (error) {
    console.error('Score update error:', error);
    res.status(500).json({ message: 'Error updating score', error: error.message });
  }
});

export default router;