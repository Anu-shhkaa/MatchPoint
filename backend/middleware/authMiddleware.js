import jwt from 'jsonwebtoken';

// This function will be used to protect admin routes
export const protect = (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      // Get token from header (e.g., "Bearer <token>")
      token = authHeader.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // We just need to know they are an admin.
      // req.user = decoded; // You could attach user info here if needed
      
      if (decoded.isAdmin) {
        next(); // They are authorized, proceed to the route
      } else {
        throw new Error('Not authorized');
      }
    } catch (error) {
      console.error('Token verification failed:', error.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};
