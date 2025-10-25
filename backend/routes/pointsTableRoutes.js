import express from 'express';
import { getPointsTableForEvent } from '../controllers/pointsTableController.js';

const router = express.Router();

// Get the sorted points table for one event
router.route('/event/:eventId')
  .get(getPointsTableForEvent);

export default router;
