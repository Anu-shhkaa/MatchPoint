import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createEvent,
  getAllEvents,
  getEventDetails,
} from '../controllers/eventController.js';

const router = express.Router();

router.route('/')
  .post(protect, createEvent) // Admin creates a new event
  .get(getAllEvents);         // Viewers get list of all events

router.route('/:id')
  .get(getEventDetails);     // Viewers get details for one event

export default router;
