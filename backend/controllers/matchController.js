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
    res.status(201).json(match);
  } catch (error) {
    res.status(400).json({ message: 'Error creating match' });
  }
};

// --- Get All Matches for an Event ---
export const getMatchesForEvent = async (req, res) => {
  try {
    const matches = await Match.find({ event: req.params.eventId })
      .populate('sport')
      .populate('teamA')
      .populate('teamB');
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// --- Admin Clicks "Go Live" ---
export const startMatchLive = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) return res.status(404).json({ message: 'Match not found' });

    match.status = 'live';
    const updatedMatch = await match.save();

    // --- REAL-TIME: Tell everyone this match is now live ---
    const io = req.app.get('io');
    io.emit('matchStarted', updatedMatch);
    
    res.json(updatedMatch);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// --- THIS IS THE MOST IMPORTANT CONTROLLER ---
// Admin Submits Final Result
export const updateMatchResult = async (req, res) => {
  const { winnerTeam, loserTeam, winnerAchievement, loserAchievement, score } = req.body;
  const matchId = req.params.id;
  const io = req.app.get('io');

  try {
    // 1. Find the match, its event, and the sport
    const match = await Match.findById(matchId);
    if (!match) return res.status(404).json({ message: 'Match not found' });
    
    const event = await Event.findById(match.event);
    const sport = await Sport.findById(match.sport);
    const pointingSystem = await PointingSystem.findById(event.pointingSystem);

    // 2. Get the points from the template
    const winnerPoints = pointingSystem.getPointsForLevel(winnerAchievement);
    const loserPoints = pointingSystem.getPointsForLevel(loserAchievement);
    
    // 3. Update the PointsTable for both teams
    const updateWinnerPoints = PointsTable.updateOne(
      { event: event._id, team: winnerTeam },
      {
        $inc: { basePoints: winnerPoints, totalPoints: winnerPoints },
      }
    );
    const updateLoserPoints = PointsTable.updateOne(
      { event: event._id, team: loserTeam },
      {
        $inc: { basePoints: loserPoints, totalPoints: loserPoints },
      }
    );
    await Promise.all([updateWinnerPoints, updateLoserPoints]);

    // 4. (FOR SPHURTI) Update Max Achievement for Joker Logic
    if (event.hasJokerFeature && sport.genderCategory !== 'Mixed') {
      const winnerGender = sport.genderCategory; // "Boys" or "Girls"
      const loserGender = sport.genderCategory;
      
      const updateWinnerMax = PointsTable.updateOne(
        { event: event._id, team: winnerTeam },
        { $max: { [`maxAchievementByGender.${winnerGender}`]: winnerAchievement } }
      );
      const updateLoserMax = PointsTable.updateOne(
        { event: event._id, team: loserTeam },
        { $max: { [`maxAchievementByGender.${loserGender}`]: loserAchievement } }
      );
      await Promise.all([updateWinnerMax, updateLoserMax]);
    }

    // 5. Update the Match document itself
    match.status = 'completed';
    match.result = { winnerTeam, loserTeam, winnerAchievement, loserAchievement, score };
    const updatedMatch = await match.save();

    // 6. --- REAL-TIME: Tell everyone the match is over AND the points table changed ---
    io.emit('matchCompleted', updatedMatch);
    io.emit('pointsTableUpdated', { eventId: event._id });
    
    res.json(updatedMatch);

  } catch (error) {
    console.error('Error updating match result:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
