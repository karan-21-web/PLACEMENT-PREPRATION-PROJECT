import { 
  registerStudent, 
  authenticateStudent, 
  getUserProfile as fetchUserProfile, 
  updateUserProfile as modifyUserProfile 
} from '../services/authService.js';
import generateToken from '../utils/generateToken.js';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  // Simple input validation
  if (!name || !email || !password) {
    res.status(400);
    return next(new Error('Please provide all required fields: name, email, password'));
  }

  if (password.length < 8) {
    res.status(400);
    return next(new Error('Password must be at least 8 characters long'));
  }

  try {
    const user = await registerStudent(name, email, password);
    const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profile: user.profile,
      token
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    return next(new Error('Please provide email and password'));
  }

  try {
    const user = await authenticateStudent(email, password);
    const token = generateToken(user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profile: user.profile,
      token
    });
  } catch (error) {
    res.status(401);
    next(error);
  }
};

/**
 * @desc    Get user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getUserProfile = async (req, res, next) => {
  try {
    // req.user is already populated by the protect middleware
    const user = await fetchUserProfile(req.user._id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404);
    next(error);
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateUserProfile = async (req, res, next) => {
  const { name, college, branch, targetRoles, targetSalary, graduationYear, preparationStatus } = req.body;

  try {
    const updatedProfile = await modifyUserProfile(req.user._id, {
      name,
      college,
      branch,
      targetRoles,
      targetSalary,
      graduationYear,
      preparationStatus
    });

    res.status(200).json(updatedProfile);
  } catch (error) {
    res.status(400);
    next(error);
  }
};
