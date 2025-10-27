import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createEvent,
  getAllEvents,
  getEventDetails,
  upload
} from '../controllers/eventController.js';

const router = express.Router();

router.route('/')
  .post(protect, upload.single('poster'), createEvent) // Add file upload middleware
  .get(getAllEvents);

router.route('/:id')
  .get(getEventDetails);

export default router;