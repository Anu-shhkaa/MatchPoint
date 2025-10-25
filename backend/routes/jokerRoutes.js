import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  uploadJokerSubmissions,
  runJokerCalculation,
} from '../controllers/jokerController.js';
import multer from 'multer';

// Set up Multer for file uploads
// We'll just save it to a temp 'uploads' folder
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

// Admin uploads the Excel file
router.route('/:eventId/upload')
  .post(protect, upload.single('jokerFile'), uploadJokerSubmissions);

// Admin clicks the "Run Final Calculation" button
router.route('/:eventId/calculate')
  .post(protect, runJokerCalculation);

export default router;
