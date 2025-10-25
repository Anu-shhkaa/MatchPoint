import PointsTable from '../models/PointsTable.js';

export const getPointsTableForEvent = async (req, res) => {
  try {
    const pointsTable = await PointsTable.find({ event: req.params.eventId })
      .populate('team') // Get the team names, departments, etc.
      .sort({ totalPoints: -1 }); // Sort by highest points
      
    res.json(pointsTable);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
