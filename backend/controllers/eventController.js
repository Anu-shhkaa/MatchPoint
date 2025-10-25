import Event from '../models/Event.js';
import PointsTable from '../models/PointsTable.js';

export const createEvent = async (req, res) => {
  try {
    const event = new Event(req.body);
    const newEvent = await event.save();

    // --- CRITICAL LOGIC ---
    // When an event is created, automatically create the
    // empty PointsTable entries for all participating teams.
    const pointsTableEntries = req.body.teams.map(teamId => ({
      event: newEvent._id,
      team: teamId,
    }));
    await PointsTable.insertMany(pointsTableEntries);
    
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ message: 'Error creating event', error: error.message });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('sports').populate('pointingSystem');
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getEventDetails = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('sports')
      .populate('teams')
      .populate('pointingSystem');
      
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
