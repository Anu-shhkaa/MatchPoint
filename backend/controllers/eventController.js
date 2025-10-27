import Event from '../models/Event.js';
import PointsTable from '../models/PointsTable.js';
import multer from 'multer';
import path from 'path';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/events/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'event-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Create Event
const createEvent = async (req, res) => {
  try {
    console.log('Creating event with data:', req.body);
    console.log('Uploaded file:', req.file);
    console.log('User from auth:', req.user);
    
    let posterPath = '';
    
    if (req.file) {
      posterPath = '/uploads/events/' + req.file.filename;
      console.log('Poster saved at:', posterPath);
    }

    const eventData = {
      name: req.body.name,
      eventType: req.body.eventType,
      sports: Array.isArray(req.body.sports) ? req.body.sports : JSON.parse(req.body.sports || '[]'),
      teams: Array.isArray(req.body.teams) ? req.body.teams : JSON.parse(req.body.teams || '[]'),
      pointingSystem: req.body.pointingSystem,
      hasJokerFeature: req.body.hasJokerFeature === 'true',
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      description: req.body.description || '',
      location: req.body.location || '',
      poster: posterPath,
      createdBy: req.user.id
    };

    console.log('Final event data to save:', eventData);

    const event = new Event(eventData);
    const newEvent = await event.save();
    console.log('Event created successfully:', newEvent._id);

    // Create PointsTable entries for teams
    if (eventData.teams && eventData.teams.length > 0) {
      const pointsTableEntries = eventData.teams.map(teamId => ({
        event: newEvent._id,
        team: teamId,
        points: 0,
        matchesPlayed: 0,
        wins: 0,
        losses: 0,
        draws: 0
      }));
      await PointsTable.insertMany(pointsTableEntries);
      console.log('Points table entries created for', pointsTableEntries.length, 'teams');
    }
    
    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(400).json({ message: 'Error creating event', error: error.message });
  }
};

// Get All Events
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('sports')
      .populate('teams')
      .populate('pointingSystem')
      .populate('createdBy', 'name email');
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get Event Details
const getEventDetails = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('sports')
      .populate('teams')
      .populate('pointingSystem')
      .populate('createdBy', 'name email');
      
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error('Error fetching event details:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Export all functions
export { 
  upload,
  createEvent,
  getAllEvents, 
  getEventDetails 
};