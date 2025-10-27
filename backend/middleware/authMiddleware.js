import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      // Get token from header
      token = authHeader.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ✅ FIX: Set req.user with the decoded token data
      req.user = decoded;
      
      console.log('🔐 User from token:', req.user);

      if (decoded.isAdmin) {
        next(); // They are authorized, proceed to the route
      } else {
        throw new Error('Not authorized as admin');
      }
    } catch (error) {
      console.error('Token verification failed:', error.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    if (!token) {
      res.status(401).json({ message: 'Not authorized, no token' });
    }
  }
};