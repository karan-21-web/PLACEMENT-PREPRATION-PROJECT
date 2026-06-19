import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile,
  googleAuth
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate, authValidator } from '../middleware/validationMiddleware.js';

const router = express.Router();

// Public routes with rate limits and schema validations
router.post('/register', validate(authValidator.register), registerUser);
router.post('/login', validate(authValidator.login), loginUser);
// Google sign-in: receives basic profile from Firebase client and returns JWT
router.post('/google', googleAuth);

// Protected routes with token validation and schema checks
router.get('/me', protect, getUserProfile);
router.put('/profile', protect, validate(authValidator.updateProfile), updateUserProfile);

export default router;
