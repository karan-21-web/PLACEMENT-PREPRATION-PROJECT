import DSAProblem from '../models/DSAProblem.js';

/**
 * Add a new solved DSA problem
 * @param {string} userId
 * @param {Object} problemData
 * @returns {Object} Created problem document
 */
export const addProblem = async (userId, problemData) => {
  const problem = await DSAProblem.create({
    userId,
    ...problemData
  });
  return problem;
};

/**
 * Get all DSA problems for a user with optional filters
 * @param {string} userId
 * @param {Object} filters - { search, difficulty, topic, platform }
 * @returns {Array} List of problem documents
 */
export const getProblems = async (userId, filters = {}) => {
  const query = { userId };

  // Apply filters
  if (filters.difficulty && filters.difficulty !== 'all') {
    query.difficulty = filters.difficulty;
  }
  if (filters.topic && filters.topic !== 'all') {
    query.topic = filters.topic;
  }
  if (filters.platform && filters.platform !== 'all') {
    query.platform = filters.platform;
  }

  // Text search on title
  if (filters.search) {
    query.title = { $regex: filters.search, $options: 'i' };
  }

  const problems = await DSAProblem.find(query)
    .sort({ solvedAt: -1 });

  return problems;
};

/**
 * Get a single problem by ID with ownership check
 * @param {string} problemId
 * @param {string} userId
 * @returns {Object} Problem document
 */
export const getProblemById = async (problemId, userId) => {
  const problem = await DSAProblem.findOne({ _id: problemId, userId });
  if (!problem) {
    throw new Error('Problem not found or access denied');
  }
  return problem;
};

/**
 * Update a DSA problem
 * @param {string} problemId
 * @param {string} userId
 * @param {Object} updateData
 * @returns {Object} Updated problem document
 */
export const updateProblem = async (problemId, userId, updateData) => {
  const problem = await DSAProblem.findOne({ _id: problemId, userId });
  if (!problem) {
    throw new Error('Problem not found or access denied');
  }

  const allowedFields = ['title', 'difficulty', 'topic', 'platform', 'notes', 'link', 'solvedAt'];
  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      problem[field] = updateData[field];
    }
  });

  const updatedProblem = await problem.save();
  return updatedProblem;
};

/**
 * Delete a DSA problem
 * @param {string} problemId
 * @param {string} userId
 * @returns {Object} Deletion confirmation
 */
export const deleteProblem = async (problemId, userId) => {
  const problem = await DSAProblem.findOneAndDelete({ _id: problemId, userId });
  if (!problem) {
    throw new Error('Problem not found or access denied');
  }
  return { message: 'Problem removed successfully' };
};

/**
 * Get DSA stats for dashboard
 * @param {string} userId
 * @returns {Object} DSA statistics and distributions
 */
export const getDSAStats = async (userId) => {
  const problems = await DSAProblem.find({ userId });

  const totalSolved = problems.length;

  // Difficulty distribution
  const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
  
  // Topic distribution
  const topicDistribution = {};
  
  // Platform distribution
  const platformDistribution = {};

  problems.forEach((p) => {
    // Count difficulties
    if (difficultyCounts[p.difficulty] !== undefined) {
      difficultyCounts[p.difficulty]++;
    }

    // Count topics
    topicDistribution[p.topic] = (topicDistribution[p.topic] || 0) + 1;

    // Count platforms
    platformDistribution[p.platform] = (platformDistribution[p.platform] || 0) + 1;
  });

  return {
    totalSolved,
    difficultyCounts,
    topicDistribution,
    platformDistribution
  };
};
