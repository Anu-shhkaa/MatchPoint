// routes/eventRoutes.js
import express from 'express';
import {
  createEvent,
  getAllEvents,
  getEventDetails,
  upload
} from '../controllers/eventController.js';

const router = express.Router();

// REMOVED: protect middleware
router.route('/')
  .post(upload.single('poster'), createEvent) // No auth required
  .get(getAllEvents);

router.route('/:id')
  .get(getEventDetails);

export default router;