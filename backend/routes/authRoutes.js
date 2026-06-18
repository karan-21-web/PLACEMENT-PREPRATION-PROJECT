import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile 
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate, authValidator } from '../middleware/validationMiddleware.js';

const router = express.Router();

// Public routes with rate limits and schema validations
router.post('/register', validate(authValidator.register), registerUser);
router.post('/login', validate(authValidator.login), loginUser);

// Protected routes with token validation and schema checks
router.get('/me', protect, getUserProfile);
router.put('/profile', protect, validate(authValidator.updateProfile), updateUserProfile);

export default router;
