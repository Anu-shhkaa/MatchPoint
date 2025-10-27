import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const verifyAdminCode = (req, res) => {
  const { secretCode } = req.body;

  if (!secretCode) {
    return res.status(400).json({ message: 'Please provide the admin secret code' });
  }

  console.log("Code from browser:", secretCode);
  console.log("Code expected from .env:", process.env.ADMIN_SECRET_CODE);

  if (secretCode === process.env.ADMIN_SECRET_CODE) {
    // ✅ FIX: Add user ID to JWT token
    const token = jwt.sign(
      { 
        id: '68fde9c80da7ac2dc38864d8', // ✅ ADD THIS LINE - user ID for createdBy
        isAdmin: true,                   // ✅ KEEP this line
      }, 
      process.env.JWT_SECRET,
      { 
        expiresIn: '8h'
      }
    );

    console.log('🔐 JWT token created with user ID');

    res.json({
      message: 'Authentication successful',
      token: token,
    });

  } else {
    return res.status(401).json({ message: 'Invalid secret code. Access denied.' });
  }
};