import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  // Check if token exists in authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from Bearer prefix
      token = req.headers.authorization.split(' ')[1];

      // Verify and decode JWT token payload
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user in database, exclude password field, and attach to request scope
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        res.status(401);
        throw new Error('User not found. Authorization failed.');
      }

      next();
    } catch (error) {
      console.error(`[Auth Middleware] Verification error: ${error.message}`);
      res.status(401);
      next(new Error('Not authorized, token validation failed'));
    }
  } else {
    res.status(401);
    next(new Error('Not authorized, access token missing'));
  }
};
