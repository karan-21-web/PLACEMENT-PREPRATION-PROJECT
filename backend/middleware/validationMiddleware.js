import { validationResult, body } from 'express-validator';

// Centralized runner for express-validator chains
export const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validations in parallel
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Format errors array and pipe it to response
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    return res.status(400).json({
      message: 'Input validation failed',
      errors: formattedErrors,
    });
  };
};

// Common reusable validation schemas
export const authValidator = {
  register: [
    body('name')
      .trim()
      .notEmpty().withMessage('Name is required')
      .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email')
      .trim()
      .notEmpty().withMessage('Email address is required')
      .isEmail().withMessage('Please provide a valid email address')
      .normalizeEmail(),
    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
      .matches(/\d/).withMessage('Password must contain at least one number')
      .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter'),
  ],
  login: [
    body('email')
      .trim()
      .notEmpty().withMessage('Email address is required')
      .isEmail().withMessage('Please provide a valid email address'),
    body('password')
      .notEmpty().withMessage('Password is required'),
  ],
  updateProfile: [
    body('name')
      .optional()
      .trim()
      .notEmpty().withMessage('Name cannot be empty')
      .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('college')
      .optional()
      .trim(),
    body('branch')
      .optional()
      .trim(),
    body('targetRoles')
      .optional()
      .isArray().withMessage('Target roles must be an array of strings'),
    body('targetSalary')
      .optional()
      .isNumeric().withMessage('Target salary must be a number representing LPA')
      .custom(val => val >= 0).withMessage('Target salary cannot be negative'),
    body('graduationYear')
      .optional()
      .isInt({ min: 2000, max: 2100 }).withMessage('Please enter a valid graduation year'),
    body('preparationStatus')
      .optional()
      .isIn(['Just Starting', 'Intermediate', 'Ready']).withMessage('Invalid preparation status'),
  ]
};

// Company validator schemas for Phase 3
export const companyValidator = {
  create: [
    body('name')
      .trim()
      .notEmpty().withMessage('Company name is required'),
    body('role')
      .trim()
      .notEmpty().withMessage('Job role is required'),
    body('packageLpa')
      .optional()
      .isNumeric().withMessage('Package must be a number representing LPA')
      .custom(val => val >= 0).withMessage('Package cannot be negative'),
    body('status')
      .optional()
      .isIn(['wishlist', 'applied', 'preparing', 'interviewing', 'offered', 'rejected'])
      .withMessage('Invalid company pipeline status'),
    body('aptitudeStatus')
      .optional()
      .isIn(['pending', 'completed', 'failed', 'n/a'])
      .withMessage('Invalid aptitude status'),
    body('dsaStatus')
      .optional()
      .isIn(['pending', 'completed', 'failed', 'n/a'])
      .withMessage('Invalid DSA status'),
    body('resumeStatus')
      .optional()
      .isIn(['pending', 'submitted', 'shortlisted', 'rejected'])
      .withMessage('Invalid resume status'),
    body('interviewStatus')
      .optional()
      .isIn(['pending', 'round_1', 'round_2', 'hr', 'completed'])
      .withMessage('Invalid interview status'),
    body('applicationLink')
      .optional()
      .trim(),
    body('notes')
      .optional()
      .trim(),
    body('interviewDate')
      .optional()
      .custom(val => !val || !isNaN(Date.parse(val))).withMessage('Please enter a valid interview date')
  ],
  update: [
    body('name')
      .optional()
      .trim()
      .notEmpty().withMessage('Company name cannot be empty'),
    body('role')
      .optional()
      .trim()
      .notEmpty().withMessage('Job role cannot be empty'),
    body('packageLpa')
      .optional()
      .isNumeric().withMessage('Package must be a number')
      .custom(val => val >= 0).withMessage('Package cannot be negative'),
    body('status')
      .optional()
      .isIn(['wishlist', 'applied', 'preparing', 'interviewing', 'offered', 'rejected'])
      .withMessage('Invalid pipeline status'),
    body('aptitudeStatus')
      .optional()
      .isIn(['pending', 'completed', 'failed', 'n/a']),
    body('dsaStatus')
      .optional()
      .isIn(['pending', 'completed', 'failed', 'n/a']),
    body('resumeStatus')
      .optional()
      .isIn(['pending', 'submitted', 'shortlisted', 'rejected']),
    body('interviewStatus')
      .optional()
      .isIn(['pending', 'round_1', 'round_2', 'hr', 'completed']),
    body('applicationLink')
      .optional()
      .trim(),
    body('notes')
      .optional()
      .trim(),
    body('interviewDate')
      .optional()
      .custom(val => !val || !isNaN(Date.parse(val))).withMessage('Please enter a valid date')
  ]
};

