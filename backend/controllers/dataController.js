import Sport from '../models/Sport.js';
import Team from '../models/Team.js';
import PointingSystem from '../models/PointingSystem.js';

// --- Sport Controller ---
export const createSport = async (req, res) => {
  try {
    const { name, genderCategory } = req.body;
    const sport = new Sport({ name, genderCategory });
    await sport.save();
    res.status(201).json(sport);
  } catch (error) {
    res.status(400).json({ message: 'Error creating sport', error: error.message });
  }
};

export const getSports = async (req, res) => {
  try {
    const sports = await Sport.find();
    res.json(sports);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// --- Team Controller ---
export const createTeam = async (req, res) => {
  try {
    // We expect all fields from the Team model
    const team = new Team(req.body);
    await team.save();
    res.status(201).json(team);
  } catch (error) {
    res.status(400).json({ message: 'Error creating team', error: error.message });
  }
};

export const getTeams = async (req, res) => {
  try {
    // You can filter here, e.g. /api/data/teams?type=Department
    const filter = req.query.type ? { teamType: req.query.type } : {};
    const teams = await Team.find(filter);
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// --- Pointing System Controller ---
export const createPointingSystem = async (req, res) => {
  try {
    // We expect systemName and an array of levels
    const system = new PointingSystem(req.body);
    await system.save();
    res.status(201).json(system);
  } catch (error) {
    res.status(400).json({ message: 'Error creating pointing system', error: error.message });
  }
};

export const getPointingSystems = async (req, res) => {
  try {
    const systems = await PointingSystem.find();
    res.json(systems);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
