import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Your "Secret Code" Login
router.post('/verify-code', (req, res) => {
  const { code } = req.body;

  if (code === process.env.ADMIN_SECRET_CODE) {
    // Code is correct! Generate a JWT.
    const token = jwt.sign(
      { isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: '8h' } // Token lasts for 8 hours
    );
    
    res.json({ success: true, token });
  } else {
    // Code is incorrect
    res.status(401).json({ success: false, message: 'Invalid access code' });
  }
});

export default router;