// DSA Problem validator schemas for Phase 4
export const dsaValidator = {
  create: [
    body('title')
      .trim()
      .notEmpty().withMessage('Problem title is required'),
    body('difficulty')
      .notEmpty().withMessage('Difficulty level is required')
      .isIn(['Easy', 'Medium', 'Hard']).withMessage('Difficulty must be Easy, Medium, or Hard'),
    body('topic')
      .notEmpty().withMessage('Topic category is required')
      .isIn([
        'Arrays', 'Strings', 'Linked List', 'Trees', 'Graphs',
        'DP', 'Greedy', 'Backtracking', 'Sorting', 'Searching',
        'Stack', 'Queue', 'Hashing', 'Math', 'Bit Manipulation', 'Other'
      ]).withMessage('Invalid topic category'),
    body('platform')
      .notEmpty().withMessage('Platform is required')
      .isIn(['LeetCode', 'GFG', 'Coding Ninjas', 'Codeforces', 'HackerRank', 'Other'])
      .withMessage('Invalid platform'),
    body('notes')
      .optional()
      .trim(),
    body('link')
      .optional()
      .trim(),
    body('solvedAt')
      .optional()
      .custom(val => !val || !isNaN(Date.parse(val))).withMessage('Please enter a valid date')
  ],
  update: [
    body('title')
      .optional()
      .trim()
      .notEmpty().withMessage('Problem title cannot be empty'),
    body('difficulty')
      .optional()
      .isIn(['Easy', 'Medium', 'Hard']).withMessage('Difficulty must be Easy, Medium, or Hard'),
    body('topic')
      .optional()
      .isIn([
        'Arrays', 'Strings', 'Linked List', 'Trees', 'Graphs',
        'DP', 'Greedy', 'Backtracking', 'Sorting', 'Searching',
        'Stack', 'Queue', 'Hashing', 'Math', 'Bit Manipulation', 'Other'
      ]).withMessage('Invalid topic category'),
    body('platform')
      .optional()
      .isIn(['LeetCode', 'GFG', 'Coding Ninjas', 'Codeforces', 'HackerRank', 'Other'])
      .withMessage('Invalid platform'),
    body('notes')
      .optional()
      .trim(),
    body('link')
      .optional()
      .trim(),
    body('solvedAt')
      .optional()
      .custom(val => !val || !isNaN(Date.parse(val))).withMessage('Please enter a valid date')
  ]
};

// Interview preparation validator schemas for Phase 5
export const interviewValidator = {
  createQuestion: [
    body('company')
      .trim()
      .notEmpty().withMessage('Company name is required'),
    body('role')
      .trim()
      .notEmpty().withMessage('Job role is required'),
    body('category')
      .notEmpty().withMessage('Question category is required')
      .isIn(['HR', 'Technical', 'DSA', 'OOPs', 'DBMS', 'OS', 'CN', 'Projects'])
      .withMessage('Invalid question category'),
    body('question')
      .trim()
      .notEmpty().withMessage('Question text is required')
      .isLength({ min: 10 }).withMessage('Question must be at least 10 characters'),
    body('difficulty')
      .notEmpty().withMessage('Difficulty level is required')
      .isIn(['Easy', 'Medium', 'Hard']).withMessage('Difficulty must be Easy, Medium, or Hard'),
    body('source')
      .optional()
      .isIn(['Manual', 'AI Generated', 'Community']).withMessage('Invalid question source')
  ],
  createSession: [
    body('company')
      .trim()
      .notEmpty().withMessage('Company name is required'),
    body('role')
      .trim()
      .notEmpty().withMessage('Job role is required'),
    body('totalQuestions')
      .optional()
      .isInt({ min: 0 }).withMessage('Total questions must be a positive integer')
  ],
  updateSession: [
    body('attemptedQuestions')
      .optional()
      .isInt({ min: 0 }).withMessage('Attempted questions must be a positive integer'),
    body('totalQuestions')
      .optional()
      .isInt({ min: 0 }).withMessage('Total questions must be a positive integer'),
    body('confidenceScore')
      .optional()
      .isInt({ min: 0, max: 100 }).withMessage('Confidence score must be between 0 and 100'),
    body('notes')
      .optional()
      .trim()
  ],
  generateAI: [
    body('company')
      .trim()
      .notEmpty().withMessage('Company name is required for AI generation'),
    body('role')
      .trim()
      .notEmpty().withMessage('Job role is required for AI generation'),
    body('category')
      .notEmpty().withMessage('Question category is required')
      .isIn(['HR', 'Technical', 'DSA', 'OOPs', 'DBMS', 'OS', 'CN', 'Projects'])
      .withMessage('Invalid question category'),
    body('count')
      .optional()
      .isInt({ min: 1, max: 10 }).withMessage('Count must be between 1 and 10'),
    body('saveToBank')
      .optional()
      .isBoolean().withMessage('saveToBank must be a boolean')
  ]
};

