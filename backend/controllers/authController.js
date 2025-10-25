import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * @desc    Verify the admin secret code and generate a JWT
 * @route   POST /api/auth/verify-code
 * @access  Public
 */
export const verifyAdminCode = (req, res) => {
  const { secretCode } = req.body;

  // 1. Check if the secret code was provided
  if (!secretCode) {
    return res.status(400).json({ message: 'Please provide the admin secret code' });
  }

  // 2. Compare the provided code with the one in your .env file
  if (secretCode === process.env.ADMIN_SECRET_CODE) {
    // 3. If they match, create a JWT (the "hand-stamp")
    const token = jwt.sign(
      { 
        isAdmin: true,
        // You can add more data here if you want, e.g., a user ID
      }, 
      process.env.JWT_SECRET, // Sign it with your invisible ink
      { 
        expiresIn: '8h' // Token lasts for 8 hours
      }
    );

    // 4. Send the token back to the frontend
    res.json({
      message: 'Authentication successful',
      token: token,
    });

  } else {
    // 5. If codes do NOT match, send an "Unauthorized" error
    return res.status(401).json({ message: 'Invalid secret code. Access denied.' });
  }
};
