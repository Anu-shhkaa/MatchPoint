import express from 'express';
// 1. Import the *controller function* that has the logic
import { verifyAdminCode } from '../controllers/authController.js'; 

const router = express.Router();

// 2. Tell the router: When a POST request comes to '/verify-code', 
//    run the 'verifyAdminCode' function from the controller.
router.post('/verify-code', verifyAdminCode);

// --- DELETE THE EXTRA CODE YOU ADDED BELOW THIS LINE ---

export default router;
