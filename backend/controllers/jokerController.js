import { parseJokerExcel } from '../utils/excelParser.js'; // <-- IMPORT THE PARSER
import JokerSubmission from '../models/JokerSubmission.js';
import Team from '../models/Team.js';
import Sport from '../models/Sport.js';
import PointsTable from '../models/PointsTable.js';
import PointingSystem from '../models/PointingSystem.js';
import Event from '../models/Event.js';
import { Match } from '../models/Match.js';

// --- Step 1: Admin Uploads Excel File ---
export const uploadJokerSubmissions = async (req, res) => {
  const eventId = req.params.eventId;
  const filePath = req.file.path; // Path from multer

  try {
    // 1. Parse the file using our new utility
    const rows = await parseJokerExcel(filePath); 
    // rows = [{ teamName: 'IT', boysJokerSport: 'Chess', ... }, ...]

    // 2. Process rows and map names to DB IDs
    // (This logic is much cleaner now)
    const submissions = await Promise.all(rows.map(async (row) => {
      const team = await Team.findOne({ name: row.teamName });
      const boysJokerSport = row.boysJokerSport ? await Sport.findOne({ name: row.boysJokerSport }) : null;
      const girlsJokerSport = row.girlsJokerSport ? await Sport.findOne({ name: row.girlsJokerSport }) : null;

      if (!team) throw new Error(`Team not found: ${row.teamName}`);

      return {
        event: eventId,
        team: team._id,
        boysJokerSport: boysJokerSport ? boysJokerSport._id : null,
        girlsJokerSport: girlsJokerSport ? girlsJokerSport._id : null,
      };
    }));

    // 3. Clear old submissions and insert new ones
    await JokerSubmission.deleteMany({ event: eventId });
    await JokerSubmission.insertMany(submissions);

    res.json({ message: 'Joker submissions uploaded successfully.' });
  } catch (error) {
    res.status(400).json({ message: 'Error processing file', error: error.message });
  }
};

// --- Step 2: Admin Clicks "Run Final Calculation" ---
// (This function remains exactly the same as before)
export const runJokerCalculation = async (req, res) => {
  const eventId = req.params.eventId;
  const io = req.app.get('io');
  
  try {
    const submissions = await JokerSubmission.find({ event: eventId });
    const event = await Event.findById(eventId).populate('pointingSystem');
    const pointingSystem = event.pointingSystem;
    
    let jokerPointsApplied = 0;

    for (const sub of submissions) {
      const pointsTableEntry = await PointsTable.findOne({ event: eventId, team: sub.team });
      if (!pointsTableEntry) continue; // Skip if team isn't in the points table
      
      let extraPoints = 0;
      
      // --- Process Boys Joker ---
      if (sub.boysJokerSport) {
        const jokerSport = await Sport.findById(sub.boysJokerSport);
        
        // Find the team's achievement in their joker sport
        const jokerMatch = await Match.findOne({
          event: eventId,
          sport: sub.boysJokerSport,
          $or: [{ 'result.winnerTeam': sub.team }, { 'result.loserTeam': sub.team }]
        });
        
        const jokerAchievement = jokerMatch ?
          (jokerMatch.result.winnerTeam.equals(sub.team) ? jokerMatch.result.winnerAchievement : jokerMatch.result.loserAchievement)
          : 0;
        
        const maxAchievement = pointsTableEntry.maxAchievementByGender.Boys;

        // --- THE JOKER LOGIC ---
        if (jokerAchievement > 0 && jokerAchievement >= maxAchievement) {
          const points = pointingSystem.getPointsForLevel(jokerAchievement);
          extraPoints += points; // Add the bonus points
          sub.boysJokerConverted = true;
          jokerPointsApplied++;
        }
      }

      // --- Process Girls Joker (Same logic) ---
      if (sub.girlsJokerSport) {
        const jokerSport = await Sport.findById(sub.girlsJokerSport);
        
        const jokerMatch = await Match.findOne({
          event: eventId,
          sport: sub.girlsJokerSport,
          $or: [{ 'result.winnerTeam': sub.team }, { 'result.loserTeam': sub.team }]
        });
        
        const jokerAchievement = jokerMatch ?
          (jokerMatch.result.winnerTeam.equals(sub.team) ? jokerMatch.result.winnerAchievement : jokerMatch.result.loserAchievement)
          : 0;
          
        const maxAchievement = pointsTableEntry.maxAchievementByGender.Girls;

        // --- THE JOKER LOGIC ---
        if (jokerAchievement > 0 && jokerAchievement >= maxAchievement) {
          const points = pointingSystem.getPointsForLevel(jokerAchievement);
          extraPoints += points;
          sub.girlsJokerConverted = true;
          jokerPointsApplied++;
        }
      }
      
      // --- Update the Points Table and JokerSubmission ---
      if (extraPoints > 0) {
        pointsTableEntry.jokerPoints += extraPoints;
        pointsTableEntry.totalPoints += extraPoints;
        await pointsTableEntry.save();
      }
      await sub.save();
    }
    
    // --- REAL-TIME: Tell everyone the FINAL table is ready! ---
    io.emit('pointsTableUpdated', { eventId: eventId, final: true });

    res.json({ message: `Joker logic applied. ${jokerPointsApplied} jokers were converted.` });
  } catch (error) {
    console.error('Error running joker calculation:', error);
    // --- THIS IS THE FIX ---
    res.status(500).json({ message: 'Server Error' });
  }
};

