import { Match, achievementLevels } from '../models/Match.js';
import Event from '../models/Event.js';
import PointingSystem from '../models/PointingSystem.js';
import PointsTable from '../models/PointsTable.js';
import Sport from '../models/Sport.js';

// --- Create a Match ---
export const createMatch = async (req, res) => {
  try {
    const match = new Match(req.body);
    await match.save();
    
    // Populate the response
    await match.populate('event teamA teamB sport');
    
    res.status(201).json(match);
  } catch (error) {
    console.error('Error creating match:', error);
    res.status(400).json({ 
      message: 'Error creating match', 
      error: error.message 
    });
  }
};

// --- Get All Matches for an Event ---
export const getMatchesForEvent = async (req, res) => {
  try {
    const matches = await Match.find({ event: req.params.eventId })
      .populate('sport')
      .populate('teamA')
      .populate('teamB')
      .populate('event');
    
    res.json(matches);
  } catch (error) {
    console.error('Error fetching matches for event:', error);
    res.status(500).json({ 
      message: 'Server Error', 
      error: error.message 
    });
  }
};

// --- Admin Clicks "Go Live" ---
export const startMatchLive = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) return res.status(404).json({ message: 'Match not found' });

    match.status = 'live';
    const updatedMatch = await match.save();

    // WebSocket broadcast
    const io = req.app.get('io');
    io.emit('matchStarted', updatedMatch);
    
    res.json(updatedMatch);
  } catch (error) {
    console.error('Error starting match live:', error);
    res.status(500).json({ 
      message: 'Server Error', 
      error: error.message 
    });
  }
};

// --- Update Match Result ---
export const updateMatchResult = async (req, res) => {
  const { winnerTeam, loserTeam, winnerAchievement, loserAchievement, score } = req.body;
  const matchId = req.params.id;

  try {
    // 1. Find the match
    const match = await Match.findById(matchId);
    if (!match) return res.status(404).json({ message: 'Match not found' });
    
    const event = await Event.findById(match.event);
    const sport = await Sport.findById(match.sport);
    const pointingSystem = await PointingSystem.findById(event.pointingSystem);

    // 2. Get points from pointing system (adjust based on your structure)
    const winnerPoints = pointingSystem?.points?.win || 2;
    const loserPoints = pointingSystem?.points?.loss || 0;

    // 3. Update PointsTable for both teams
    const updateWinnerPoints = PointsTable.updateOne(
      { event: event._id, team: winnerTeam },
      {
        $inc: { 
          points: winnerPoints,
          matchesPlayed: 1,
          wins: 1
        },
      }
    );
    
    const updateLoserPoints = PointsTable.updateOne(
      { event: event._id, team: loserTeam },
      {
        $inc: { 
          points: loserPoints,
          matchesPlayed: 1,
          losses: 1
        },
      }
    );
    
    await Promise.all([updateWinnerPoints, updateLoserPoints]);

    // 4. Update the Match
    match.status = 'completed';
    match.result = { winnerTeam, loserTeam, winnerAchievement, loserAchievement, score };
    const updatedMatch = await match.save();

    // 5. WebSocket broadcast
    const io = req.app.get('io');
    io.emit('matchCompleted', updatedMatch);
    io.emit('pointsTableUpdated', { eventId: event._id });
    
    res.json(updatedMatch);

  } catch (error) {
    console.error('Error updating match result:', error);
    res.status(500).json({ 
      message: 'Server Error', 
      error: error.message 
    });
  }
};