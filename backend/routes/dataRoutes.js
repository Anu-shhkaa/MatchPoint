import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createSport,
  getSports,
  createTeam,
  getTeams,
  createPointingSystem,
  getPointingSystems,
} from '../controllers/dataController.js'; // It uses your dataController.js

const router = express.Router();

// --- Sport Routes ---
router.route('/sports')
  .post(protect, createSport) // Admin creates a new sport
  .get(getSports);            // Anyone can get the list of sports

// --- Team Routes ---
router.route('/teams')
  .post(protect, createTeam) // Admin creates a new team (Franchise or Dept)
  .get(getTeams);           // Anyone can get the list of teams

// --- Pointing System Routes ---
router.route('/pointing-systems')
  .post(protect, createPointingSystem) // Admin creates a new points template
  .get(getPointingSystems);           // Admin can get list of templates

export default router;

