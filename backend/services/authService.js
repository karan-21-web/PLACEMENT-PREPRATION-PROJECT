import User from '../models/User.js';

/**
 * Register a new student user
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @returns {Object} Created user document
 */
export const registerStudent = async (name, email, password) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new Error('An account with this email address already exists');
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
  });

  return user;
};

/**
 * Authenticate a student and validate credentials
 * @param {string} email
 * @param {string} password
 * @returns {Object} Authenticated user document
 */
export const authenticateStudent = async (email, password) => {
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  return user;
};

/**
 * Fetch user profile by ID (excludes password)
 * @param {string} userId
 * @returns {Object} User profile document
 */
export const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

/**
 * Update user profile fields
 * @param {string} userId
 * @param {Object} profileData - Fields to update
 * @returns {Object} Updated user document
 */
export const updateUserProfile = async (userId, profileData) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Update top-level fields
  if (profileData.name) {
    user.name = profileData.name;
  }

  // Update college and branch
  if (profileData.college !== undefined) {
    user.profile.college = profileData.college;
  }
  if (profileData.branch !== undefined) {
    user.profile.branch = profileData.branch;
  }

  // Update nested profile fields
  if (profileData.targetRoles !== undefined) {
    user.profile.targetRoles = profileData.targetRoles;
  }
  if (profileData.targetSalary !== undefined) {
    user.profile.targetSalary = profileData.targetSalary;
  }
  if (profileData.graduationYear !== undefined) {
    user.profile.graduationYear = profileData.graduationYear;
  }
  if (profileData.preparationStatus !== undefined) {
    user.profile.preparationStatus = profileData.preparationStatus;
  }

  const updatedUser = await user.save();

  // Return without password
  const userObj = updatedUser.toObject();
  delete userObj.password;
  return userObj;
};
